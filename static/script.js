const SECTION_ICONS = {
  'Introduction': 'fa-user',
  'Notes': 'fa-book',
  'Red Teaming': 'fa-crosshairs',
  'Websecurity': 'fa-shield-halved',
  'API Hacking': 'fa-plug',
  'TryHackMe Writeups': 'fa-flag',
  'CTF': 'fa-plug',
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
  if (lowerTitle.includes('powershell') || lowerTitle.includes('server') || lowerTitle.includes('ctf') || lowerTitle.includes('lab')) return 'fas fa-terminal';
  if (lowerTitle.includes('kerberos') || lowerTitle.includes('roasting') || lowerTitle.includes('gain')) return 'fas fa-key';
  if (lowerTitle.includes('password')|| lowerTitle.includes('identification')) return 'fas fa-lock';
  if (lowerTitle.includes('privilege') || lowerTitle.includes('escalation')) return 'fas fa-arrow-up';
  if (lowerTitle.includes('about') || lowerTitle.includes('intro')) return 'fas fa-circle-info';
  if (lowerTitle.includes('recon') || lowerTitle.includes('gathering') || lowerTitle.includes('scan')) return 'fas fa-magnifying-glass';
  if (lowerTitle.includes('pwn')) return 'fas fa-code';
  if (lowerTitle.includes('api') || lowerTitle.includes('broken') || lowerTitle.includes('mass') || lowerTitle.includes('bypass') || lowerTitle.includes('force') || lowerTitle.includes('jwt')) return 'fas fa-plug';
  return 'fas fa-file-code';
}

function generateTableOfContents() {
  const contentEl = document.getElementById('content');
  const rightTocList = document.getElementById('right-toc-list');
  const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length === 0) {
    hideRightToc();
    return;
  } else {
    // Right TOC should already be shown when viewing a post
    // (showRightToc() is called in loadMarkdown)
  }
  
  const tocItems = Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent.trim();
    const id = `toc-${index}`;
    heading.id = id;
    
    const icon = level === 1 ? 'fas fa-bookmark' : 
                 level === 2 ? 'fas fa-chevron-right' : 
                 level === 3 ? 'fas fa-angle-right' : 'fas fa-circle';
    
    return `
      <li class="content-toc-item" data-level="${level}">
        <a href="#${id}" class="content-toc-link" data-level="${level}">
          <span>${text}</span>
        </a>
      </li>
    `;
  }).join('');
  
  if (rightTocList) {
    rightTocList.innerHTML = tocItems;
  }
  
  const tocHTML = `
    <div class="content-toc">
      <div class="content-toc-header">
        <h3><i class="fas fa-list"></i> Table of Contents</h3>
      </div>
      <ul class="content-toc-list">
        ${tocItems}
      </ul>
    </div>
  `;
  
  const existingToc = contentEl.querySelector('.content-toc');
  if (existingToc) {
    existingToc.remove();
  }
  
  const firstHeading = contentEl.querySelector('h1');
  if (firstHeading) {
    firstHeading.insertAdjacentHTML('afterend', tocHTML);
  } else {
    contentEl.insertAdjacentHTML('afterbegin', tocHTML);
  }
  
  const allTocLinks = document.querySelectorAll('.content-toc-link');
  allTocLinks.forEach(tocLink => {
    tocLink.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.content-toc-link').forEach(link => link.classList.remove('active'));
      const href = tocLink.getAttribute('href');
      document.querySelectorAll(`.content-toc-link[href="${href}"]`).forEach(link => link.classList.add('active'));
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    });
  });
  setupScrollSpy();
}

