/**
 * 王力的博客日志 - 文章数据
 *
 * 【如何添加新文章】
 * 1. 在下方 articles 数组中添加新的文章对象
 * 2. 在 posts 文件夹中创建对应的 HTML 文件
 *
 * 文章对象结构：
 * {
 *   id: 唯一标识符（数字）,
 *   title: '文章标题',
 *   excerpt: '文章摘要（100-150字）',
 *   category: '分类（javascript/react/vue/css/other）',
 *   tags: ['标签1', '标签2'],
 *   date: '发布日期',
 *   cover: '封面图片URL（可选）',
 *   url: '文章详情页链接'
 * }
 */

const articles = [
  {
    id: 1,
    title: 'JavaScript 闭包详解：从原理到实践',
    excerpt: '闭包是 JavaScript 中最重要的概念之一，理解闭包对于编写高质量的 JavaScript 代码至关重要。本文将深入讲解闭包的原理、应用场景以及常见的面试题。',
    category: 'javascript',
    tags: ['JavaScript', '闭包', '面试'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/javascript-closure.html'
  },
  {
    id: 2,
    title: 'React Hooks 完全指南',
    excerpt: 'React Hooks 是 React 16.8 引入的新特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。本文详细介绍 useState、useEffect、useContext 等常用 Hooks。',
    category: 'react',
    tags: ['React', 'Hooks', '前端框架'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/react-hooks.html'
  },
  {
    id: 3,
    title: 'Vue 3 组合式 API 入门与实践',
    excerpt: 'Vue 3 的组合式 API（Composition API）提供了一种更灵活的方式来组织组件逻辑。本文将带你从零开始学习 setup、ref、reactive、computed 等核心概念。',
    category: 'vue',
    tags: ['Vue', 'Vue3', '组合式API'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/vue3-composition-api.html'
  },
  {
    id: 4,
    title: '原生 JavaScript 实现防抖与节流',
    excerpt: '防抖（Debounce）和节流（Throttle）是前端性能优化中常用的技术，能有效减少高频事件的触发次数。本文将用原生 JS 手写实现，并分析其应用场景。',
    category: 'javascript',
    tags: ['JavaScript', '性能优化', '手写代码'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/debounce-throttle.html'
  },
  {
    id: 5,
    title: 'React 状态管理：Redux vs Zustand',
    excerpt: '状态管理是 React 应用开发中的重要话题。本文对比分析 Redux 和 Zustand 两种流行的状态管理方案，帮助你选择最适合项目的工具。',
    category: 'react',
    tags: ['React', 'Redux', 'Zustand', '状态管理'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/redux-vs-zustand.html'
  },
  {
    id: 6,
    title: 'Vue Router 4 路由守卫详解',
    excerpt: 'Vue Router 是 Vue.js 的官方路由管理器。本文深入讲解 Vue Router 4 中的全局守卫、路由独享守卫、组件内守卫的使用方法和最佳实践。',
    category: 'vue',
    tags: ['Vue', 'Vue Router', '路由'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/vue-router-guards.html'
  },
  {
    id: 7,
    title: 'ES6+ 新特性全面总结',
    excerpt: '从 ES6 到 ES2023，JavaScript 引入了大量新特性。本文全面总结箭头函数、解构赋值、Promise、async/await、可选链等常用特性的使用方法。',
    category: 'javascript',
    tags: ['JavaScript', 'ES6', '新特性'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/es6-features.html'
  },
  {
    id: 8,
    title: '深入理解 JavaScript 事件循环',
    excerpt: '事件循环（Event Loop）是 JavaScript 异步编程的核心机制。本文通过图解的方式，帮助你彻底理解宏任务、微任务以及它们的执行顺序。',
    category: 'javascript',
    tags: ['JavaScript', '事件循环', '异步'],
    date: '2026-02-02',
    cover: '',
    url: 'posts/event-loop.html'
  }
];

/**
 * 分类配置
 * 可以在这里添加新的分类
 */
const categories = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    description: '原生 JavaScript 核心知识与技巧',
    color: '#f7df1e'
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    description: 'React 框架学习与实战经验',
    color: '#61dafb'
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: 'V',
    description: 'Vue.js 框架深入学习',
    color: '#42b883'
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '#',
    description: 'CSS 样式技巧与布局方案',
    color: '#264de4'
  },
  {
    id: 'other',
    name: '其他',
    icon: '📚',
    description: '前端工程化、工具与其他技术',
    color: '#6366f1'
  }
];

/**
 * 获取所有文章
 */
function getAllArticles() {
  return articles;
}

/**
 * 根据分类获取文章
 */
function getArticlesByCategory(category) {
  if (category === 'all') return articles;
  return articles.filter(article => article.category === category);
}

/**
 * 根据ID获取文章
 */
function getArticleById(id) {
  return articles.find(article => article.id === id);
}

/**
 * 获取所有标签
 */
function getAllTags() {
  const tagSet = new Set();
  articles.forEach(article => {
    article.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
}

/**
 * 获取分类统计
 */
function getCategoryStats() {
  const stats = {};
  articles.forEach(article => {
    stats[article.category] = (stats[article.category] || 0) + 1;
  });
  return stats;
}

/**
 * 获取所有分类
 */
function getAllCategories() {
  return categories;
}
