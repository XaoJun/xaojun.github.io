---
title: Vue3 个人博客从 0 到 1 的搭建笔记
date: 2024-06-18
category: Vue
summary: 记录路由、组件拆分、文章数据组织、响应式布局和部署流程中的关键取舍。
---

# Vue3 个人博客从 0 到 1 的搭建笔记

## 项目初始化

使用 Vite 创建 Vue3 项目是最快的方式：

```bash
npm create vite@6.5.0 . -- --template vue
```

这会生成一个基础的 Vue3 + Vite 项目结构，包含 `src/App.vue`、`src/main.js` 和必要的配置文件。

## 路由配置

安装 Vue Router：

```bash
npm install vue-router@4
```

创建路由配置文件 `src/router/index.js`：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogListView.vue') },
    { path: '/blog/:slug', name: 'blog-detail', component: () => import('../views/BlogDetailView.vue') },
  ],
})

export default router
```

## 组件拆分

将首页拆分为多个小组件，保持代码的可维护性：

- `HeroSection.vue` - 首屏展示区域
- `PostList.vue` - 文章列表
- `ProfileCard.vue` - 个人信息卡片

## 样式设计

使用 CSS 变量管理主题色，支持暗色模式：

```css
:root {
  --bg: #fbfaf7;
  --surface: #ffffff;
  --text: #5d5a54;
  --heading: #17130f;
  --accent: #8b5cf6;
}
```

## 部署流程

使用 GitHub Pages 部署静态站点，配置 `.github/workflows/deploy.yml` 实现自动化部署。

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 总结

通过合理的组件拆分和路由设计，可以快速搭建一个功能完善的个人博客。Vue3 的 Composition API 让代码更加清晰，Vite 的快速开发体验也大大提升了开发效率。