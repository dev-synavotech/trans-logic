import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Truck, Clock, MapPin, Navigation } from "lucide-react";

interface LiveTrackingMapProps {
  bookingId: string;
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  currentPosition?: { lat: number; lng: number };
  progress: number;
  status: string;
}

const LiveTrackingMap = ({
  bookingId,
  origin,
  destination,
  currentPosition,
  progress,
  status,
}: LiveTrackingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const truckMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapToken, setMapToken] = useState<string | null>(null);

  // Fetch mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `https://ytijabuzdomrlfpanoao.supabase.co/functions/v1/mapbox-directions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              origin: `${origin.lng},${origin.lat}`,
              destination: `${destination.lng},${destination.lat}`,
            }),
          }
        );
        const data = await response.json();
        if (data.mapboxToken) {
          setMapToken(data.mapboxToken);
        }
      } catch (err) {
        console.error("Failed to fetch token:", err);
      }
    };
    fetchToken();
  }, [origin, destination]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;

    mapboxgl.accessToken = mapToken;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([origin.lng, origin.lat]);
    bounds.extend([destination.lng, destination.lat]);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      bounds: bounds,
      fitBoundsOptions: { padding: 50 },
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add route line
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [origin.lng, origin.lat],
              [destination.lng, destination.lat],
            ],
          },
        },
      });

      map.current.addLayer({
        id: "route-bg",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#1e293b",
          "line-width": 6,
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#14b8a6",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      });

      // Origin marker
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([origin.lng, origin.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Origin</strong><br/>${origin.name}`))
        .addTo(map.current);

      // Destination marker
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([destination.lng, destination.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Destination</strong><br/>${destination.name}`))
        .addTo(map.current);

      // Truck marker (current position)
      const truckPosition = currentPosition || interpolatePosition(origin, destination, progress / 100);
      
      const truckEl = document.createElement("div");
      truckEl.className = "truck-marker";
      truckEl.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #14b8a6, #0d9488);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
          animation: pulse 2s infinite;
        ">
          <span style="font-size: 18px;">🚛</span>
        </div>
      `;

      truckMarker.current = new mapboxgl.Marker(truckEl)
        .setLngLat([truckPosition.lng, truckPosition.lat])
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken, origin, destination]);

  // Update truck position
  useEffect(() => {
    if (!truckMarker.current) return;
    
    const position = currentPosition || interpolatePosition(origin, destination, progress / 100);
    truckMarker.current.setLngLat([position.lng, position.lat]);
  }, [currentPosition, progress, origin, destination]);

  const interpolatePosition = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    t: number
  ) => ({
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  });

  const getStatusBadge = () => {
    switch (status) {
      case "in_transit":
        return (
          <span className="flex items-center gap-1.5 text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center gap-1.5 text-xs bg-success/20 text-success px-2 py-1 rounded-full">
            Delivered
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {/* Map */}
      <div ref={mapContainer} className="h-48 sm:h-56 w-full" />

      {/* Info Bar */}
      <div className="bg-card p-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-accent">{bookingId}</span>
          {getStatusBadge()}
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Route Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="truncate max-w-[100px]">{origin.name}</span>
          </div>
          <Navigation className="w-3 h-3 text-accent" />
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="truncate max-w-[100px]">{destination.name}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LiveTrackingMap;