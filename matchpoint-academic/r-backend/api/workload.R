# ============================================================
# MatchPoint Academic — Workload & Coverage Analysis (R)
# shinydashboard + plotly + highcharter integration
# ============================================================

library(dplyr)
library(ggplot2)

# ── Workload summary ─────────────────────────────────────────
get_workload_summary <- function() {
  faculty_data %>%
    mutate(
      units       = current_load * 3,     # 3 units per course
      max_units   = max_load * 3,
      percentage  = round((current_load / max_load) * 100),
      status      = case_when(
        current_load >= max_load     ~ "overloaded",
        current_load <= max_load / 4 ~ "underutilized",
        TRUE                         ~ "active"
      )
    ) %>%
    select(faculty_id, name, units, max_units, percentage, status)
}

# ── Subject coverage ─────────────────────────────────────────
get_subject_coverage <- function() {
  # Courses per category
  by_category <- course_data %>%
    group_by(category) %>%
    summarise(total_courses = n(), .groups = "drop")

  # Qualified faculty per category (based on specialization keywords)
  category_quals <- list(
    "Specialized Elective" = c("f001","f002","f003","f006"),
    "Core IT"              = c("f001","f002","f003","f004","f005","f006"),
    "General Education"    = c("f002"),
    "Mathematics"          = c("f003")
  )

  by_category %>%
    mutate(
      qualified_faculty = sapply(category, function(cat) {
        length(category_quals[[cat]] %||% character(0))
      }),
      shortage = qualified_faculty < total_courses * 0.5,
      coverage_pct = round(qualified_faculty / total_courses * 100)
    )
}

# ── plotly: Workload bar chart (server-rendered JSON) ─────────
generate_workload_plotly_spec <- function() {
  wl <- get_workload_summary()
  short_names <- sapply(strsplit(wl$name, " "), function(x) tail(x, 1))

  list(
    data = list(list(
      x    = as.list(short_names),
      y    = as.list(wl$units),
      type = "bar",
      marker = list(
        color = sapply(wl$status, function(s) {
          switch(s,
            overloaded    = "#f87171",
            underutilized = "#facc15",
            "#96ACB7"
          )
        })
      ),
      hovertemplate = "<b>%{x}</b><br>Units: %{y}/15<extra></extra>"
    )),
    layout = list(
      title       = list(text = "Faculty Workload Distribution", font = list(color = "#FFFFFF")),
      plot_bgcolor  = "#000000",
      paper_bgcolor = "#000000",
      xaxis = list(color = "#96ACB7"),
      yaxis = list(color = "#96ACB7", title = "Units Assigned", range = list(0, 15))
    )
  )
}

# ── shinydashboard: Full UI spec for Shiny integration ────────
# This is the Shiny server logic; run separately via shiny::runApp()
workload_shiny_server <- function(input, output, session) {
  # Workload bar chart (plotly)
  output$workload_chart <- plotly::renderPlotly({
    wl <- get_workload_summary()
    plotly::plot_ly(
      data = wl,
      x    = ~name,
      y    = ~units,
      type = "bar",
      color = ~status,
      colors = c(active = "#96ACB7", overloaded = "#f87171", underutilized = "#facc15"),
      hovertemplate = paste(
        "<b>%{x}</b><br>",
        "Units: %{y}/15<br>",
        "<extra></extra>"
      )
    ) %>%
      plotly::layout(
        title       = "Faculty Workload (Units Assigned)",
        plot_bgcolor  = "#000000",
        paper_bgcolor = "#000000",
        xaxis = list(color = "#96ACB7", title = ""),
        yaxis = list(color = "#96ACB7", title = "Units", range = c(0, 15)),
        legend = list(font = list(color = "#96ACB7"))
      )
  })

  # Coverage pie (highcharter)
  output$coverage_chart <- highcharter::renderHighchart({
    cov <- get_subject_coverage()
    highcharter::highchart() %>%
      highcharter::hc_chart(type = "pie", backgroundColor = "#000000") %>%
      highcharter::hc_title(text = "Subject Coverage", style = list(color = "#FFFFFF")) %>%
      highcharter::hc_add_series_labels_values(
        labels = cov$category,
        values = cov$total_courses,
        colors = c("#96ACB7","#7a9aaa","#5e8899","#4a7080","#c8d8e0","#3a5f6e")
      ) %>%
      highcharter::hc_plotOptions(
        pie = list(
          dataLabels = list(color = "#96ACB7", enabled = TRUE),
          innerSize   = "50%"
        )
      )
  })
}

# Null coalesce operator (if not already defined)
if (!exists("%||%")) {
  `%||%` <- function(a, b) if (!is.null(a)) a else b
}
