import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, Clock, Ruler, Loader2 } from "lucide-react";

interface RouteMapProps {
  origin: string;
  destination: string;
  onRouteCalculated?: (data: {
    distance: number;
    duration: number;
    originCoords: [number, number];
    destCoords: [number, number];
  }) => void;
}

interface RouteData {
  origin: { name: string; coordinates: [number, number] };
  destination: { name: string; coordinates: [number, number] };
  distance: number;
  duration: number;
  route: Array<[number, number]>;
  mapboxToken: string;
}

const RouteMap = ({ origin, destination, onRouteCalculated }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://ytijabuzdomrlfpanoao.supabase.co/functions/v1/mapbox-directions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, destination }),
          }
        );

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setRouteData(data);
        onRouteCalculated?.({
          distance: data.distance,
          duration: data.duration,
          originCoords: data.origin.coordinates,
          destCoords: data.destination.coordinates,
        });
      } catch (err) {
        console.error("Failed to fetch route:", err);
        setError("Failed to calculate route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination, onRouteCalculated]);

  useEffect(() => {
    if (!mapContainer.current || !routeData) return;

    mapboxgl.accessToken = routeData.mapboxToken;

    // Calculate bounds
    const bounds = new mapboxgl.LngLatBounds();
    routeData.route.forEach((coord) => bounds.extend(coord));

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      bounds: bounds,
      fitBoundsOptions: { padding: 60 },
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

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
            coordinates: routeData.route,
          },
        },
      });

      map.current.addLayer({
        id: "route-outline",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1a1a2e",
          "line-width": 8,
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#14b8a6",
          "line-width": 4,
        },
      });

      // Add origin marker
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(routeData.origin.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Origin</strong><br/>${routeData.origin.name}`))
        .addTo(map.current);

      // Add destination marker
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(routeData.destination.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Destination</strong><br/>${routeData.destination.name}`))
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [routeData]);

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (!origin || !destination) {
    return (
      <div className="rounded-xl bg-muted/30 border border-border h-64 sm:h-80 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Navigation className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Enter origin and destination to see route</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-muted/30 border border-border h-64 sm:h-80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Calculating route...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 border border-destructive/30 h-64 sm:h-80 flex items-center justify-center">
        <div className="text-center text-destructive">
          <MapPin className="w-10 h-10 mx-auto mb-3" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-border">
        <div ref={mapContainer} className="h-64 sm:h-80 w-full" />
        
        {/* Route Info Overlay */}
        {routeData && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-auto">
            <div className="bg-card/95 backdrop-blur-md rounded-lg border border-border shadow-lg p-3 sm:p-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-semibold text-foreground">
                      {routeData.distance.toFixed(1)} km
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Time</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDuration(routeData.duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Summary */}
      {routeData && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-foreground truncate max-w-[200px]">{routeData.origin.name}</span>
          </div>
          <span className="hidden sm:block text-muted-foreground">→</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-foreground truncate max-w-[200px]">{routeData.destination.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;