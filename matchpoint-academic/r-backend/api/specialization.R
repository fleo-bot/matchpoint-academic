# ============================================================
# MatchPoint Academic — Specialization Predictor (R)
# Uses ggplot2 for visualization, glm() for logistic regression
# ============================================================

library(dplyr)
library(tidyr)
library(ggplot2)

SPECIALIZATION_THRESHOLD <- 0.60  # 60% rule
CONSECUTIVE_SEMESTERS    <- 3     # 3 consecutive semesters

# ── Get specialization trajectory for a faculty member ────────
get_specialization_trajectory <- function(faculty_id) {
  history <- specialization_history %>%
    filter(faculty_id == !!faculty_id) %>%
    arrange(semester)

  if (nrow(history) == 0) stop("No history found for faculty_id: ", faculty_id)

  # Find primary specialization (highest average %)
  subject_means <- history %>%
    summarise(
      AI      = mean(AI),
      DataSci = mean(DataSci),
      WebDev  = mean(WebDev),
      CoreCS  = mean(CoreCS)
    )

  primary_subject <- names(which.max(as.numeric(subject_means[1,])))
  primary_mean    <- max(as.numeric(subject_means[1,]))

  # Specialization label
  subject_labels <- c(
    AI      = "AI & Machine Learning",
    DataSci = "Data Science",
    WebDev  = "Web Development",
    CoreCS  = "Core CS / Systems"
  )

  return(list(
    faculty_id        = faculty_id,
    primary_subject   = primary_subject,
    specialization    = subject_labels[[primary_subject]],
    average_pct       = round(primary_mean, 1),
    semesters         = history,
    is_specialist     = primary_mean > SPECIALIZATION_THRESHOLD * 100
  ))
}

# ── Check 3-consecutive-semester threshold ────────────────────
check_developing_specialist <- function(faculty_id) {
  history <- specialization_history %>%
    filter(faculty_id == !!faculty_id) %>%
    arrange(semester)

  if (nrow(history) < CONSECUTIVE_SEMESTERS) return(FALSE)

  traj <- get_specialization_trajectory(faculty_id)
  primary_col <- traj$primary_subject

  last_n <- tail(history[[primary_col]], CONSECUTIVE_SEMESTERS)
  return(all(last_n > SPECIALIZATION_THRESHOLD * 100))
}

# ── Logistic regression: predict specialization probability ───
predict_specialization <- function(faculty_id) {
  history <- specialization_history %>%
    filter(faculty_id == !!faculty_id) %>%
    arrange(semester) %>%
    mutate(semester_num = row_number())

  traj        <- get_specialization_trajectory(faculty_id)
  primary_col <- traj$primary_subject

  # Prepare training data
  model_data <- history %>%
    mutate(
      is_specialist      = (!!sym(primary_col)) > (SPECIALIZATION_THRESHOLD * 100),
      dept_growth_proxy  = semester_num * 1.02,  # simulated growth index
      course_demand      = semester_num * 1.5    # simulated demand index
    )

  # Logistic regression: P(specialist) ~ semester + growth + demand
  # Suppress warnings for near-perfect separation in small datasets
  suppressWarnings({
    model <- glm(
      is_specialist ~ semester_num + dept_growth_proxy + course_demand,
      data   = model_data,
      family = binomial(link = "logit")
    )
  })

  # Predict for next 2 semesters
  future_data <- data.frame(
    semester_num      = c(nrow(history) + 1, nrow(history) + 2),
    dept_growth_proxy = c((nrow(history) + 1) * 1.02, (nrow(history) + 2) * 1.02),
    course_demand     = c((nrow(history) + 1) * 1.5,  (nrow(history) + 2) * 1.5)
  )

  suppressWarnings({
    predictions <- predict(model, newdata = future_data, type = "response")
  })

  # Trend detection (linear slope over last 3 semesters)
  recent_vals <- tail(history[[primary_col]], 3)
  slope <- if (length(recent_vals) >= 2) {
    lm_fit <- lm(recent_vals ~ seq_along(recent_vals))
    coef(lm_fit)[2]
  } else 0

  trend <- if (slope > 1) "up" else if (slope < -1) "down" else "stable"

  is_developing <- check_developing_specialist(faculty_id)

  return(list(
    faculty_id       = faculty_id,
    specialization   = traj$specialization,
    probability      = round(mean(predictions, na.rm = TRUE), 3),
    status           = if (is_developing) "Developing Specialist" else "Generalist",
    trend            = trend,
    slope            = round(slope, 3),
    model_summary    = summary(model)$coefficients
  ))
}

# ── Get all developing specialists ────────────────────────────
get_developing_specialists <- function() {
  all_faculty <- unique(specialization_history$faculty_id)

  specialists <- lapply(all_faculty, function(fid) {
    is_dev <- tryCatch(check_developing_specialist(fid), error = function(e) FALSE)
    if (is_dev) {
      traj <- get_specialization_trajectory(fid)
      pred <- tryCatch(predict_specialization(fid), error = function(e) list(probability = NA))
      list(
        faculty_id     = fid,
        specialization = traj$specialization,
        probability    = pred$probability,
        trend          = pred$trend
      )
    }
  })

  Filter(Negate(is.null), specialists)
}

# ── ggplot2: Generate specialization chart (server-side) ───────
plot_specialization <- function(faculty_id, output_file = NULL) {
  history <- specialization_history %>%
    filter(faculty_id == !!faculty_id) %>%
    pivot_longer(cols = c(AI, DataSci, WebDev, CoreCS),
                 names_to  = "subject",
                 values_to = "percentage")

  p <- ggplot(history, aes(x = semester, y = percentage, fill = subject, group = subject)) +
    geom_area(alpha = 0.75, position = "stack") +
    scale_fill_manual(
      values = c(AI      = "#96ACB7",
                 DataSci = "#7a9aaa",
                 WebDev  = "#5e8899",
                 CoreCS  = "#3a5f6e"),
      labels = c(AI      = "AI / ML",
                 DataSci = "Data Science",
                 WebDev  = "Web Development",
                 CoreCS  = "Core CS")
    ) +
    geom_hline(yintercept = 60, linetype = "dashed",
               color = "#facc15", alpha = 0.7, linewidth = 0.8) +
    annotate("text", x = 1, y = 63, label = "60% Threshold",
             color = "#facc15", size = 3.5, fontface = "bold") +
    labs(
      title    = paste("Specialization Trajectory —", faculty_id),
      subtitle = "Stacked area chart | MatchPoint Academic",
      x        = "Semester",
      y        = "Subject Distribution (%)",
      fill     = "Subject Area"
    ) +
    theme_minimal() +
    theme(
      plot.background  = element_rect(fill = "#000000", color = NA),
      panel.background = element_rect(fill = "#0d1418", color = NA),
      panel.grid.major = element_line(color = "rgba(150,172,183,0.1)"),
      text             = element_text(color = "#FFFFFF", family = "sans"),
      axis.text        = element_text(color = "#96ACB7"),
      legend.background= element_rect(fill = "#0d1418"),
      legend.text      = element_text(color = "#96ACB7")
    )

  if (!is.null(output_file)) {
    ggsave(output_file, plot = p, width = 10, height = 6, dpi = 150)
    return(output_file)
  }
  return(p)
}
