export function renderCorePackages(packages, container) {
  container.innerHTML = packages.map(pkg => `
    <div class="package-card">
      ${pkg.logo ? `<img src="${pkg.logo}" class="pkg-logo" alt="${pkg.package} logo">` : ''}
      <h3>${pkg.package}</h3>
      <span class="version">v${pkg.version}</span>
      <span class="build-status ${pkg.status === 'success' ? 'status-ok' : 'status-fail'}">
        ${pkg.status === 'success' ? 'OK' : '!'}
      </span>
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
      <span class="version">v${pkg.version}</span>
      <span class="build-status ${pkg.status === 'success' ? 'status-ok' : 'status-fail'}">
        ${pkg.status === 'success' ? 'OK' : '!'}
      </span>
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
    <div class="vignette-group">
      <h3>${pkg}</h3>
      <ul>
        ${vigs.map(v => `
          <li><a href="${v.url}" target="_blank">${v.title}</a></li>
        `).join('')}
      </ul>
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
