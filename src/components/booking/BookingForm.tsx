import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Package, Truck, ArrowRight, Calculator, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RouteMap from "./RouteMap";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Route", icon: MapPin },
  { id: 2, title: "Package", icon: Package },
  { id: 3, title: "Truck", icon: Truck },
  { id: 4, title: "Review", icon: Calculator },
];

const truckTypes = [
  { id: "mini", name: "Mini Truck", capacity: "500 kg", pricePerKm: 15, icon: "🚐" },
  { id: "lcv", name: "LCV", capacity: "1.5 Tons", pricePerKm: 22, icon: "🚛" },
  { id: "hcv", name: "HCV", capacity: "5 Tons", pricePerKm: 35, icon: "🚚" },
  { id: "container", name: "Container", capacity: "20 Tons", pricePerKm: 55, icon: "📦" },
  { id: "reefer", name: "Reefer", capacity: "10 Tons", pricePerKm: 65, icon: "❄️" },
];

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    originCoords: [number, number];
    destCoords: [number, number];
  } | null>(null);
  
  const [formData, setFormData] = useState({
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    pickupDate: searchParams.get("date") || "",
    stops: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    description: ""
  });

  useEffect(() => {
    const truckParam = searchParams.get("truckType");
    if (truckParam) {
      setSelectedTruck(truckParam);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleRouteCalculated = useCallback((data: {
    distance: number;
    duration: number;
    originCoords: [number, number];
    destCoords: [number, number];
  }) => {
    setRouteInfo(data);
  }, []);

  const calculatePrice = () => {
    if (!routeInfo || !selectedTruck) return 0;
    const truck = truckTypes.find(t => t.id === selectedTruck);
    if (!truck) return 0;
    return Math.round(routeInfo.distance * truck.pricePerKm);
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a shipment");
      navigate("/auth");
      return;
    }

    if (!formData.pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }

    setSubmitting(true);

    try {
      // Generate a temporary booking number (will be replaced by trigger)
      const tempBookingNumber = `BK${Date.now()}`;
      
      const { error } = await supabase.from("bookings").insert({
        booking_number: tempBookingNumber,
        user_id: user.id,
        origin: formData.origin,
        destination: formData.destination,
        origin_lat: routeInfo?.originCoords[1],
        origin_lng: routeInfo?.originCoords[0],
        destination_lat: routeInfo?.destCoords[1],
        destination_lng: routeInfo?.destCoords[0],
        pickup_date: formData.pickupDate,
        package_weight: formData.weight ? parseFloat(formData.weight) : null,
        package_length: formData.length ? parseFloat(formData.length) : null,
        package_width: formData.width ? parseFloat(formData.width) : null,
        package_height: formData.height ? parseFloat(formData.height) : null,
        package_description: formData.description,
        distance_km: routeInfo?.distance,
        estimated_hours: routeInfo?.duration,
        total_price: calculatePrice(),
        status: "pending",
      });

      if (error) throw error;

      toast.success("Booking confirmed! You can track it in your dashboard.");
      navigate("/customer");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                currentStep >= step.id 
                  ? "bg-accent text-accent-foreground shadow-glow" 
                  : "bg-muted text-muted-foreground"
              )}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <span className={cn(
                "mt-2 text-xs sm:text-sm font-medium hidden sm:block",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 sm:w-16 lg:w-24 h-0.5 mx-2 sm:mx-4 transition-colors",
                currentStep > step.id ? "bg-accent" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 lg:p-8">
        {/* Step 1: Route */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Enter Route Details</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                  <input
                    type="text"
                    placeholder="Enter drop location"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pickup Date</label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                className="w-full h-12 px-4 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            {/* Route Map */}
            <RouteMap 
              origin={formData.origin} 
              destination={formData.destination}
              onRouteCalculated={handleRouteCalculated}
            />
          </div>
        )}

        {/* Step 2: Package */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Package Details</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full h-12 px-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Length (cm)</label>
                  <input
                    type="number"
                    placeholder="L"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                    className="w-full h-12 px-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Width</label>
                  <input
                    type="number"
                    placeholder="W"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                    className="w-full h-12 px-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Height</label>
                  <input
                    type="number"
                    placeholder="H"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full h-12 px-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                placeholder="Describe your shipment"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Truck Selection */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Select Truck Type</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {truckTypes.map((truck) => (
                <button
                  key={truck.id}
                  onClick={() => setSelectedTruck(truck.id)}
                  className={cn(
                    "p-3 sm:p-5 rounded-xl border-2 text-left transition-all duration-300 hover-lift",
                    selectedTruck === truck.id 
                      ? "border-accent bg-accent/5 shadow-glow" 
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{truck.icon}</div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{truck.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{truck.capacity}</p>
                  <p className="text-accent text-sm sm:text-base font-semibold">₹{truck.pricePerKm}/km</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Review & Confirm</h2>
            
            {/* Map Preview */}
            <RouteMap 
              origin={formData.origin} 
              destination={formData.destination}
              onRouteCalculated={handleRouteCalculated}
            />
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Route Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Origin:</span> <span className="text-foreground">{formData.origin || "Not set"}</span></p>
                  <p><span className="text-muted-foreground">Destination:</span> <span className="text-foreground">{formData.destination || "Not set"}</span></p>
                  <p><span className="text-muted-foreground">Distance:</span> <span className="text-foreground">{routeInfo ? `${routeInfo.distance.toFixed(1)} km` : "Calculating..."}</span></p>
                  <p><span className="text-muted-foreground">Est. Time:</span> <span className="text-foreground">{routeInfo ? formatDuration(routeInfo.duration) : "Calculating..."}</span></p>
                  <p><span className="text-muted-foreground">Pickup Date:</span> <span className="text-foreground">{formData.pickupDate || "Not set"}</span></p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Package Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Weight:</span> <span className="text-foreground">{formData.weight || "N/A"} kg</span></p>
                  <p><span className="text-muted-foreground">Dimensions:</span> <span className="text-foreground">{formData.length && formData.width && formData.height ? `${formData.length}×${formData.width}×${formData.height} cm` : "N/A"}</span></p>
                  <p><span className="text-muted-foreground">Truck:</span> <span className="text-foreground">{truckTypes.find(t => t.id === selectedTruck)?.name || "Not selected"}</span></p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Estimated Price</h4>
                  <p className="text-sm text-muted-foreground">Including all taxes & fees</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-accent">
                    ₹{calculatePrice().toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ETA: {routeInfo ? formatDuration(routeInfo.duration) : "Calculating..."}
                  </p>
                </div>
              </div>
            </div>

            {!user && (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-center">
                <p className="text-sm text-warning-foreground">
                  Please <a href="/auth" className="text-accent underline font-medium">sign in</a> to confirm your booking
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border gap-4">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1 sm:flex-none"
          >
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button variant="accent" onClick={handleNext} className="flex-1 sm:flex-none">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="accent" 
              size="lg" 
              className="flex-1 sm:flex-none"
              onClick={handleConfirmBooking}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Confirm Booking
                  <CheckCircle className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