function setupScrollSpy() {
  const contentEl = document.getElementById('content');
  let ticking = false;

  function updateActiveHeading() {
    const headings = Array.from(contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(h => h.id);
    const scrollTop = contentEl.scrollTop;
    const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
    
    if (scrollTop >= contentHeight - 50) {
      const lastHeading = headings[headings.length - 1];
      if (lastHeading) {
        document.querySelectorAll('.content-toc-link').forEach(link => link.classList.remove('active'));
        const lastHref = `#${lastHeading.id}`;
        document.querySelectorAll(`.content-toc-link[href="${lastHref}"]`).forEach(link => link.classList.add('active'));
      }
      return;
    }

    let activeHeading = null;
    
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const rect = heading.getBoundingClientRect();
      const contentRect = contentEl.getBoundingClientRect();
      if (rect.top <= contentRect.top + 100) {
        activeHeading = heading;
        break;
      }
    }
    
    if (activeHeading) {
      document.querySelectorAll('.content-toc-link').forEach(link => link.classList.remove('active'));
      const activeHref = `#${activeHeading.id}`;
      document.querySelectorAll(`.content-toc-link[href="${activeHref}"]`).forEach(link => link.classList.add('active'));
    }
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveHeading);
      ticking = true;
      setTimeout(() => { ticking = false; }, 10);
    }
  }
  contentEl.removeEventListener('scroll', requestTick);
  contentEl.addEventListener('scroll', requestTick);
  setTimeout(updateActiveHeading, 100);
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
    showRightToc();
    generateTableOfContents();
    addShareButton(filePath);

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

function generateTopicNavbar() {
  const navList = document.getElementById('topic-nav-list');
  let totalPosts = 0;
  let totalCategories = SIDEBAR_CONFIG.length;
  
  navList.innerHTML = SIDEBAR_CONFIG.map(section => {
    totalPosts += section.items.length;
    
    return `
      <li class="topic-nav-item" data-topic="${section.section}">
        <span>${section.section}</span>
      </li>
    `;
  }).join('');

  const totalPostsEl = document.getElementById('total-posts');
  const totalCategoriesEl = document.getElementById('total-categories');
  if (totalPostsEl) totalPostsEl.textContent = totalPosts;
  if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
  navList.addEventListener('click', e => {
    const topicItem = e.target.closest('.topic-nav-item');
    if (!topicItem) return;
    
    const topicName = topicItem.dataset.topic;
    document.querySelectorAll('.topic-nav-item').forEach(item => item.classList.remove('active'));
    topicItem.classList.add('active');
    loadSubtopics(topicName); // Load subtopics first
    loadTopicContent(topicName); // Then load content (which will show sidebar)
  });
}

function loadSubtopics(topicName) {
  const subtopicList = document.getElementById('subtopic-list');
  const topicData = SIDEBAR_CONFIG.find(section => section.section === topicName);
  
  if (!topicData) return;
  subtopicList.innerHTML = topicData.items.map(item => {
    return `<li><a href="#" data-md="${item.path}">${item.title}</a></li>`;
  }).join('');
  const newSubtopicList = subtopicList.cloneNode(true);
  subtopicList.parentNode.replaceChild(newSubtopicList, subtopicList);
  newSubtopicList.addEventListener('click', e => {
    const linkItem = e.target.closest('a[data-md]');
    if (!linkItem) return;
    
    e.preventDefault();
    document.querySelectorAll('#subtopic-list a').forEach(a => a.classList.remove('active'));
    linkItem.classList.add('active');
    window.location.hash = linkItem.dataset.md;
    loadMarkdown(linkItem.dataset.md);
    document.getElementById('sidebar').classList.remove('active');
  });
}

function loadTopicContent(topicName) {
  const topicData = SIDEBAR_CONFIG.find(section => section.section === topicName);
  
  if (!topicData || topicData.items.length === 0) return;
  const firstTopic = topicData.items[0];
  window.location.hash = firstTopic.path;
  loadMarkdown(firstTopic.path);
  showSidebar();
  setTimeout(() => {
    const firstSubtopicLink = document.querySelector(`#subtopic-list a[data-md="${firstTopic.path}"]`);
    if (firstSubtopicLink) {
      document.querySelectorAll('#subtopic-list a').forEach(a => a.classList.remove('active'));
      firstSubtopicLink.classList.add('active');
    }
  }, 100);
}

function showSidebar() {
  const layout = document.querySelector('.layout');
  layout.classList.remove('sidebar-hidden');
  layout.classList.add('sidebar-visible');
}

function hideSidebar() {
  const layout = document.querySelector('.layout');
  layout.classList.remove('sidebar-visible');
  layout.classList.add('sidebar-hidden');
}

function showRightToc() {
  const rightToc = document.getElementById('right-toc');
  if (rightToc) {
    if (window.innerWidth > 1200) {
      rightToc.style.display = 'block';
    } else {
      rightToc.style.display = 'none';
    }
  }
}

