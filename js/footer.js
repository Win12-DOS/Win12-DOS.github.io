// 加载 header 和 footer
Promise.all([
  fetch('/header.html').then(r => r.text()),
  fetch('/footer.html').then(r => r.text())
]).then(([header, footer]) => {
  const headerEl = document.getElementById('header');
  if (headerEl) headerEl.innerHTML = header;
  const footerEl = document.getElementById('footer');
  if (footerEl) footerEl.innerHTML = footer;
  initThemeToggle();
  initSmoothScroll();
  initMobileSidebar();
}).catch(error => {
  console.error('Error loading header/footer:', error);
});

// 主题切换 - 跟随系统（除非用户手动切换）
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    let theme;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme = savedTheme;
    } else {
      theme = getSystemTheme();
    }

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  initTheme();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// 平滑滚动
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });
}

// 移动端侧边栏
function initMobileSidebar() {
  const navMobile = document.querySelector('.nav-mobile');
  if (!navMobile) return;

  // 创建移动端侧边栏
  const overlay = document.createElement('div');
  overlay.className = 'mobile-sidebar-overlay';

  const sidebar = document.createElement('div');
  sidebar.className = 'mobile-sidebar';

  // 克隆首页侧边栏内容
  const desktopSidebar = document.querySelector('.sidebar');
  if (desktopSidebar) {
    sidebar.innerHTML = `
      <div class="mobile-sidebar-header">
        <h3>侧边栏</h3>
        <button class="mobile-sidebar-close">&times;</button>
      </div>
    ` + desktopSidebar.innerHTML;
  }

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  // 打开侧边栏
  navMobile.addEventListener('click', () => {
    overlay.classList.add('active');
    sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // 关闭侧边栏
  function closeSidebar() {
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', closeSidebar);
  const closeBtn = sidebar.querySelector('.mobile-sidebar-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

  // 点击侧边栏内链接后关闭
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}
