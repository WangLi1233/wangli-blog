# 王力的博客日志 - 部署指南

## 快速部署到 GitHub Pages（免费）

### 步骤 1：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` -> `New repository`
3. 仓库名称填写：`wangli-blog`（或你喜欢的名字）
4. 选择 `Public`（公开）
5. 点击 `Create repository`

### 步骤 2：上传代码

在博客文件夹（blog）中打开终端，执行：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 王力的博客日志"

# 添加远程仓库（替换为你的用户名和仓库名）
git remote add origin https://github.com/你的用户名/wangli-blog.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 `Settings`
2. 左侧菜单点击 `Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，文件夹选择 `/ (root)`
5. 点击 `Save`

### 步骤 4：访问你的博客

等待几分钟后，访问：
```
https://你的用户名.github.io/wangli-blog/
```

---

## 如何添加新文章

### 1. 编辑文章数据

打开 `js/articles.js`，在 `articles` 数组中添加新文章信息：

```javascript
{
  id: 9,  // 唯一ID，递增
  title: '你的文章标题',
  excerpt: '文章摘要，100-150字左右...',
  category: 'javascript',  // 分类：javascript/react/vue/css/other
  tags: ['标签1', '标签2'],
  date: '2026-02-02',  // 发布日期
  cover: '',  // 封面图URL（可选）
  url: 'posts/your-article.html'  // 文章页面路径
}
```

### 2. 创建文章页面

在 `posts` 文件夹中创建新的 HTML 文件，可以复制现有文章作为模板：

```bash
# 复制模板
cp posts/javascript-closure.html posts/your-article.html
```

然后编辑文件，修改标题和内容。

### 3. 推送更新

```bash
git add .
git commit -m "添加新文章: 你的文章标题"
git push
```

---

## 自定义配置

### 修改博主信息

编辑以下文件中的个人信息：
- `index.html` - 侧边栏作者信息
- `about.html` - 关于页面
- `js/articles.js` - 分类配置

### 修改导航链接

编辑各 HTML 文件中的 `<nav>` 部分，更新 GitHub 链接等。

### 修改样式主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --primary: #6366f1;      /* 主色调 */
  --primary-dark: #4f46e5; /* 深色主色调 */
  --secondary: #10b981;    /* 次要色 */
  /* ... */
}
```

---

## 目录结构

```
blog/
├── index.html          # 首页
├── categories.html     # 分类页
├── about.html          # 关于页
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── articles.js     # 文章数据（添加新文章在这里）
│   └── main.js         # 主脚本
└── posts/              # 文章详情页
    ├── javascript-closure.html
    ├── react-hooks.html
    └── vue3-composition-api.html
```

---

## 其他部署选项

### Vercel（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 登录
3. 点击 `Import Project`
4. 选择你的博客仓库
5. 直接部署，自动获得 HTTPS 域名

### Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽 blog 文件夹到页面
3. 自动部署完成

### 自定义域名

如果你有自己的域名，可以：
1. 在仓库根目录创建 `CNAME` 文件，写入你的域名
2. 在域名 DNS 设置中添加 CNAME 记录指向 `你的用户名.github.io`

---

## 常见问题

**Q: 图片如何添加？**
A: 在仓库中创建 `images` 文件夹，将图片上传后在文章中引用：
```html
<img src="../images/your-image.png" alt="描述">
```

**Q: 如何添加评论功能？**
A: 可以使用 [Giscus](https://giscus.app/)（基于 GitHub Discussions）或 [Utterances](https://utteranc.es/)

**Q: 如何添加访问统计？**
A: 可以使用 [Google Analytics](https://analytics.google.com/) 或 [百度统计](https://tongji.baidu.com/)

---

祝你博客顺利上线！
