async function loadMarkdown(filePath) {
  const contentEl = document.getElementById('content');
  contentEl.innerHTML = `<p style="opacity:.6">Loading…</p>`;
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    contentEl.innerHTML = marked.parse(md, { breaks: true });

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
        btn.innerText = 'Copy';
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(rawCode);
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = 'Copy', 1400);
          } catch {
            btn.innerText = 'Fail';
            setTimeout(() => btn.innerText = 'Copy', 1400);
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
        document.body.appendChild(overlay);
      });
    });

  } catch (err) {
    contentEl.innerHTML = `<p style="color:salmon">⚠️ Error loading file: ${err.message}</p>`;
    console.error(err);
  }
}

function generateSidebar() {
  const list = document.getElementById('md-list');
  list.innerHTML = SIDEBAR_CONFIG.map(section => {
    const header = `<li class="sidebar-section">${section.section}</li>`;
    const links = section.items.map(it =>
      `<li><a href="#" data-md="${it.path}">${it.title}</a></li>`
    ).join('');
    return header + links;
  }).join('');

  list.addEventListener('click', e => {
    const a = e.target.closest('a[data-md]');
    if (!a) return;
    e.preventDefault();

    document.querySelectorAll('#md-list a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');

    window.location.hash = a.dataset.md;
    loadMarkdown(a.dataset.md);
  });

  const search = document.getElementById('search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('#md-list li').forEach(li => {
        const a = li.querySelector('a');
        const matches = !q || (a && a.textContent.toLowerCase().includes(q));
        li.style.display = matches ? '' : 'none';
      });
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  generateSidebar();
  const hash = window.location.hash.slice(1);
  let targetLink = document.querySelector(`#md-list a[data-md="${hash}"]`);
  if (!targetLink) targetLink = document.querySelector('#md-list a[data-md]');
  if (targetLink) {
    targetLink.classList.add('active');
    loadMarkdown(targetLink.dataset.md);
  }
});
