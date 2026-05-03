import requests
import time
import logging

logger = logging.getLogger(__name__)

class GeocodingService:
    """
    Real-time geocoding using OpenStreetMap Nominatim API.
    Includes simple caching to respect rate limits and improve performance.
    """
    _cache = {}

    @classmethod
    def geocode(cls, location_name):
        if not location_name:
            return None
        
        query = location_name.lower().strip()
        if query in cls._cache:
            return cls._cache[query]
        
        try:
            # Nominatim requires a User-Agent header
            headers = {'User-Agent': 'TripPlanner/1.0'}
            url = "https://nominatim.openstreetmap.org/search"
            params = {'q': query, 'format': 'json', 'limit': 1}
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    coords = [float(data[0]['lon']), float(data[0]['lat'])]
                    cls._cache[query] = coords
                    # Nominatim rate limit: 1 request per second
                    time.sleep(1) 
                    return coords
            else:
                logger.error(f"Geocoding API error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Geocoding error for {location_name}: {e}")
            
        return None

class RoutingService:
    """
    Real-time road routing using OSRM Public API.
    Returns distance (miles), duration (hours), and geometry (polyline).
    """
    BASE_URL = "http://router.project-osrm.org/route/v1/driving"

    @classmethod
    def get_route(cls, start_coords, end_coords):
        """
        coords: [lon, lat]
        """
        if not start_coords or not end_coords:
            return None

        try:
            # OSRM format: lon,lat;lon,lat
            loc_string = f"{start_coords[0]},{start_coords[1]};{end_coords[0]},{end_coords[1]}"
            url = f"{cls.BASE_URL}/{loc_string}"
            params = {
                'overview': 'full',
                'geometries': 'polyline',
                'steps': 'false'
            }
            
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('routes'):
                    route = data['routes'][0]
                    return {
                        'distance_miles': route['distance'] * 0.000621371,
                        'duration_hours': route['duration'] / 3600.0,
                        'geometry': route['geometry'] # Encoded polyline
                    }
            else:
                logger.error(f"Routing API error: {response.status_code}")

        except Exception as e:
            logger.error(f"Routing error: {e}")

        return None
