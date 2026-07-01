---
title: Redis 缓存策略与性能优化
date: 2024-05-20
category: Database
summary: 深入分析 Redis 缓存的设计模式，包括缓存击穿、雪崩和穿透问题的解决方案。
---

# Redis 缓存策略与性能优化

## 缓存设计模式

### Cache-Aside 模式

这是最常用的缓存模式，应用程序负责维护缓存和数据库的一致性：

```java
public User getUserById(Long id) {
    String key = "user:" + id;
    
    // 先从缓存获取
    String cachedUser = redisTemplate.opsForValue().get(key);
    if (cachedUser != null) {
        return JSON.parseObject(cachedUser, User.class);
    }
    
    // 缓存未命中，从数据库获取
    User user = userRepository.findById(id).orElse(null);
    
    // 更新缓存
    if (user != null) {
        redisTemplate.opsForValue().set(key, JSON.toJSONString(user), 
            Duration.ofMinutes(30));
    }
    
    return user;
}
```

### Write-Through 模式

写操作同时更新缓存和数据库，保证数据一致性：

```java
public void updateUser(User user) {
    // 更新数据库
    userRepository.save(user);
    
    // 更新缓存
    String key = "user:" + user.getId();
    redisTemplate.opsForValue().set(key, JSON.toJSONString(user),
        Duration.ofMinutes(30));
}
```

## 缓存问题解决方案

### 缓存击穿

**问题描述**：某个热点 key 过期瞬间，大量请求同时穿透到数据库。

**解决方案**：使用互斥锁（分布式锁）

```java
public User getUserByIdWithLock(Long id) {
    String key = "user:" + id;
    String lockKey = "lock:user:" + id;
    
    String cachedUser = redisTemplate.opsForValue().get(key);
    if (cachedUser != null) {
        return JSON.parseObject(cachedUser, User.class);
    }
    
    // 获取分布式锁
    Boolean locked = redisTemplate.opsForValue().setIfAbsent(
        lockKey, "1", Duration.ofSeconds(10));
    
    if (Boolean.TRUE.equals(locked)) {
        try {
            // 双重检查
            cachedUser = redisTemplate.opsForValue().get(key);
            if (cachedUser != null) {
                return JSON.parseObject(cachedUser, User.class);
            }
            
            // 从数据库获取
            User user = userRepository.findById(id).orElse(null);
            
            if (user != null) {
                redisTemplate.opsForValue().set(key, JSON.toJSONString(user),
                    Duration.ofMinutes(30));
            }
            return user;
        } finally {
            // 释放锁
            redisTemplate.delete(lockKey);
        }
    }
    
    // 等待锁释放后重试
    Thread.sleep(100);
    return getUserByIdWithLock(id);
}
```

### 缓存雪崩

**问题描述**：大量缓存 key 同时过期，导致请求全部打到数据库。

**解决方案**：

1. **随机过期时间**：为每个 key 设置随机的过期时间偏移
2. **多级缓存**：使用本地缓存 + Redis 缓存
3. **热点数据永不过期**：对于热点数据，设置较长的过期时间或不设置过期时间

```java
public void setCacheWithRandomExpire(String key, String value) {
    // 添加 0-10 分钟的随机偏移
    long randomMinutes = ThreadLocalRandom.current().nextLong(0, 10);
    Duration expireTime = Duration.ofMinutes(30 + randomMinutes);
    redisTemplate.opsForValue().set(key, value, expireTime);
}
```

### 缓存穿透

**问题描述**：请求不存在的数据，每次都穿透到数据库。

**解决方案**：

1. **空值缓存**：对不存在的数据也进行缓存
2. **布隆过滤器**：在缓存层前添加布隆过滤器

```java
public User getUserByIdPreventPenetration(Long id) {
    String key = "user:" + id;
    
    // 检查布隆过滤器
    if (!bloomFilter.mightContain(id)) {
        return null;
    }
    
    String cachedUser = redisTemplate.opsForValue().get(key);
    if (cachedUser != null) {
        if ("NULL".equals(cachedUser)) {
            return null;
        }
        return JSON.parseObject(cachedUser, User.class);
    }
    
    User user = userRepository.findById(id).orElse(null);
    
    if (user != null) {
        redisTemplate.opsForValue().set(key, JSON.toJSONString(user),
            Duration.ofMinutes(30));
    } else {
        // 缓存空值，防止穿透
        redisTemplate.opsForValue().set(key, "NULL", Duration.ofMinutes(5));
    }
    
    return user;
}
```

## 性能优化技巧

### 管道操作

使用管道批量执行命令，减少网络往返：

```java
public List<User> getUsersByIds(List<Long> ids) {
    List<String> keys = ids.stream()
        .map(id -> "user:" + id)
        .collect(Collectors.toList());
    
    // 批量获取
    List<String> cachedUsers = redisTemplate.opsForValue().multiGet(keys);
    
    return cachedUsers.stream()
        .filter(Objects::nonNull)
        .map(json -> JSON.parseObject(json, User.class))
        .collect(Collectors.toList());
}
```

### 数据压缩

对大体积数据进行压缩存储：

```java
public void setCompressedData(String key, Object value) {
    byte[] serialized = JSON.toJSONBytes(value);
    byte[] compressed = compress(serialized);
    redisTemplate.opsForValue().set(key, compressed);
}
```

### 分片策略

使用一致性哈希进行分片，保证数据均匀分布：

```java
public String getRedisNode(Long userId) {
    int hash = userId.hashCode();
    int nodeIndex = hash % redisNodes.size();
    return redisNodes.get(nodeIndex);
}
```

## 监控与运维

### 监控指标

- 缓存命中率
- 内存使用率
- 命令执行时间
- 连接数

### 备份策略

```bash
# RDB 备份
redis-cli SAVE

# AOF 持久化
redis-cli CONFIG SET appendonly yes
```

## 总结

合理的缓存策略是高并发系统的关键。需要根据业务场景选择合适的缓存模式，并做好缓存击穿、雪崩和穿透的防护措施。同时，持续监控和优化也是保证缓存系统稳定运行的重要环节。