from rest_framework.decorators import api_view
from rest_framework.response import Response
from .engine import HOSEngine
from .utils import GeocodingService, RoutingService
import os

@api_view(['POST'])
def calculate_logs(request):
    data = request.data
    
    current_loc_name = data.get("current_location", "")
    pickup_name = data.get("pickup", "")
    dropoff_name = data.get("dropoff", "")
    used_hours = float(data.get("used_hours", 0) or 0)
    
    if not pickup_name or not dropoff_name:
        return Response({"error": "Pickup and dropoff locations are required"}, status=400)

    # 1. Real Geocoding
    origin_coords = GeocodingService.geocode(current_loc_name) if current_loc_name else None
    pickup_coords = GeocodingService.geocode(pickup_name)
    destination_coords = GeocodingService.geocode(dropoff_name)
    
    if not pickup_coords or not destination_coords:
        return Response({"error": "Could not geocode pickup or destination location"}, status=400)

    # 2. Real Routing
    # Segment 1: Current -> Pickup (if origin exists)
    seg1 = None
    if origin_coords:
        seg1 = RoutingService.get_route(origin_coords, pickup_coords)
    
    # Segment 2: Pickup -> Destination
    seg2 = RoutingService.get_route(pickup_coords, destination_coords)
    
    if not seg2:
        return Response({"error": "Could not calculate route between locations"}, status=400)

    total_miles = (seg1['distance_miles'] if seg1 else 0) + seg2['distance_miles']
    
    # 3. Generate HOS logs
    engine = HOSEngine(cycle_used_hours=used_hours)
    plan = engine.calculate_trip(total_miles)
    
    # 4. Compliance check
    violations = []
    if used_hours > 70:
        violations.append("Initial cycle hours exceed 70-hour limit.")
    
    for day in plan["days"]:
        if day["summary"]["driving"] > 11.01:
            violations.append(f"Day {day['day']}: Driving time exceeded 11-hour limit.")
        total_duty = day["summary"]["driving"] + day["summary"]["on_duty"]
        if total_duty > 14.01:
            violations.append(f"Day {day['day']}: Duty window exceeded 14-hour limit.")

    # 5. Build Response with geometry
    return Response({
        "status": "success",
        "route": {
            "origin": current_loc_name,
            "pickup": pickup_name,
            "destination": dropoff_name,
            "total_miles": round(total_miles, 2),
            "miles_to_pickup": round(seg1['distance_miles'], 2) if seg1 else 0,
            "miles_to_destination": round(seg2['distance_miles'], 2),
            "geometry": seg2['geometry'], # We use seg2 for primary visualization
            "full_geometry": [seg1['geometry'], seg2['geometry']] if seg1 else [seg2['geometry']],
            "coordinates": {
                "origin": origin_coords,
                "pickup": pickup_coords,
                "destination": destination_coords
            }
        },
        "plan": plan,
        "compliance": {
            "violations": list(set(violations)),
            "is_compliant": len(violations) == 0
        }
    })