# MatchPoint Academic

Faculty & Course Monitoring Web Application System

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, React Router 6, Recharts, CSS Modules |
| Fonts | Raleway (Google Fonts) |
| R Backend | Plumber API, dplyr, ggplot2, glm(), DT package |
| R Dashboard | Shiny, shinydashboard, plotly, highcharter |

## Colors
- Background: `#000000`
- Light: `#FFFFFF`
- Dark/Accent: `#96ACB7`

---

## Getting Started

### React Frontend

```bash
cd matchpoint-academic
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@matchpoint.edu | admin123 |
| Faculty (any) | m.santos@matchpoint.edu | faculty123 |

---

### R Plumber API

```r
install.packages(c("plumber","dplyr","jsonlite","ggplot2","tidyr"))
plumber::plumb("r-backend/api/plumber.R")$run(port = 8000)
```

API runs at `http://localhost:8000`

### R Shiny Dashboard

```r
install.packages(c("shiny","shinydashboard","plotly","highcharter","DT","dplyr","ggplot2","tidyr"))
shiny::runApp("r-backend/shiny/")
```

---

## Features

### 1. Smart Faculty-to-Course Recommendation Engine
- Weighted compatibility scoring (dplyr)
- Dimensions: Historical Fit (40%), Academic Profile (35%), Workload (25%)
- Top 3 highlighted with ring charts and visual progress bars
- Faculty request bonus (+5%) factored into scoring
- Adjustable scoring weights via admin UI
- R code preview (DT package output)

### 2. Dynamic Specialization Predictor
- Time-series stacked area chart (ggplot2 style via Recharts)
- 60% threshold rule over 3 consecutive semesters
- Logistic regression `glm()` for specialization probability
- Developing Specialist flag
- Future semester projections (2 predicted semesters)

### 3. Workload & Course Distribution Dashboard
- Bar chart: Faculty vs Units (plotly interactive)
- Pie/Donut: Subject category distribution (highcharter style)
- Profile insights: Degree × course level matching
- Shortage alerts for under-staffed subject areas
- shinydashboard layout with 3 tabs

### 4. Faculty Request Subject System
- Faculty submit formal course requests with justification
- +5% compatibility bonus applied in recommendation engine
- Admin sees 📬 icon next to requesting faculty in ranked table
- Request history tracking with status (pending/approved/rejected)

---

## Project Structure

```
matchpoint-academic/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── Navbar.js / .css
│   │   ├── StatCard.js / .css
│   │   └── PageHeader.js / .css
│   ├── context/
│   │   └── AuthContext.js
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── HomePage.js / .css
│   │   ├── LoginPage.js / .css
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js / .css
│   │   │   ├── RecommendationEngine.js / .css
│   │   │   ├── SpecializationPredictor.js / .css
│   │   │   └── WorkloadDashboard.js / .css
│   │   └── faculty/
│   │       ├── FacultyDashboard.js / .css
│   │       ├── FacultyProfile.js / .css
│   │       └── RequestSubject.js / .css
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── r-backend/
│   ├── api/
│   │   ├── plumber.R      — REST API (Plumber)
│   │   ├── data.R         — Mock data frames
│   │   ├── recommendation.R — dplyr scoring engine
│   │   ├── specialization.R — ggplot2 + glm() predictor
│   │   └── workload.R     — plotly/highcharter workload
│   └── shiny/
│       └── app.R          — shinydashboard full app
└── package.json
```
