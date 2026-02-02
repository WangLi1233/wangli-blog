/**
 * 王力的博客日志 - 主脚本
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  initPage();
});

/**
 * 初始化页面
 */
function initPage() {
  // 渲染文章列表
  renderArticles('all');

  // 渲染侧边栏
  renderCategoryList();
  renderTagCloud();

  // 更新统计数据
  updateStats();

  // 绑定筛选按钮事件
  bindFilterEvents();

  // 初始化滚动监听
  initScrollListener();
}

/**
 * 渲染文章列表
 */
function renderArticles(filter = 'all') {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;

  const articles = getArticlesByCategory(filter);

  if (articles.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">暂无文章</p>';
    return;
  }

  grid.innerHTML = articles.map(article => createArticleCard(article)).join('');
}

/**
 * 创建文章卡片 HTML
 */
function createArticleCard(article) {
  const categoryInfo = categories.find(c => c.id === article.category) || { name: '其他', icon: '📚' };

  const coverContent = article.cover
    ? `<img src="${article.cover}" alt="${article.title}">`
    : `<div class="cover-placeholder">${categoryInfo.icon}</div>`;

  const tagsHtml = article.tags.slice(0, 2).map(tag =>
    `<span>${tag}</span>`
  ).join('');

  return `
    <article class="article-card" data-category="${article.category}">
      <div class="article-cover">
        ${coverContent}
        <span class="article-category">${categoryInfo.name}</span>
      </div>
      <div class="article-body">
        <h3><a href="${article.url}">${article.title}</a></h3>
        <p class="article-excerpt">${article.excerpt}</p>
        <div class="article-meta">
          <span class="article-date">${formatDate(article.date)}</span>
          <div class="article-tags">${tagsHtml}</div>
        </div>
      </div>
    </article>
  `;
}

/**
 * 渲染分类列表
 */
function renderCategoryList() {
  const list = document.getElementById('categoryList');
  if (!list) return;

  const stats = getCategoryStats();

  list.innerHTML = categories.map(category => {
    const count = stats[category.id] || 0;
    return `
      <li>
        <a href="categories.html#${category.id}">
          <span>${category.name}</span>
          <span class="count">${count}</span>
        </a>
      </li>
    `;
  }).join('');
}

/**
 * 渲染标签云
 */
function renderTagCloud() {
  const cloud = document.getElementById('tagCloud');
  if (!cloud) return;

  const tags = getAllTags();

  cloud.innerHTML = tags.map(tag =>
    `<a href="categories.html?tag=${encodeURIComponent(tag)}">${tag}</a>`
  ).join('');
}

/**
 * 更新统计数据
 */
function updateStats() {
  const articleCount = document.getElementById('articleCount');
  const categoryCount = document.getElementById('categoryCount');
  const tagCount = document.getElementById('tagCount');

  if (articleCount) {
    animateNumber(articleCount, getAllArticles().length);
  }
  if (categoryCount) {
    animateNumber(categoryCount, categories.length);
  }
  if (tagCount) {
    animateNumber(tagCount, getAllTags().length);
  }
}

/**
 * 数字动画效果
 */
function animateNumber(element, target) {
  let current = 0;
  const duration = 1000;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/**
 * 绑定筛选按钮事件
 */
function bindFilterEvents() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // 筛选文章
      const filter = this.dataset.filter;
      renderArticles(filter);
    });
  });
}

/**
 * 初始化滚动监听
 */
function initScrollListener() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    if (backToTop) {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
}

/**
 * 滚动到顶部
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * 切换移动端菜单
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 搜索文章（预留功能）
 */
function searchArticles(keyword) {
  if (!keyword) return getAllArticles();

  const lowerKeyword = keyword.toLowerCase();
  return getAllArticles().filter(article =>
    article.title.toLowerCase().includes(lowerKeyword) ||
    article.excerpt.toLowerCase().includes(lowerKeyword) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
}
