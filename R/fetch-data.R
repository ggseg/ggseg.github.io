get_packages <- function(use_cache = TRUE) {
  cache_file <- here::here("_data", "packages.rds")

  if (use_cache && file.exists(cache_file)) {
    cache_time <- file.info(cache_file)$mtime
    if (difftime(Sys.time(), cache_time, units = "hours") < 24) {
      return(readRDS(cache_file))
    }
  }

  url <- "https://ggseg.r-universe.dev/api/packages"
  response <- jsonlite::fromJSON(url, flatten = TRUE)

  packages <- response |>
    dplyr::filter(!is.na(Title)) |>
    dplyr::select(
      package = Package,
      title = Title,
      version = Version,
      description = Description,
      maintainer = `_maintainer.name`,
      maintainer_login = `_maintainer.login`,
      url = URL,
      status = `_status`,
      stars = `_stars`,
      dplyr::any_of(c("_contributors", "_readme", "_pkglogo"))
    ) |>
    dplyr::rename_with(~ "logo", dplyr::any_of("_pkglogo")) |>
    dplyr::mutate(
      github_url = dplyr::case_when(
        grepl("github.com", url) ~ sub(",.*", "", url),
        TRUE ~ paste0("https://github.com/ggseg/", package)
      ),
      pkgdown_url = paste0("https://ggseg.github.io/", package, "/")
    )

  dir.create(dirname(cache_file), showWarnings = FALSE, recursive = TRUE)
  saveRDS(packages, cache_file)

  packages
}

get_core_packages <- function() {
  packages <- get_packages()
  core_names <- c("ggseg", "ggseg3d", "ggsegExtra")
  packages |>
    dplyr::filter(package %in% core_names) |>
    dplyr::arrange(match(package, core_names))
}

get_atlas_packages <- function() {
  packages <- get_packages()
  packages |>
    dplyr::filter(
      grepl("^ggseg", package),
      !package %in% c("ggseg", "ggseg3d", "ggsegExtra")
    ) |>
    dplyr::arrange(package)
}

get_contributors <- function() {
  url <- "https://ggseg.r-universe.dev/api/packages"
  response <- jsonlite::fromJSON(url, flatten = TRUE)

  contributors_list <- response$`_contributors`
  contributors_list <- contributors_list[!sapply(contributors_list, is.null)]

  all_contributors <- dplyr::bind_rows(contributors_list)

  if (nrow(all_contributors) == 0) {
    return(data.frame(
      user = character(),
      contributions = integer(),
      avatar_url = character()
    ))
  }

  all_contributors |>
    dplyr::group_by(user) |>
    dplyr::summarise(
      contributions = sum(count, na.rm = TRUE),
      .groups = "drop"
    ) |>
    dplyr::arrange(dplyr::desc(contributions)) |>
    dplyr::mutate(
      avatar_url = paste0("https://github.com/", user, ".png?size=160")
    )
}
