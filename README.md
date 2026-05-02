# Trip ELD – Smart Trip Planning & HOS Compliance System

Trip ELD is a full-stack simulation platform that models real-world trucking routes and automatically generates FMCSA Hours of Service (HOS) compliant driving logs using live mapping data.

The system combines geospatial APIs with a custom-built rule engine to simulate realistic long-haul trip planning, driving schedules, and regulatory compliance checks.

---

## Live Demo

Frontend: [https://trip-planner-frontend-pied.vercel.app](https://trip-planner-frontend-pied.vercel.app)
Backend API: [https://trip-planner-two-gamma.vercel.app](https://trip-planner-two-gamma.vercel.app)

---

## Key Features

### Smart Route Planning

* Converts real-world locations into geographic coordinates using OpenStreetMap
* Calculates road-based routes using OSRM (Open Source Routing Machine)
* Supports multi-leg trips (origin → pickup → destination)
* Returns realistic distance and travel duration estimates

---

### Hours of Service (HOS) Engine

* Simulates FMCSA compliance rules including:

  * 11-hour driving limit
  * 14-hour on-duty window
  * Mandatory 30-minute break after 8 hours of driving
  * 10-hour daily rest requirement
  * 70-hour / 8-day cycle tracking
* Breaks trips into structured daily logs
* Generates realistic driving, duty, and rest schedules

---

### Compliance Validation

* Automatically detects rule violations in generated trip plans
* Provides structured compliance results for each trip
* Ensures alignment with HOS constraints at day and cycle level

---

### Interactive Trip Visualization (Frontend)

* Displays real road routes on an interactive map (Leaflet)
* Visualizes trip segments using polylines
* Shows day-wise driving logs in a structured UI
* Provides clear compliance status indicators

---

## Tech Stack

### Backend

* Django 4.x
* Django REST Framework
* Python-based HOS simulation engine
* OpenStreetMap Nominatim (geocoding)
* OSRM (routing API)

### Frontend

* React (Vite)
* Tailwind CSS
* ShadCN UI components
* Leaflet / React-Leaflet (maps)
* Lucide Icons

---

## System Architecture

The system is designed as a modular pipeline:

1. User inputs locations
2. Backend geocodes locations into coordinates
3. OSRM calculates real road routes
4. HOS engine simulates driving schedule based on total distance
5. Compliance layer validates output against FMCSA rules
6. Frontend visualizes route and logs in real time

---

## API Endpoint

### Calculate Trip Plan

POST /api/logs/calculate/

#### Request Body

```json
{
  "current_location": "Chicago, IL",
  "pickup": "Detroit, MI",
  "dropoff": "New York, NY",
  "used_hours": 15.5
}
```

#### Response

Returns:

* total route distance
* segmented route breakdown
* day-wise HOS logs
* compliance status and violations

---

## What This Project Demonstrates

* Real-world API integration (mapping + routing services)
* Simulation-based backend architecture
* Rule-based engine design (HOS compliance logic)
* Full-stack system design (frontend + backend integration)
* State handling for multi-day process simulation

---

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Notes

* Uses free public APIs (OSRM + Nominatim)
* Designed for demonstration and educational purposes
* Not intended for real-world regulatory enforcement

---

## Future Improvements

* Route optimization with traffic-aware APIs
* PDF export for HOS logs
* Authentication and multi-user support
* Persistent trip history database
* Real-time driver tracking simulation
