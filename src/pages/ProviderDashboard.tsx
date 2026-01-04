import { 
  Truck, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import providerHero from "@/assets/provider-hero.png";

const myFleet = [
  { id: "TRK-001", type: "Container", status: "active", driver: "Ramesh K.", route: "Mumbai → Delhi", earnings: "₹12,500" },
  { id: "TRK-002", type: "HCV", status: "active", driver: "Suresh P.", route: "Bangalore → Chennai", earnings: "₹8,200" },
  { id: "TRK-003", type: "Reefer", status: "maintenance", driver: "Unassigned", route: "-", earnings: "₹0" },
  { id: "TRK-004", type: "LCV", status: "idle", driver: "Vijay M.", route: "-", earnings: "₹0" },
  { id: "TRK-005", type: "HCV", status: "active", driver: "Anil S.", route: "Pune → Ahmedabad", earnings: "₹9,800" },
];

const pendingBookings = [
  { id: "BK-2024301", route: "Kolkata → Hyderabad", truck: "HCV", price: "₹78,000", deadline: "In 2 hours" },
  { id: "BK-2024305", route: "Jaipur → Lucknow", truck: "Container", price: "₹55,000", deadline: "In 4 hours" },
  { id: "BK-2024308", route: "Chennai → Kochi", truck: "Reefer", price: "₹42,000", deadline: "Tomorrow" },
];

const recentPayouts = [
  { id: "PAY-001", amount: "₹1,25,000", date: "Jan 1, 2026", status: "completed" },
  { id: "PAY-002", amount: "₹98,500", date: "Dec 25, 2025", status: "completed" },
  { id: "PAY-003", amount: "₹1,15,000", date: "Dec 18, 2025", status: "completed" },
];

const ProviderDashboard = () => {
  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600">
          <img 
            src={providerHero} 
            alt="Provider Dashboard" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Fleet Provider Dashboard</h1>
                <p className="text-white/80">Manage your fleet, accept bookings, and track earnings</p>
              </div>
              <Button variant="secondary" className="w-fit">
                <Plus className="w-4 h-4 mr-2" />
                Add New Truck
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="Active Trucks"
            value="12"
            change="3 on route"
            changeType="neutral"
            icon={Truck}
            iconColor="bg-rose-500/10 text-rose-500"
          />
          <StatsCard
            title="Routes Covered"
            value="28"
            change="+4 this month"
            changeType="positive"
            icon={MapPin}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            title="This Month"
            value="₹4.8L"
            change="+18%"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-success/10 text-success"
          />
          <StatsCard
            title="Performance"
            value="94%"
            change="On-time delivery"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-accent/10 text-accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fleet Status */}
          <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">My Fleet</h3>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
            
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-border">
              {myFleet.map((truck) => (
                <div key={truck.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className={`w-4 h-4 ${
                        truck.status === 'active' ? 'text-success' :
                        truck.status === 'maintenance' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`} />
                      <span className="text-sm font-medium text-foreground">{truck.id}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      truck.status === 'active' ? 'bg-success/10 text-success' :
                      truck.status === 'maintenance' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {truck.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{truck.type} • {truck.driver}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{truck.route}</span>
                    <span className="text-sm font-semibold text-foreground">{truck.earnings}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Truck ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Driver</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Current Route</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myFleet.map((truck) => (
                    <tr key={truck.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Truck className={`w-4 h-4 ${
                            truck.status === 'active' ? 'text-success' :
                            truck.status === 'maintenance' ? 'text-destructive' :
                            'text-muted-foreground'
                          }`} />
                          <span className="text-sm font-medium text-foreground">{truck.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{truck.type}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{truck.driver}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{truck.route}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          truck.status === 'active' ? 'bg-success/10 text-success' :
                          truck.status === 'maintenance' ? 'bg-destructive/10 text-destructive' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {truck.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{truck.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Bookings */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Pending Requests</h3>
                <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {pendingBookings.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-accent">{booking.id}</span>
                      <span className="text-sm font-semibold text-foreground">{booking.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {booking.route}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{booking.truck}</span>
                      <span className="text-xs text-warning flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.deadline}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="accent" size="sm" className="flex-1">Accept</Button>
                      <Button variant="outline" size="sm" className="flex-1">Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payouts */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Payouts</h3>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {recentPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{payout.amount}</p>
                      <p className="text-xs text-muted-foreground">{payout.date}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                View All Payouts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
