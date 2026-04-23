const API_URL = 'https://ggsegverse.r-universe.dev/api/packages';
const CORE_PACKAGES = ['ggseg', 'ggseg3d', 'ggseg.formats', 'ggseg.extra'];

let cachedData = null;

export async function fetchPackages() {
  if (cachedData) return cachedData;

  const response = await fetch(API_URL);
  const data = await response.json();
  cachedData = data.filter(pkg => pkg.Title);
  return cachedData;
}

export async function getCorePackages() {
  const packages = await fetchPackages();
  return CORE_PACKAGES
    .map(name => packages.find(p => p.Package === name))
    .filter(Boolean)
    .map(transformPackage);
}

export async function getAtlasPackages() {
  const packages = await fetchPackages();
  return packages
    .filter(p => p.Package.startsWith('ggseg') && !CORE_PACKAGES.includes(p.Package))
    .sort((a, b) => a.Package.localeCompare(b.Package))
    .map(transformPackage);
}

export async function getVignettes() {
  const packages = await fetchPackages();
  const vignettes = [];

  for (const pkg of packages) {
    if (!pkg.Package.startsWith('ggseg')) continue;
    const vigs = pkg._vignettes || [];
    for (const vig of vigs) {
      vignettes.push({
        package: pkg.Package,
        title: vig.title,
        source: vig.source,
        url: `https://ggsegverse.github.io/${pkg.Package}/articles/${vig.source.replace(/\.Rmd$/, '.html')}`
      });
    }
  }

  return vignettes.sort((a, b) =>
    a.package.localeCompare(b.package) || a.title.localeCompare(b.title)
  );
}

export async function getContributors() {
  const packages = await fetchPackages();
  const contributorMap = new Map();

  for (const pkg of packages) {
    const contributors = pkg._contributors || [];
    for (const c of contributors) {
      const existing = contributorMap.get(c.user) || { user: c.user, contributions: 0 };
      existing.contributions += c.count || 0;
      contributorMap.set(c.user, existing);
    }
  }

  return Array.from(contributorMap.values())
    .sort((a, b) => b.contributions - a.contributions)
    .map(c => ({
      ...c,
      avatar_url: `https://github.com/${c.user}.png?size=160`
    }));
}

export async function getAtlases() {
  const packages = await fetchPackages();
  const atlases = [];

  for (const pkg of packages) {
    if (!pkg.Package.startsWith('ggseg')) continue;
    const helpPages = pkg._help || [];

    for (const h of helpPages) {
      if (!h.concept?.includes('ggseg_atlases')) continue;

      atlases.push({
        name: h.page,
        title: h.title,
        package: pkg.Package,
        docsUrl: `https://ggsegverse.github.io/${pkg.Package}/reference/${h.page}.html`
      });
    }
  }

  return atlases.sort((a, b) => a.name.localeCompare(b.name));
}

function transformPackage(pkg) {
  const url = pkg.URL || '';
  const githubUrl = url.includes('github.com')
    ? url.split(',')[0]
    : `https://github.com/ggsegverse/${pkg.Package}`;

  return {
    package: pkg.Package,
    title: pkg.Title,
    version: pkg.Version,
    description: pkg.Description,
    maintainer: pkg._maintainer?.name,
    maintainer_login: pkg._maintainer?.login,
    status: pkg._status,
    stars: pkg._stars,
    logo: pkg._pkglogo,
    github_url: githubUrl,
    pkgdown_url: `https://ggsegverse.github.io/${pkg.Package}/`,
    on_cran: pkg._cranurl === true
  };
}
