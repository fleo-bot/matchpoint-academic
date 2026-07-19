# ============================================================
# MatchPoint Academic — Recommendation Engine (R / dplyr)
# Calculates weighted compatibility scores for faculty-course matching
# ============================================================

library(dplyr)

# ── Helper: Calculate historical fit score (0-100) ────────────
calculate_historical_fit <- function(faculty_id, course_id) {
  times_taught <- teaching_history %>%
    filter(faculty_id == !!faculty_id, course_id == !!course_id) %>%
    nrow()

  # Related course bonus (same category)
  target_category <- course_data %>%
    filter(course_id == !!course_id) %>%
    pull(category)

  related_courses <- course_data %>%
    filter(category == target_category, course_id != !!course_id) %>%
    pull(course_id)

  times_related <- teaching_history %>%
    filter(faculty_id == !!faculty_id, course_id %in% related_courses) %>%
    nrow()

  # Score: direct teaching weighted more heavily
  score <- min(100, (times_taught * 20) + (times_related * 8))
  return(score)
}

# ── Helper: Academic profile score (0-100) ───────────────────
calculate_academic_profile <- function(faculty_id, course_id) {
  faculty   <- faculty_data %>% filter(faculty_id == !!faculty_id)
  course    <- course_data  %>% filter(course_id  == !!course_id)

  spec_keywords <- list(
    "CS401"   = c("Machine Learning","AI","Computer Science","Statistics"),
    "IT401"   = c("Web","Information Technology","UX","Software"),
    "DS401"   = c("Data Science","Statistics","Mathematics","Machine Learning"),
    "NET301"  = c("Networking","Computer Engineering","Systems"),
    "SEC401"  = c("Cybersecurity","Networking","Computer Engineering"),
    "IS301"   = c("Database","Information Systems","Computer Science"),
    "CS301"   = c("Computer Science","Software","Mathematics"),
    "MATH301" = c("Mathematics","Statistics","Data Science"),
    "SE401"   = c("Software Engineering","Computer Science","Systems"),
    "GE101"   = c("Communication","Education")
  )

  keywords <- spec_keywords[[course_id]] %||% character(0)

  # Check degree and specialization for keyword matches
  combined <- paste(faculty$degree, faculty$specialization)
  matches  <- sum(sapply(keywords, function(kw) grepl(kw, combined, ignore.case = TRUE)))

  # Ph.D gives a bonus for level 4 courses
  degree_bonus <- 0
  if (grepl("Ph.D", faculty$degree) && course$level >= 4) degree_bonus <- 10
  if (grepl("^M\\.", faculty$degree) && course$level >= 3) degree_bonus <- 5

  score <- min(100, (matches / length(keywords)) * 80 + degree_bonus + 10)
  return(round(score))
}

# ── Helper: Workload availability score (0-100) ───────────────
calculate_workload_score <- function(faculty_id) {
  faculty <- faculty_data %>% filter(faculty_id == !!faculty_id)
  available_slots <- faculty$max_load - faculty$current_load
  score <- (available_slots / faculty$max_load) * 100
  return(round(min(100, max(0, score))))
}

# ── Helper: Request bonus (+5 if faculty requested this course) ─
calculate_request_bonus <- function(faculty_id, course_id) {
  has_request <- subject_requests %>%
    filter(faculty_id == !!faculty_id, course_id == !!course_id, status != "rejected") %>%
    nrow() > 0
  return(ifelse(has_request, 5, 0))
}

# ── Main: Calculate compatibility scores ─────────────────────
calculate_compatibility <- function(course_id, w_hist = 0.40, w_profile = 0.35, w_workload = 0.25) {
  results <- faculty_data %>%
    rowwise() %>%
    mutate(
      historical_fit   = calculate_historical_fit(faculty_id, course_id),
      academic_profile = calculate_academic_profile(faculty_id, course_id),
      workload_score   = calculate_workload_score(faculty_id),
      request_bonus    = calculate_request_bonus(faculty_id, course_id),
      compatibility_score = min(100, round(
        historical_fit   * w_hist    +
        academic_profile * w_profile +
        workload_score   * w_workload +
        request_bonus
      )),
      times_taught = {
        teaching_history %>%
          filter(faculty_id == !!faculty_id, course_id == !!course_id) %>%
          nrow()
      },
      status = case_when(
        compatibility_score >= 85 ~ "Highly Recommended",
        compatibility_score >= 70 ~ "Recommended",
        compatibility_score >= 50 ~ "Possible",
        TRUE                      ~ "Not Recommended"
      ),
      has_request = request_bonus > 0
    ) %>%
    ungroup() %>%
    arrange(desc(compatibility_score)) %>%
    select(faculty_id, name, compatibility_score, historical_fit,
           academic_profile, workload_score, times_taught, status, has_request)

  return(results)
}

# Null coalesce operator
`%||%` <- function(a, b) if (!is.null(a)) a else b
