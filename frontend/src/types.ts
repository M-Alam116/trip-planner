export interface LogEntry {
  status: 'OFF_DUTY' | 'DRIVING' | 'ON_DUTY' | 'SLEEPER_BERTH';
  hours: number;
  remarks: string;
}

export interface DayLog {
  day: number;
  date: string;
  entries: LogEntry[];
  summary: {
    driving: number;
    on_duty: number;
    off_duty: number;
  };
}

export interface TripPlanResponse {
  status: string;
  route: {
    origin: string;
    pickup: string;
    destination: string;
    total_miles: number;
    miles_to_pickup: number;
    miles_to_destination: number;
    geometry: string;
    full_geometry: string[];
    coordinates: {
      origin: [number, number] | null;
      pickup: [number, number];
      destination: [number, number];
    };
  };
  plan: {
    total_miles: number;
    total_drive_time: number;
    days: DayLog[];
    final_cycle_used: number;
  };
  compliance: {
    violations: string[];
    is_compliant: boolean;
  };
}
