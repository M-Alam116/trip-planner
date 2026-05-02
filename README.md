# Trip ELD - Smart Trip Planner & Compliance Engine

Trip ELD is a production-grade Electronic Logging Device (ELD) simulation and trip planning platform. It helps truck drivers and fleet managers plan compliant routes, visualize HOS (Hours of Service) logs, and verify regulatory adherence in real-time.

## Key Features

### 1. Smart Routing Engine
- **Real-Time Geocoding**: Uses OpenStreetMap Nominatim to convert city names into precise coordinates.
- **Road Routing**: Integrates with OSRM (Open Source Routing Machine) to calculate actual road distances and travel times.
- **Live Map Visualization**: Interactive Leaflet-based map rendering real road polylines and dynamic markers.

### 2. FMCSA-Compliant HOS Engine
- **Strict Rule Enforcement**: Implements the 11-hour driving limit, 14-hour on-duty window, and the mandatory 30-minute break after 8 hours of driving.
- **70-Hour / 8-Day Cycle Tracking**: Monitors cumulative duty time and automatically suggests 34-hour restarts when limits are reached.
- **Segmented Simulation**: Generates granular log entries (Driving, On-Duty, Off-Duty, Sleeper Berth) based on trip distance and operational overhead.

### 3. Digital Daily Log Sheets
- **High-Fidelity Grid**: A modern 24-hour block-based grid visualization with 30-minute precision.
- **Status Color-Coding**: Visual differentiation between operational states (Driving, On-Duty, etc.).
- **Total Summaries**: Automatic calculation of daily totals for easy auditing.

### 4. Automated Compliance Audit
- **Instant Violation Detection**: Real-time analysis of the generated plan against FMCSA Part 395 regulations.
- **Audit Certification**: Visual "Plan Certified" or "Violation Warning" badges with detailed breakdown of regulatory breaches.

## Technology Stack

### Backend
- **Framework**: Django 4.x
- **API**: Django Rest Framework (DRF)
- **Geocoding**: OpenStreetMap Nominatim
- **Routing**: OSRM (Public API)
- **Logic**: Custom Python HOS Simulation Engine

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS + ShadCN UI
- **Mapping**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### `POST /api/logs/calculate/`
Calculates a full trip plan and compliance logs.
- **Body**:
  ```json
  {
    "current_location": "Chicago, IL",
    "pickup": "Detroit, MI",
    "dropoff": "New York, NY",
    "used_hours": 15.5
  }
  ```
