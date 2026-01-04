import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Truck,
  CheckCircle,
  AlertCircle,
  Navigation,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import LiveTrackingMap from "@/components/tracking/LiveTrackingMap";
import customerHero from "@/assets/customer-hero.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Booking {
  id: string;
  booking_number: string;
  origin: string;
  destination: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_lat: number | null;
  destination_lng: number | null;
  status: string | null;
  total_price: number | null;
  pickup_date: string;
  distance_km: number | null;
  estimated_hours: number | null;
  created_at: string | null;
}

const CustomerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTracking, setSelectedTracking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchBookings();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('customer-bookings')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'bookings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setBookings(prev => [payload.new as Booking, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setBookings(prev => prev.map(b => 
                b.id === (payload.new as Booking).id ? payload.new as Booking : b
              ));
              // Update selected tracking if it matches
              if (selectedTracking?.id === (payload.new as Booking).id) {
                setSelectedTracking(payload.new as Booking);
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setBookings(data);
        // Auto-select first in-transit booking for tracking
        const inTransit = data.find(b => b.status === 'in_transit');
        if (inTransit) setSelectedTracking(inTransit);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (status: string | null) => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 25;
      case 'in_transit': return 65;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };
      case 'confirmed': return { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'in_transit': return { icon: Truck, color: 'text-warning', bg: 'bg-warning/10' };
      case 'delivered': return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' };
      case 'cancelled': return { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' };
      default: return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const stats = {
    total: bookings.length,
    inTransit: bookings.filter(b => b.status === 'in_transit').length,
    delivered: bookings.filter(b => b.status === 'delivered').length,
    totalSpent: bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((acc, b) => acc + (b.total_price || 0), 0),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600">
          <img 
            src={customerHero} 
            alt="Customer Dashboard" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Shipments</h1>
                <p className="text-white/80">Track your orders and book new shipments</p>
              </div>
              <Link to="/book">
                <Button variant="secondary" className="w-fit">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New Shipment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="Total Shipments"
            value={stats.total.toString()}
            change="All time"
            changeType="neutral"
            icon={Package}
            iconColor="bg-teal-500/10 text-teal-500"
          />
          <StatsCard
            title="In Transit"
            value={stats.inTransit.toString()}
            change="Active now"
            changeType="neutral"
            icon={Truck}
            iconColor="bg-warning/10 text-warning"
          />
          <StatsCard
            title="Delivered"
            value={stats.delivered.toString()}
            change="Completed"
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-success/10 text-success"
          />
          <StatsCard
            title="Total Spent"
            value={`₹${(stats.totalSpent / 1000).toFixed(1)}K`}
            change="This year"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="bg-accent/10 text-accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Bookings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
              <Button variant="ghost" size="sm" onClick={fetchBookings}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-card border border-border">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Link to="/book">
                  <Button variant="accent">Book Your First Shipment</Button>
                </Link>
              </div>
            ) : (
              bookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={booking.id} className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6 hover:shadow-medium transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusInfo.bg}`}>
                          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-accent">{booking.booking_number}</p>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {booking.origin} → {booking.destination}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                          {booking.status?.replace('_', ' ') || 'pending'}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          ₹{(booking.total_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{booking.pickup_date}</span>
                        <span>{booking.estimated_hours ? `~${Math.round(booking.estimated_hours)}h` : 'ETA pending'}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            booking.status === 'delivered' ? 'bg-success' :
                            booking.status === 'in_transit' ? 'bg-warning' :
                            booking.status === 'confirmed' ? 'bg-blue-500' :
                            'bg-muted-foreground'
                          }`}
                          style={{ width: `${getProgress(booking.status)}%` }}
                        />
                      </div>
                    </div>

                    {(booking.status === 'in_transit' || booking.status === 'confirmed') && 
                     booking.origin_lat && booking.destination_lat && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => setSelectedTracking(booking)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Track Live
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Tracking */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Live Tracking</h3>
                {selectedTracking && (
                  <span className="text-xs text-accent font-medium">{selectedTracking.booking_number}</span>
                )}
              </div>
              
              {selectedTracking && 
               selectedTracking.origin_lat && selectedTracking.destination_lat &&
               selectedTracking.origin_lng && selectedTracking.destination_lng ? (
                <LiveTrackingMap
                  bookingId={selectedTracking.booking_number}
                  origin={{
                    lat: selectedTracking.origin_lat,
                    lng: selectedTracking.origin_lng,
                    name: selectedTracking.origin,
                  }}
                  destination={{
                    lat: selectedTracking.destination_lat,
                    lng: selectedTracking.destination_lng,
                    name: selectedTracking.destination,
                  }}
                  progress={getProgress(selectedTracking.status)}
                  status={selectedTracking.status || 'pending'}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Navigation className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No active shipment to track</p>
                  <p className="text-xs mt-1">Book a shipment to see live tracking</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/book" className="block">
                  <Button variant="accent" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Shipment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report an Issue
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={fetchBookings}>
                  <Clock className="w-4 h-4 mr-2" />
                  Refresh Bookings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;