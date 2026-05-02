import math
from datetime import datetime, timedelta

class HOSEngine:
    """
    Realistic Electronic Logging Device (ELD) & Hours of Service (HOS) Engine.
    Implements FMCSA rules with a segment-based simulation:
    - 11-Hour Driving Limit
    - 14-Hour On-Duty Window
    - 30-Minute Break after 8 hours of cumulative driving
    - 70-Hour / 8-Day Cycle Limit
    - 10-Hour Daily Rest
    """
    
    def __init__(self, cycle_used_hours=0):
        self.cycle_limit = 70.0
        self.cycle_used = float(cycle_used_hours)
        self.daily_drive_limit = 11.0
        self.daily_duty_limit = 14.0
        self.break_threshold = 8.0
        self.break_duration = 0.5
        self.rest_duration = 10.0
        self.average_speed = 55.0 # mph
        
        # Simulation state
        self.current_drive_since_rest = 0.0
        self.current_duty_since_rest = 0.0
        self.current_drive_since_break = 0.0
        self.duty_window_elapsed = 0.0
        self.is_on_duty = False

    def calculate_trip(self, total_miles):
        """
        Simulates the trip day-by-day, segment-by-segment.
        """
        remaining_miles = total_miles
        days = []
        day_count = 1
        current_date = datetime.now()
        
        while remaining_miles > 0:
            day_entries = []
            day_drive = 0.0
            day_on_duty = 0.0
            
            # 1. Start the Day (On-Duty)
            # Pre-trip inspection (0.5h)
            start_overhead = 0.5
            day_entries.append({
                "status": "ON_DUTY", 
                "hours": start_overhead, 
                "remarks": "Pre-trip Inspection",
                "time": "08:00"
            })
            
            self.cycle_used += start_overhead
            self.duty_window_elapsed = start_overhead
            day_on_duty += start_overhead
            self.current_drive_since_break = 0.0
            
            # 2. Drive segments
            while self.duty_window_elapsed < self.daily_duty_limit and remaining_miles > 0:
                # Check cycle availability
                cycle_remaining = self.cycle_limit - self.cycle_used
                if cycle_remaining <= 0:
                    # Must take 34-hour restart
                    day_entries.append({
                        "status": "OFF_DUTY", 
                        "hours": 24 - self.duty_window_elapsed, 
                        "remarks": "Cycle limit reached. Starting 34h restart."
                    })
                    self.cycle_used = 0
                    break

                # Max drive time possible in this "block"
                # Limited by: 11h daily, 14h window, 8h break rule, cycle
                max_drive = min(
                    self.daily_drive_limit - self.current_drive_since_rest,
                    self.daily_duty_limit - self.duty_window_elapsed,
                    self.break_threshold - self.current_drive_since_break,
                    cycle_remaining,
                    remaining_miles / self.average_speed
                )
                
                if max_drive > 0:
                    day_entries.append({
                        "status": "DRIVING", 
                        "hours": round(max_drive, 2), 
                        "remarks": f"Driving segment ({round(max_drive * self.average_speed)} mi)"
                    })
                    remaining_miles -= max_drive * self.average_speed
                    self.cycle_used += max_drive
                    self.duty_window_elapsed += max_drive
                    self.current_drive_since_rest += max_drive
                    self.current_drive_since_break += max_drive
                    day_drive += max_drive
                
                # Check if we need a break
                if self.current_drive_since_break >= self.break_threshold and remaining_miles > 0:
                    day_entries.append({
                        "status": "OFF_DUTY", 
                        "hours": 0.5, 
                        "remarks": "Required 30-minute break"
                    })
                    self.duty_window_elapsed += 0.5
                    self.current_drive_since_break = 0.0
                    day_on_duty += 0 # break is off-duty
                
                # Check if we hit daily limits
                if self.current_drive_since_rest >= self.daily_drive_limit or self.duty_window_elapsed >= self.daily_duty_limit:
                    break

            # 3. End of Day (Post-trip)
            if self.duty_window_elapsed < self.daily_duty_limit:
                post_trip = 0.5
                day_entries.append({
                    "status": "ON_DUTY", 
                    "hours": post_trip, 
                    "remarks": "Post-trip Inspection"
                })
                self.cycle_used += post_trip
                self.duty_window_elapsed += post_trip
                day_on_duty += post_trip

            # 4. Daily Rest (Off-Duty)
            rest_needed = 24 - self.duty_window_elapsed
            day_entries.append({
                "status": "OFF_DUTY", 
                "hours": round(rest_needed, 2), 
                "remarks": "10-hour daily rest"
            })
            
            # Reset daily counters
            self.current_drive_since_rest = 0.0
            self.current_duty_since_rest = 0.0
            self.duty_window_elapsed = 0.0
            
            days.append({
                "day": day_count,
                "date": (current_date + timedelta(days=day_count-1)).strftime("%Y-%m-%d"),
                "entries": day_entries,
                "summary": {
                    "driving": round(day_drive, 2),
                    "on_duty": round(day_on_duty, 2),
                    "off_duty": round(24 - day_drive - day_on_duty, 2)
                }
            })
            day_count += 1
            
            if day_count > 15: # Safety break for infinite loops
                break

        return {
            "total_miles": round(total_miles, 2),
            "total_drive_time": round(total_miles / self.average_speed, 2),
            "days": days,
            "final_cycle_used": round(self.cycle_used, 2)
        }