function hideRightToc() {
  const rightToc = document.getElementById('right-toc');
  if (rightToc) {
    rightToc.style.display = 'none';
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

function setupSearch() {
  const search = document.getElementById('search');
  if (!search) return;
  
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll('.topic-nav-item').forEach(item => {
      const matches = !q || item.textContent.toLowerCase().includes(q);
      item.style.display = matches ? '' : 'none';
    });
    document.querySelectorAll('#subtopic-list a').forEach(link => {
      const matches = !q || link.textContent.toLowerCase().includes(q);
      link.parentElement.style.display = matches ? '' : 'none';
    });
  });
  
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      search.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  generateTopicNavbar();
  setupMobileMenu();
  setupThemeToggle();
  setupSearch();
  hideSidebar();
  hideRightToc();
  
  window.addEventListener('resize', () => {
    const rightToc = document.getElementById('right-toc');
    if (rightToc) {
      if (window.innerWidth <= 1200) {
        rightToc.style.display = 'none';
      } else if (document.getElementById('content').innerHTML.trim() && 
                 document.getElementById('content').innerHTML !== `<div class="loading-state"><div class="loading-spinner"></div><p>Loading content...</p></div>`) {
        rightToc.style.display = 'block';
      }
    }
  });
  
  const hash = window.location.hash.slice(1);
  if (hash) {
    let foundTopic = null;
    let foundArticle = null;
    
    SIDEBAR_CONFIG.forEach(section => {
      const article = section.items.find(item => item.path === hash);
      if (article) {
        foundTopic = section.section;
        foundArticle = article;
      }
    });
    
    if (foundTopic) {
      const topicItem = document.querySelector(`[data-topic="${foundTopic}"]`);
      if (topicItem) {
        topicItem.classList.add('active');
        loadSubtopics(foundTopic);
        showSidebar();
        setTimeout(() => {
          const articleLink = document.querySelector(`#subtopic-list a[data-md="${hash}"]`);
          if (articleLink) {
            articleLink.classList.add('active');
          }
          loadMarkdown(hash);
        }, 100);
      }
    }
  } else {
    if (SIDEBAR_CONFIG.length > 0) {
      const firstTopic = SIDEBAR_CONFIG[0].section;
      const firstTopicItem = document.querySelector(`[data-topic="${firstTopic}"]`);
      if (firstTopicItem) {
        firstTopicItem.classList.add('active');
        loadSubtopics(firstTopic);
        loadTopicContent(firstTopic);
      }
    }
  }
});

function addShareButton(filePath) {
  const contentEl = document.getElementById('content');
  
  // Remove existing share button
  const existingShareBtn = contentEl.querySelector('.share-post-btn');
  if (existingShareBtn) {
    existingShareBtn.remove();
  }

  // Add share button to the content area
  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-post-btn';
  shareBtn.innerHTML = '<i class="fas fa-link"></i>';
  shareBtn.title = 'Copy link to this post';
  
  shareBtn.addEventListener('click', async () => {
    const currentUrl = window.location.origin + window.location.pathname + '#' + filePath;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      shareBtn.innerHTML = '<i class="fas fa-check"></i>';
      shareBtn.classList.add('success');
      shareBtn.title = 'Link copied!';
      setTimeout(() => {
        shareBtn.innerHTML = '<i class="fas fa-link"></i>';
        shareBtn.classList.remove('success');
        shareBtn.title = 'Copy link to this post';
      }, 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      fallbackCopyTextToClipboard(currentUrl, shareBtn);
    }
  });
  
  contentEl.appendChild(shareBtn);
}

function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add('success');
      button.title = 'Link copied!';
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-link"></i>';
        button.classList.remove('success');
        button.title = 'Copy link to this post';
      }, 2000);
    } else {
      button.innerHTML = '<i class="fas fa-times"></i>';
      button.title = 'Copy failed';
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-link"></i>';
        button.title = 'Copy link to this post';
      }, 2000);
    }
  } catch (err) {
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.title = 'Copy failed';
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-link"></i>';
      button.title = 'Copy link to this post';
    }, 2000);
  }
  
  document.body.removeChild(textArea);
}
