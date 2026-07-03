# Vue3 个人博客

这是一个使用 Vue3 + Vite 编写的个人博客首页，参考了 `https://blog.octkun.site/` 的简洁内容结构：

- 顶部导航
- 个人介绍
- 社交入口
- 最新文章
- 最新提示词
- 关于说明

## 开发

先启动后端服务：

```bash
cd D:\blogspringboot
mvn spring-boot:run
```

再启动前端：

```bash
npm install
npm run dev
```

开发环境下，Vite 会把 `/api` 请求代理到 `http://localhost:8080`。

## 构建

```bash
npm run build
```

生产环境如果前后端不在同一个域名下，可以在构建前设置后端地址：

```bash
set VITE_API_BASE_URL=https://your-api-domain.com
npm run build
```

页面数据现在来自后端接口，包括首页、博客列表、博客详情、照片和简历。
