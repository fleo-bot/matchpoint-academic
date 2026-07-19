# ============================================================
# MatchPoint Academic — R Plumber API
# Faculty & Course Monitoring System
# Run with: plumber::plumb("plumber.R")$run(port=8000)
# ============================================================

library(plumber)
library(dplyr)
library(jsonlite)

# Load data modules
source("data.R")
source("recommendation.R")
source("specialization.R")
source("workload.R")

#* @apiTitle MatchPoint Academic API
#* @apiDescription Faculty & Course Monitoring — R Plumber Backend
#* @apiVersion 1.0.0

# ── CORS middleware ──────────────────────────────────────────
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin",  "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  plumber::forward()
}

# ── HEALTH CHECK ─────────────────────────────────────────────

#* Health check
#* @get /health
function() {
  list(
    status  = "ok",
    message = "MatchPoint Academic API is running",
    version = "1.0.0",
    time    = format(Sys.time(), "%Y-%m-%d %H:%M:%S")
  )
}

# ── FACULTY ENDPOINTS ─────────────────────────────────────────

#* Get all faculty
#* @get /faculty
function() {
  faculty_data %>%
    select(id, name, degree, specialization, years_experience,
           current_load, max_load, status, department, rank) %>%
    toJSON(auto_unbox = TRUE)
}

#* Get faculty by ID
#* @param id Faculty ID
#* @get /faculty/<id>
function(id) {
  result <- faculty_data %>% filter(faculty_id == id)
  if (nrow(result) == 0) {
    stop("Faculty not found")
  }
  toJSON(result, auto_unbox = TRUE)
}

# ── COURSE ENDPOINTS ─────────────────────────────────────────

#* Get all courses
#* @get /courses
function() {
  toJSON(course_data, auto_unbox = TRUE)
}

# ── RECOMMENDATION ENGINE ─────────────────────────────────────

#* Get faculty recommendations for a course
#* @param course_id The course ID to get recommendations for
#* @param w_hist Weight for historical fit (default 0.40)
#* @param w_profile Weight for academic profile (default 0.35)
#* @param w_workload Weight for workload score (default 0.25)
#* @get /recommendations/<course_id>
function(course_id, w_hist = 0.40, w_profile = 0.35, w_workload = 0.25) {
  w_hist     <- as.numeric(w_hist)
  w_profile  <- as.numeric(w_profile)
  w_workload <- as.numeric(w_workload)

  recommendations <- calculate_compatibility(
    course_id  = course_id,
    w_hist     = w_hist,
    w_profile  = w_profile,
    w_workload = w_workload
  )

  toJSON(recommendations, auto_unbox = TRUE)
}

# ── SPECIALIZATION PREDICTOR ──────────────────────────────────

#* Get specialization trajectory for a faculty member
#* @param faculty_id The faculty member ID
#* @get /specialization/<faculty_id>
function(faculty_id) {
  trajectory <- get_specialization_trajectory(faculty_id)
  toJSON(trajectory, auto_unbox = TRUE)
}

#* Get specialization prediction (logistic regression)
#* @param faculty_id The faculty member ID
#* @get /specialization/<faculty_id>/predict
function(faculty_id) {
  prediction <- predict_specialization(faculty_id)
  toJSON(prediction, auto_unbox = TRUE)
}

#* Get all developing specialists
#* @get /specialization/specialists
function() {
  specialists <- get_developing_specialists()
  toJSON(specialists, auto_unbox = TRUE)
}

# ── WORKLOAD ENDPOINTS ────────────────────────────────────────

#* Get workload summary for all faculty
#* @get /workload
function() {
  summary <- get_workload_summary()
  toJSON(summary, auto_unbox = TRUE)
}

#* Get subject coverage analysis
#* @get /workload/coverage
function() {
  coverage <- get_subject_coverage()
  toJSON(coverage, auto_unbox = TRUE)
}

# ── SUBJECT REQUESTS ──────────────────────────────────────────

#* Get all subject requests
#* @get /requests
function() {
  toJSON(subject_requests, auto_unbox = TRUE)
}

#* Submit a new subject request
#* @param faculty_id Faculty ID
#* @param course_id Course ID
#* @param reason Justification text
#* @post /requests
function(faculty_id, course_id, reason) {
  new_req <- data.frame(
    id         = paste0("req", as.integer(Sys.time())),
    faculty_id = faculty_id,
    course_id  = course_id,
    reason     = reason,
    status     = "pending",
    date       = as.character(Sys.Date()),
    stringsAsFactors = FALSE
  )
  subject_requests <<- rbind(subject_requests, new_req)
  list(success = TRUE, request_id = new_req$id, message = "Request submitted successfully")
}
