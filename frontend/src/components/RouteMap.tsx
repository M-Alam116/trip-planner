import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from 'lucide-react'
import polyline from '@mapbox/polyline'

interface RouteMapProps {
  origin?: string
  pickup: string
  destination: string
  totalDistance: number
  geometries: string[]
  coordinates: {
    origin: [number, number] | null
    pickup: [number, number]
    destination: [number, number]
  }
}

export default function RouteMap({
  origin,
  pickup,
  destination,
  totalDistance,
  geometries,
  coordinates
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default

        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (mapRef.current) {
          mapRef.current.remove()
        }

        // Initialize map centered at pickup
        const map = L.map(mapContainerRef.current, {
          zoomControl: false
        }).setView([coordinates.pickup[1], coordinates.pickup[0]], 6)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map)

        // Custom Markers
        const createIcon = (color: string, text: string) => L.divIcon({
          html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;">${text}</div>`,
          className: 'custom-div-icon',
          iconSize: [28, 28]
        })

        // Add Markers (Handle [lon, lat] from backend)
        if (coordinates.origin) {
          L.marker([coordinates.origin[1], coordinates.origin[0]], { icon: createIcon('#64748b', 'O') }).addTo(map)
            .bindPopup(`<b>Origin:</b> ${origin}`)
        }

        L.marker([coordinates.pickup[1], coordinates.pickup[0]], { icon: createIcon('#2563eb', 'P') }).addTo(map)
          .bindPopup(`<b>Pickup:</b> ${pickup}`)

        L.marker([coordinates.destination[1], coordinates.destination[0]], { icon: createIcon('#10b981', 'D') }).addTo(map)
          .bindPopup(`<b>Destination:</b> ${destination}`)

        // Render Polylines from geometry
        const allPoints: [number, number][] = []

        geometries.forEach((geom, idx) => {
          const decoded = polyline.decode(geom)
          // decoded is [[lat, lon], ...] which Leaflet uses
          L.polyline(decoded, {
            color: idx === 0 && geometries.length > 1 ? '#94a3b8' : '#2563eb',
            weight: 4,
            opacity: 0.8,
            dashArray: idx === 0 && geometries.length > 1 ? '5, 10' : ''
          }).addTo(map)

          decoded.forEach(p => allPoints.push(p as [number, number]))
        })

        // Fit Bounds
        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints)
          setTimeout(() => {
            map.invalidateSize()
            map.fitBounds(bounds, { padding: [50, 50], animate: true })
          }, 100)
        }

        mapRef.current = map
      } catch (err) {
        console.error('Leaflet error:', err)
      }
    }

    initMap()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [coordinates, geometries])

  return (
    <Card className="overflow-hidden border-none shadow-2xl ring-1 ring-slate-200">
      <CardHeader className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-lg flex items-center gap-3 font-black uppercase tracking-tight">
            <Navigation className="w-6 h-6 text-primary" />
            Live Route Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-black text-sm px-3 py-1 bg-primary/10 text-primary border-none">
              {totalDistance} Total Miles
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[600px] z-0"
        />
        {/* Floating Info */}
        <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-slate-100 max-w-xs animate-in slide-in-from-left-4 duration-500">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Current Route</p>
          <div className="flex items-center gap-2 text-sm font-bold truncate">
            <span className="text-blue-600">{pickup.split(',')[0]}</span>
            <span className="text-slate-300">→</span>
            <span className="text-green-600">{destination.split(',')[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
