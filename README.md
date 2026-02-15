# ggseg.github.io

Website for the ggsegverse — R packages for brain atlas visualization.

## Development

### Prerequisites

- [Quarto](https://quarto.org/docs/get-started/)
- R with packages: `jsonlite`, `dplyr`, `here`

### Local Preview

```bash
quarto preview
```

### Build

```bash
quarto render
```

## Structure

- `index.qmd` - Homepage
- `packages.qmd` - Package showcase
- `contributors.qmd` - Contributor grid
- `funding.qmd` - Funding acknowledgments
- `news/` - Blog-style news posts
- `R/fetch-data.R` - R-universe API functions

## Adding News Posts

Create a new folder in `news/posts/` with an `index.qmd` file:

```yaml
---
title: "Your Post Title"
author: "Your Name"
date: "2024-01-29"
categories: [news]
---

Your content here.
```

## Deployment

The site automatically deploys to GitHub Pages on push to `main`.
