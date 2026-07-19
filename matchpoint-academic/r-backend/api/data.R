# ============================================================
# MatchPoint Academic — Mock Data
# R data frames mirroring the frontend mockData.js
# ============================================================

library(dplyr)

# ── FACULTY DATA ─────────────────────────────────────────────
faculty_data <- data.frame(
  faculty_id       = c("f001","f002","f003","f004","f005","f006"),
  name             = c("Dr. Maria Santos","Prof. James Reyes","Dr. Angela Cruz",
                       "Engr. Ramon Dela Cruz","Dr. Liza Fernandez","Prof. Kevin Tan"),
  degree           = c("Ph.D. Computer Science","M.S. Information Technology",
                       "Ph.D. Mathematics","M.Eng. Software Engineering",
                       "Ph.D. Information Systems","M.S. Computer Engineering"),
  specialization   = c("Machine Learning & AI","Web Development & UX",
                       "Data Science & Statistics","Systems Architecture",
                       "Database Management","Networking & Cybersecurity"),
  years_experience = c(12, 8, 15, 6, 10, 9),
  current_load     = c(3, 4, 2, 5, 1, 3),
  max_load         = rep(5, 6),
  status           = c("active","active","active","overloaded","underutilized","active"),
  department       = c("Computer Science","Information Technology","Mathematics",
                       "Computer Science","Information Systems","Computer Engineering"),
  rank             = c("Associate Professor","Assistant Professor","Full Professor",
                       "Instructor","Associate Professor","Assistant Professor"),
  stringsAsFactors = FALSE
)

# ── COURSE DATA ───────────────────────────────────────────────
course_data <- data.frame(
  course_id   = c("CS401","CS301","IT401","DS401","NET301","SEC401","IS301","GE101","MATH301","SE401"),
  name        = c("Machine Learning","Algorithms & Data Structures","Advanced Web Development",
                  "Data Science Fundamentals","Computer Networks","Cybersecurity",
                  "Database Management Systems","Technical Communication",
                  "Probability & Statistics","Software Engineering"),
  category    = c("Specialized Elective","Core IT","Specialized Elective","Specialized Elective",
                  "Core IT","Specialized Elective","Core IT","General Education","Core IT","Core IT"),
  units       = rep(3, 10),
  level       = c(4, 3, 4, 4, 3, 4, 3, 1, 3, 4),
  stringsAsFactors = FALSE
)

# ── HISTORICAL TEACHING RECORDS ───────────────────────────────
teaching_history <- data.frame(
  faculty_id  = c("f001","f001","f001","f002","f002","f003","f003","f006","f006","f004"),
  course_id   = c("CS401","CS401","CS401","IT401","IT401","DS401","DS401","NET301","NET301","CS401"),
  semester    = c("2022-S1","2022-S2","2023-S1","2022-S1","2022-S2","2022-S1","2022-S2","2022-S1","2022-S2","2022-S1"),
  grade_avg   = c(1.5, 1.4, 1.6, 1.7, 1.8, 1.6, 1.5, 1.8, 1.7, 2.1),
  stringsAsFactors = FALSE
)

# ── SPECIALIZATION HISTORY ─────────────────────────────────────
specialization_history <- data.frame(
  faculty_id = rep(c("f001","f002","f003","f004"), each = 6),
  semester   = rep(c("2022-S1","2022-S2","2023-S1","2023-S2","2024-S1","2024-S2"), 4),
  AI         = c(60,65,70,72,75,78, 10,10, 5, 5, 5, 5, 15,15,20,18,20,20, 10,10,15,10,15,10),
  DataSci    = c(20,20,15,18,15,12, 10,10,15,10,10, 5, 55,60,62,65,66,68, 10,10,10,15,10,10),
  WebDev     = c(10, 5, 5, 5, 5, 5, 50,55,60,65,68,72,  5, 5, 3, 3, 2, 2, 30,25,30,25,30,25),
  CoreCS     = c(10,10,10, 5, 5, 5, 30,25,20,20,17,18, 25,20,15,14,12,10, 50,55,45,50,45,55),
  stringsAsFactors = FALSE
)

# ── SUBJECT REQUESTS ──────────────────────────────────────────
subject_requests <- data.frame(
  id          = c("req001","req002","req003"),
  faculty_id  = c("f005","f003","f006"),
  course_id   = c("DS401","CS401","SEC401"),
  reason      = c("Completed advanced statistics certification.",
                  "Research background in ML models relevant to course.",
                  "Industry certification (CISSP). Taught related topics."),
  status      = c("pending","approved","approved"),
  date        = c("2024-11-10","2024-10-22","2024-09-15"),
  stringsAsFactors = FALSE
)
