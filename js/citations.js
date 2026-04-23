const OPENALEX_WORK_ID = 'W3108978982';
const PER_PAGE = 50;

export async function getCitingWorks() {
  const works = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.openalex.org/works?filter=cites:${OPENALEX_WORK_ID}&per_page=${PER_PAGE}&page=${page}&select=id,title,doi,publication_date,authorships,primary_location,cited_by_count&sort=publication_date:desc&mailto=a.m.mowinckel@psykologi.uio.no`;
    const res = await fetch(url);
    const data = await res.json();

    works.push(...data.results);
    hasMore = data.results.length === PER_PAGE;
    page++;
  }

  return works;
}

export function renderCitations(works, container, countEl) {
  if (countEl) countEl.textContent = works.length;

  container.innerHTML = works.map((w, i) => {
    const authors = w.authorships || [];
    const first = authors[0]?.author?.display_name || 'Unknown';
    const authorStr = authors.length > 2
      ? `${first} et al.`
      : authors.map(a => a.author?.display_name).join(', ');
    const year = w.publication_date?.substring(0, 4) || '';
    const journal = w.primary_location?.source?.display_name || '';
    const doi = w.doi || '';

    return `
      <div class="citation-card fade-in-up" style="animation-delay: ${Math.min(i * 0.02, 0.6)}s">
        <div class="citation-title">
          ${doi ? `<a href="${doi}" target="_blank">${w.title}</a>` : w.title}
        </div>
        <div class="citation-meta">
          <span class="citation-authors">${authorStr}</span>
          ${year ? `<span class="citation-year">${year}</span>` : ''}
          ${journal ? `<span class="citation-journal">${journal}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
