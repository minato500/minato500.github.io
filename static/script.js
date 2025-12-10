const SECTION_ICONS = {
  'Introduction': 'fa-user',
  'Notes': 'fa-book',
  'Red Teaming': 'fa-crosshairs',
  'Websecurity': 'fa-shield-halved',
  'TryHackMe Writeups': 'fa-flag',
  'default': 'fa-file-lines'
};

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let newTheme;
  if (currentTheme === 'light') {
    newTheme = 'dark';
  } else if (currentTheme === 'dark') {
    newTheme = 'light';
  } else {
    newTheme = prefersDark ? 'light' : 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.removeAttribute('data-theme');
    }
  });
}

initTheme();

function getItemIcon(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('linux')) return 'fab fa-linux';
  if (lowerTitle.includes('windows')) return 'fab fa-windows';
  if (lowerTitle.includes('active directory') || lowerTitle.includes('domain') || (lowerTitle.includes('ntlm')) || (lowerTitle.includes('inveigh'))) return 'fas fa-network-wired';
  if (lowerTitle.includes('powershell')) return 'fas fa-terminal';
  if (lowerTitle.includes('kerberos') || lowerTitle.includes('roasting')) return 'fas fa-key';
  if (lowerTitle.includes('password')) return 'fas fa-lock';
  if (lowerTitle.includes('privilege') || lowerTitle.includes('escalation')) return 'fas fa-arrow-up';
  if (lowerTitle.includes('about') || lowerTitle.includes('intro')) return 'fas fa-circle-info';
  if (lowerTitle.includes('recon') || lowerTitle.includes('gathering')) return 'fas fa-magnifying-glass';
  if (lowerTitle.includes('pwn')) return 'fas fa-code';
  return 'fas fa-file-code';
}

async function loadMarkdown(filePath) {
  const contentEl = document.getElementById('content');
  contentEl.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading content...</p>
    </div>
  `;
  
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    contentEl.innerHTML = marked.parse(md, { breaks: true });
    contentEl.scrollTop = 0;

    const codeBlocks = contentEl.querySelectorAll('pre code');
    codeBlocks.forEach(codeEl => {
      const rawCode = codeEl.textContent || '';
      codeEl.textContent = rawCode; 

      const pre = codeEl.closest('pre');
      if (pre) {
        const existingBtn = pre.querySelector('.copy-btn');
        if (existingBtn) existingBtn.remove();

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(rawCode);
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> Copy', 1400);
          } catch {
            btn.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> Copy', 1400);
          }
        });
        pre.appendChild(btn);
      }
    });

    const imgs = contentEl.querySelectorAll('img');
    imgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        overlay.appendChild(fullImg);
        overlay.addEventListener('click', () => overlay.remove());
        document.addEventListener('keydown', function escHandler(e) {
          if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
          }
        });
        document.body.appendChild(overlay);
      });
    });

  } catch (err) {
    contentEl.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Content</h3>
        <p>${err.message}</p>
      </div>
    `;
    console.error(err);
  }
}

function generateSidebar() {
  const list = document.getElementById('md-list');
  let totalPosts = 0;
  let totalCategories = SIDEBAR_CONFIG.length;
  
  list.innerHTML = SIDEBAR_CONFIG.map(section => {
    const sectionIcon = SECTION_ICONS[section.section] || SECTION_ICONS['default'];
    const header = `<li class="sidebar-section"><i class="fas ${sectionIcon}"></i>${section.section}</li>`;
    const links = section.items.map(it => {
      totalPosts++;
      const itemIcon = getItemIcon(it.title);
      return `<li><a href="#" data-md="${it.path}"><i class="${itemIcon}"></i>${it.title}</a></li>`;
    }).join('');
    return header + links;
  }).join('');

  const totalPostsEl = document.getElementById('total-posts');
  const totalCategoriesEl = document.getElementById('total-categories');
  if (totalPostsEl) totalPostsEl.textContent = totalPosts;
  if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;

  list.addEventListener('click', e => {
    const a = e.target.closest('a[data-md]');
    if (!a) return;
    e.preventDefault();

    document.querySelectorAll('#md-list a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');

    window.location.hash = a.dataset.md;
    loadMarkdown(a.dataset.md);
    
    document.getElementById('sidebar').classList.remove('active');
  });

  const search = document.getElementById('search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('#md-list li').forEach(li => {
        const a = li.querySelector('a');
        if (li.classList.contains('sidebar-section')) {
          li.style.display = '';
          return;
        }
        const matches = !q || (a && a.textContent.toLowerCase().includes(q));
        li.style.display = matches ? '' : 'none';
      });
    });
    
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        search.focus();
      }
    });
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      const icon = toggle.querySelector('i');
      if (sidebar.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        const icon = toggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  generateSidebar();
  setupMobileMenu();
  setupThemeToggle();
  
  const hash = window.location.hash.slice(1);
  let targetLink = document.querySelector(`#md-list a[data-md="${hash}"]`);
  if (!targetLink) targetLink = document.querySelector('#md-list a[data-md]');
  if (targetLink) {
    targetLink.classList.add('active');
    loadMarkdown(targetLink.dataset.md);
  }
});
