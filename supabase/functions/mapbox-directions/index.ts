import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DirectionsRequest {
  origin: string;
  destination: string;
}

interface GeocodingResult {
  features: Array<{
    center: [number, number];
    place_name: string;
  }>;
}

interface DirectionsResult {
  routes: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: Array<[number, number]>;
    };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!MAPBOX_TOKEN) {
      console.error('MAPBOX_PUBLIC_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Mapbox token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { origin, destination }: DirectionsRequest = await req.json();
    
    console.log(`Getting directions from "${origin}" to "${destination}"`);

    // Geocode origin
    const originGeoResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const originGeo: GeocodingResult = await originGeoResponse.json();
    
    if (!originGeo.features?.length) {
      return new Response(
        JSON.stringify({ error: 'Could not find origin location' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Geocode destination
    const destGeoResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const destGeo: GeocodingResult = await destGeoResponse.json();
    
    if (!destGeo.features?.length) {
      return new Response(
        JSON.stringify({ error: 'Could not find destination location' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const originCoords = originGeo.features[0].center;
    const destCoords = destGeo.features[0].center;

    console.log(`Origin coords: ${originCoords}, Dest coords: ${destCoords}`);

    // Get directions
    const directionsResponse = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
    );
    const directions: DirectionsResult = await directionsResponse.json();

    if (!directions.routes?.length) {
      return new Response(
        JSON.stringify({ error: 'Could not calculate route' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const route = directions.routes[0];
    const distanceKm = route.distance / 1000;
    const durationHours = route.duration / 3600;

    console.log(`Route found: ${distanceKm.toFixed(1)}km, ${durationHours.toFixed(1)}h`);

    return new Response(
      JSON.stringify({
        origin: {
          name: originGeo.features[0].place_name,
          coordinates: originCoords,
        },
        destination: {
          name: destGeo.features[0].place_name,
          coordinates: destCoords,
        },
        distance: distanceKm,
        duration: durationHours,
        route: route.geometry.coordinates,
        mapboxToken: MAPBOX_TOKEN,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in mapbox-directions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});