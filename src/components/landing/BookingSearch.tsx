import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Package, ArrowRight, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const truckTypes = [
  { id: "mini", name: "Mini Truck", icon: "🚐" },
  { id: "lcv", name: "LCV", icon: "🚛" },
  { id: "hcv", name: "HCV", icon: "🚚" },
  { id: "container", name: "Container", icon: "📦" },
  { id: "reefer", name: "Reefer", icon: "❄️" },
];

const BookingSearch = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [truckType, setTruckType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to booking page with search params
    const params = new URLSearchParams({
      origin,
      destination,
      date,
      truckType,
    });
    navigate(`/book?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slide-up animation-delay-150">
      <form onSubmit={handleSearch}>
        {/* Main Search Card */}
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-4 sm:p-6 lg:p-8">
          {/* Search Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-2.5 rounded-xl bg-accent/10">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Book Your Shipment</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Search routes and get instant pricing</p>
            </div>
          </div>

          {/* Search Fields - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Origin */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                Origin
              </label>
              <Input
                placeholder="Enter pickup location"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="h-11 sm:h-12 bg-muted/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* Destination */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                Destination
              </label>
              <Input
                placeholder="Enter drop location"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-11 sm:h-12 bg-muted/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                Pickup Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 sm:h-12 bg-muted/50 border-border/50 focus:border-accent"
              />
            </div>

            {/* Truck Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                Truck Type
              </label>
              <Select value={truckType} onValueChange={setTruckType}>
                <SelectTrigger className="h-11 sm:h-12 bg-muted/50 border-border/50 focus:border-accent">
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  {truckTypes.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      <span className="flex items-center gap-2">
                        <span>{truck.icon}</span>
                        <span>{truck.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button & Quick Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/30">
            {/* Quick Info */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Real-time pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>500+ trucks available</span>
              </div>
            </div>

            {/* Search Button */}
            <Button 
              type="submit" 
              variant="accent" 
              size="lg" 
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Search Routes
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trust Badges - Below Search */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 px-2">
          <TrustBadge icon="✓" text="Instant Confirmation" />
          <TrustBadge icon="🔒" text="Secure Payment" />
          <TrustBadge icon="📍" text="Live Tracking" />
          <TrustBadge icon="💰" text="Best Prices" />
        </div>
      </form>
    </div>
  );
};

const TrustBadge = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-1.5 sm:gap-2 text-primary-foreground/60">
    <span className="text-sm sm:text-base">{icon}</span>
    <span className="text-xs sm:text-sm font-medium">{text}</span>
  </div>
);

export default BookingSearch;
