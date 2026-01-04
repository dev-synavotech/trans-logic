import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp,
  Settings,
  Edit3,
  Save,
  X,
  UserPlus,
  CheckCircle,
  Clock,
  MapPin,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  booking_number: string;
  origin: string;
  destination: string;
  status: string;
  total_price: number | null;
  pickup_date: string;
  created_at: string;
  provider_id: string | null;
  user_id: string;
}

interface TruckType {
  id: string;
  name: string;
  code: string;
  capacity_kg: number;
  price_per_km: number;
  icon: string | null;
}

interface Provider {
  id: string;
  email: string;
  full_name: string | null;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [editingTruck, setEditingTruck] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  useEffect(() => {
    fetchData();
    
    // Subscribe to real-time booking updates
    const channel = supabase
      .channel('admin-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(b => 
              b.id === (payload.new as Booking).id ? payload.new as Booking : b
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (bookingsData) setBookings(bookingsData);

      // Fetch truck types
      const { data: trucksData } = await supabase
        .from('truck_types')
        .select('*')
        .order('price_per_km', { ascending: true });
      
      if (trucksData) setTruckTypes(trucksData);

      // Fetch providers (users with provider role)
      const { data: providersData } = await supabase
        .from('profiles')
        .select('id, email, full_name, user_id')
        .limit(100);
      
      if (providersData) {
        setProviders(providersData.map(p => ({
          id: p.user_id,
          email: p.email || '',
          full_name: p.full_name
        })));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceEdit = (truckId: string) => {
    const truck = truckTypes.find(t => t.id === truckId);
    if (truck) {
      setEditedPrices({ ...editedPrices, [truckId]: truck.price_per_km });
      setEditingTruck(truckId);
    }
  };

  const handlePriceSave = async (truckId: string) => {
    try {
      const { error } = await supabase
        .from('truck_types')
        .update({ price_per_km: editedPrices[truckId] })
        .eq('id', truckId);

      if (error) throw error;

      setTruckTypes(prev => prev.map(t => 
        t.id === truckId ? { ...t, price_per_km: editedPrices[truckId] } : t
      ));
      setEditingTruck(null);
      toast.success('Price updated successfully');
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  const handleAssignProvider = async () => {
    if (!selectedBooking || !selectedProvider) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          provider_id: selectedProvider,
          status: 'confirmed'
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, provider_id: selectedProvider, status: 'confirmed' }
          : b
      ));
      setAssignDialogOpen(false);
      setSelectedBooking(null);
      setSelectedProvider("");
      toast.success('Provider assigned successfully');
    } catch (err) {
      toast.error('Failed to assign provider');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status } : b
      ));
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500';
      case 'in_transit': return 'bg-warning/10 text-warning';
      case 'delivered': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    activeBookings: bookings.filter(b => b.status === 'in_transit').length,
    totalRevenue: bookings
      .filter(b => b.status === 'delivered')
      .reduce((acc, b) => acc + (b.total_price || 0), 0),
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage bookings, pricing, and providers</p>
          </div>
          <Button variant="accent">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings.toString()}
            change="All time"
            changeType="neutral"
            icon={Package}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingBookings.toString()}
            change="Needs attention"
            changeType={stats.pendingBookings > 5 ? "negative" : "neutral"}
            icon={Clock}
            iconColor="bg-warning/10 text-warning"
          />
          <StatsCard
            title="In Transit"
            value={stats.activeBookings.toString()}
            change="Active now"
            changeType="neutral"
            icon={Truck}
            iconColor="bg-accent/10 text-accent"
          />
          <StatsCard
            title="Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
            change="Delivered only"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-success/10 text-success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bookings List */}
          <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
              <span className="text-sm text-muted-foreground">{bookings.length} total</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-accent/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{booking.booking_number}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {booking.origin} → {booking.destination}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status || 'pending')}`}>
                          {booking.status?.replace('_', ' ') || 'pending'}
                        </span>
                        {booking.total_price && (
                          <span className="text-sm font-semibold text-accent">
                            ₹{booking.total_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {booking.status === 'pending' && !booking.provider_id && (
                        <Dialog open={assignDialogOpen && selectedBooking?.id === booking.id} onOpenChange={(open) => {
                          setAssignDialogOpen(open);
                          if (open) setSelectedBooking(booking);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="accent">
                              <UserPlus className="w-3 h-3 mr-1" />
                              Assign Provider
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Provider to {booking.booking_number}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  {providers.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                      {provider.full_name || provider.email}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="accent" onClick={handleAssignProvider}>
                                  Assign
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'in_transit')}
                        >
                          <Truck className="w-3 h-3 mr-1" />
                          Start Transit
                        </Button>
                      )}
                      
                      {booking.status === 'in_transit' && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => updateBookingStatus(booking.id, 'delivered')}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Delivered
                        </Button>
                      )}

                      {booking.status !== 'delivered' && booking.status !== 'cancelled' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing Management */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Pricing Management</h3>
                <DollarSign className="w-5 h-5 text-accent" />
              </div>

              <div className="space-y-3">
                {truckTypes.map((truck) => (
                  <div key={truck.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{truck.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{truck.name}</p>
                        <p className="text-xs text-muted-foreground">{truck.capacity_kg} kg</p>
                      </div>
                    </div>
                    
                    {editingTruck === truck.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editedPrices[truck.id]}
                          onChange={(e) => setEditedPrices({ ...editedPrices, [truck.id]: parseFloat(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">/km</span>
                        <Button size="sm" variant="ghost" onClick={() => handlePriceSave(truck.id)}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingTruck(null)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-accent">₹{truck.price_per_km}/km</span>
                        <Button size="sm" variant="ghost" onClick={() => handlePriceEdit(truck.id)}>
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Provider Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                  <span className="text-sm text-foreground">Active Providers</span>
                  <span className="text-sm font-semibold text-success">{providers.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                  <span className="text-sm text-foreground">Unassigned Bookings</span>
                  <span className="text-sm font-semibold text-warning">
                    {bookings.filter(b => !b.provider_id && b.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                  <span className="text-sm text-foreground">Truck Types</span>
                  <span className="text-sm font-semibold text-accent">{truckTypes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;