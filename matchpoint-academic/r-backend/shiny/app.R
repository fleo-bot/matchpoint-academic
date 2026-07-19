# ============================================================
# MatchPoint Academic — Shiny Dashboard
# Run with: shiny::runApp("r-backend/shiny/")
# ============================================================

library(shiny)
library(shinydashboard)
library(plotly)
library(ggplot2)
library(dplyr)
library(tidyr)

# Load data and modules
source("../api/data.R")
source("../api/workload.R")
source("../api/specialization.R")
source("../api/recommendation.R")

# ── UI ────────────────────────────────────────────────────────
ui <- dashboardPage(
  skin = "black",

  dashboardHeader(title = "MatchPoint Academic"),

  dashboardSidebar(
    sidebarMenu(
      menuItem("Workload Dashboard",      tabName = "workload",        icon = icon("chart-bar")),
      menuItem("Specialization Predictor",tabName = "specialization",  icon = icon("chart-line")),
      menuItem("Recommendation Engine",   tabName = "recommendation",  icon = icon("bullseye")),
      menuItem("Subject Coverage",        tabName = "coverage",        icon = icon("table"))
    )
  ),

  dashboardBody(
    tags$head(tags$style(HTML("
      .content-wrapper, .right-side, .main-sidebar { background-color: #0d1418; }
      .box { background-color: #131c21; border-top-color: #96ACB7; }
      .box-header { color: #FFFFFF; }
      body { font-family: 'Raleway', sans-serif; }
    "))),

    tabItems(

      # ── Workload tab ──────────────────────────────────────────
      tabItem(tabName = "workload",
        fluidRow(
          valueBoxOutput("box_avg_load"),
          valueBoxOutput("box_overloaded"),
          valueBoxOutput("box_underutilized")
        ),
        fluidRow(
          box(title = "Faculty Workload (Units Assigned)", width = 8,
              plotlyOutput("workload_chart", height = "320px")),
          box(title = "Load Status", width = 4,
              tableOutput("workload_table"))
        )
      ),

      # ── Specialization tab ───────────────────────────────────
      tabItem(tabName = "specialization",
        fluidRow(
          box(title = "Select Faculty Member", width = 3,
              selectInput("spec_faculty", "Faculty:",
                          choices = setNames(faculty_data$faculty_id, faculty_data$name),
                          selected = "f001")),
          box(title = "Prediction Summary", width = 4,
              verbatimTextOutput("spec_prediction")),
          box(title = "Specialist Status", width = 5,
              tableOutput("spec_status_table"))
        ),
        fluidRow(
          box(title = "Specialization Trajectory (ggplot2)", width = 12,
              plotOutput("spec_chart", height = "400px"))
        )
      ),

      # ── Recommendation tab ───────────────────────────────────
      tabItem(tabName = "recommendation",
        fluidRow(
          box(title = "Select Course", width = 3,
              selectInput("rec_course", "Course:",
                          choices = setNames(course_data$course_id, course_data$name))),
          box(title = "Scoring Weights", width = 4,
              sliderInput("w_hist",     "Historical Fit:",    0, 1, 0.40, 0.05),
              sliderInput("w_profile",  "Academic Profile:",  0, 1, 0.35, 0.05),
              sliderInput("w_workload", "Workload Score:",    0, 1, 0.25, 0.05))
        ),
        fluidRow(
          box(title = "Ranked Faculty Recommendations (DT Package)", width = 12,
              DT::dataTableOutput("rec_table"))
        )
      ),

      # ── Coverage tab ─────────────────────────────────────────
      tabItem(tabName = "coverage",
        fluidRow(
          box(title = "Subject Coverage by Category", width = 12,
              plotlyOutput("coverage_chart", height = "360px"))
        ),
        fluidRow(
          box(title = "Shortage Alert", width = 12,
              DT::dataTableOutput("shortage_table"))
        )
      )
    )
  )
)

# ── SERVER ────────────────────────────────────────────────────
server <- function(input, output, session) {

  # Workload value boxes
  output$box_avg_load <- renderValueBox({
    wl <- get_workload_summary()
    valueBox(paste0(round(mean(wl$percentage)), "%"), "Avg. Workload",
             icon = icon("bolt"), color = "blue")
  })

  output$box_overloaded <- renderValueBox({
    wl <- get_workload_summary()
    valueBox(sum(wl$status == "overloaded"), "Overloaded Faculty",
             icon = icon("exclamation-triangle"), color = "red")
  })

  output$box_underutilized <- renderValueBox({
    wl <- get_workload_summary()
    valueBox(sum(wl$status == "underutilized"), "Under-utilized",
             icon = icon("arrow-down"), color = "yellow")
  })

  # Workload chart
  output$workload_chart <- renderPlotly({
    wl         <- get_workload_summary()
    short_names <- sapply(strsplit(wl$name, " "), function(x) tail(x, 1))
    bar_colors  <- ifelse(wl$status == "overloaded", "#f87171",
                   ifelse(wl$status == "underutilized", "#facc15", "#96ACB7"))
    plot_ly(x = short_names, y = wl$units, type = "bar",
            marker = list(color = bar_colors)) %>%
      layout(plot_bgcolor = "#0d1418", paper_bgcolor = "#131c21",
             xaxis = list(color = "#96ACB7"),
             yaxis = list(color = "#96ACB7", title = "Units", range = c(0, 15)))
  })

  output$workload_table <- renderTable({
    get_workload_summary() %>%
      select(name, units, max_units, status) %>%
      rename(Faculty = name, Units = units, Max = max_units, Status = status)
  })

  # Specialization chart
  output$spec_chart <- renderPlot({
    req(input$spec_faculty)
    plot_specialization(input$spec_faculty)
  })

  output$spec_prediction <- renderPrint({
    req(input$spec_faculty)
    pred <- predict_specialization(input$spec_faculty)
    cat("Specialization:  ", pred$specialization,  "\n")
    cat("Probability:     ", round(pred$probability * 100), "%\n")
    cat("Status:          ", pred$status,           "\n")
    cat("Trend:           ", pred$trend,             "\n")
  })

  output$spec_status_table <- renderTable({
    all_fac <- unique(specialization_history$faculty_id)
    do.call(rbind, lapply(all_fac, function(fid) {
      dev <- tryCatch(check_developing_specialist(fid), error = function(e) FALSE)
      traj <- get_specialization_trajectory(fid)
      data.frame(
        Faculty = faculty_data$name[faculty_data$faculty_id == fid],
        Specialization = traj$specialization,
        DevelopingSpecialist = if (dev) "🌱 Yes" else "No",
        stringsAsFactors = FALSE
      )
    }))
  })

  # Recommendation table
  output$rec_table <- DT::renderDataTable({
    req(input$rec_course)
    recs <- calculate_compatibility(
      course_id  = input$rec_course,
      w_hist     = input$w_hist,
      w_profile  = input$w_profile,
      w_workload = input$w_workload
    )
    DT::datatable(recs,
      options = list(pageLength = 10, order = list(list(2, "desc"))),
      rownames = FALSE
    ) %>%
      DT::formatStyle("compatibility_score",
        background = DT::styleColorBar(c(0, 100), "#96ACB7"),
        backgroundSize   = "100% 80%",
        backgroundRepeat = "no-repeat",
        backgroundPosition = "center"
      ) %>%
      DT::formatStyle("status",
        color = DT::styleEqual(
          c("Highly Recommended","Recommended","Possible","Not Recommended"),
          c("#4ade80","#96ACB7","#facc15","#f87171")
        )
      )
  })

  # Coverage chart
  output$coverage_chart <- renderPlotly({
    cov <- get_subject_coverage()
    plot_ly(cov,
      labels = ~category,
      values = ~total_courses,
      type   = "pie",
      hole   = 0.45,
      marker = list(colors = c("#96ACB7","#7a9aaa","#5e8899","#4a7080","#c8d8e0","#3a5f6e"))
    ) %>%
      layout(
        plot_bgcolor  = "#0d1418",
        paper_bgcolor = "#131c21",
        legend = list(font = list(color = "#96ACB7"))
      )
  })

  output$shortage_table <- DT::renderDataTable({
    cov <- get_subject_coverage() %>%
      filter(shortage == TRUE) %>%
      select(category, total_courses, qualified_faculty, coverage_pct) %>%
      rename(Category = category,
             `Total Courses` = total_courses,
             `Qualified Faculty` = qualified_faculty,
             `Coverage %` = coverage_pct)
    DT::datatable(cov, options = list(pageLength = 10), rownames = FALSE) %>%
      DT::formatStyle("Coverage %",
        color = "#f87171", fontWeight = "bold"
      )
  })
}

shinyApp(ui = ui, server = server)
