export function renderCorePackages(packages, container) {
  container.innerHTML = packages.map(pkg => `
    <div class="package-card">
      ${pkg.logo ? `<img src="${pkg.logo}" class="pkg-logo" alt="${pkg.package} logo">` : ''}
      <h3>${pkg.package}</h3>
      <div class="package-meta">
        <span class="version">v${pkg.version}</span>
        <span class="build-status ${pkg.status === 'success' ? 'status-ok' : 'status-fail'}">
          ${pkg.status === 'success' ? 'OK' : '!'}
        </span>
      </div>
      <p class="description">${pkg.description || pkg.title}</p>
      <div class="links">
        <a href="${pkg.pkgdown_url}" target="_blank">Docs</a> |
        <a href="${pkg.github_url}" target="_blank">GitHub</a>
      </div>
    </div>
  `).join('');
}

export function renderAtlasPackages(packages, container) {
  container.innerHTML = packages.map(pkg => `
    <div class="atlas-card">
      ${pkg.logo ? `<img src="${pkg.logo}" class="pkg-logo" alt="${pkg.package} logo">` : ''}
      <h4>${pkg.package}</h4>
      <div class="package-meta">
        <span class="version">v${pkg.version}</span>
        <span class="build-status ${pkg.status === 'success' ? 'status-ok' : 'status-fail'}">
          ${pkg.status === 'success' ? 'OK' : '!'}
        </span>
      </div>
      <div class="links">
        <a href="${pkg.pkgdown_url}" target="_blank">Docs</a> |
        <a href="${pkg.github_url}" target="_blank">GitHub</a>
      </div>
    </div>
  `).join('');
}

export function renderVignettes(vignettes, container) {
  const grouped = {};
  for (const v of vignettes) {
    if (!grouped[v.package]) grouped[v.package] = [];
    grouped[v.package].push(v);
  }

  container.innerHTML = Object.entries(grouped).map(([pkg, vigs]) => `
    <div class="docs-package-card">
      <div class="docs-package-header">
        <h3>${pkg}</h3>
        <a href="https://ggseg.github.io/${pkg}/" target="_blank" class="docs-site-link">
          Full docs &rarr;
        </a>
      </div>
      <div class="vignette-list">
        ${vigs.map(v => `
          <a href="${v.url}" target="_blank" class="vignette-item">
            <span class="vignette-icon">📄</span>
            <span class="vignette-title">${v.title}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

export function renderContributors(contributors, container) {
  container.innerHTML = contributors.map(c => `
    <div class="contributor-card">
      <a href="https://github.com/${c.user}" target="_blank">
        <img src="${c.avatar_url}" alt="${c.user}" loading="lazy">
      </a>
      <div class="name">${c.user}</div>
      <div class="contributions">${c.contributions} contributions</div>
    </div>
  `).join('');
}

export function renderFunders(data, container) {
  container.innerHTML = data.categories.map(cat => `
    <div class="funding-category">
      <h3 class="funding-category-title">
        <span class="funding-icon">${cat.icon}</span>
        ${cat.name}
      </h3>
      <div class="funder-grid">
        ${cat.funders.map(f => `
          <a href="${f.url}" target="_blank" class="funder-card">
            ${f.grant ? `<span class="grant-badge">Grant ${f.grant}</span>` : ''}
            <h4>${f.name}</h4>
            <p class="funder-description">${f.description}</p>
            ${f.pi ? `<span class="funder-pi">PI: ${f.pi}</span>` : ''}
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}
