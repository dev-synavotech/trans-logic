import { MoreHorizontal, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const bookings = [
  {
    id: "BK-2024001",
    customer: "Acme Corp",
    route: "Mumbai → Delhi",
    status: "In Transit",
    statusColor: "bg-warning/10 text-warning",
    truck: "Container",
    eta: "2h 30m",
    price: "₹45,000"
  },
  {
    id: "BK-2024002",
    customer: "Tech Solutions",
    route: "Bangalore → Chennai",
    status: "Delivered",
    statusColor: "bg-success/10 text-success",
    truck: "LCV",
    eta: "Completed",
    price: "₹12,500"
  },
  {
    id: "BK-2024003",
    customer: "Global Imports",
    route: "Kolkata → Hyderabad",
    status: "Pending",
    statusColor: "bg-muted text-muted-foreground",
    truck: "HCV",
    eta: "Awaiting",
    price: "₹78,000"
  },
  {
    id: "BK-2024004",
    customer: "Fresh Foods Ltd",
    route: "Pune → Ahmedabad",
    status: "In Transit",
    statusColor: "bg-warning/10 text-warning",
    truck: "Reefer",
    eta: "5h 15m",
    price: "₹32,000"
  },
  {
    id: "BK-2024005",
    customer: "Steel Works Inc",
    route: "Jaipur → Lucknow",
    status: "Assigned",
    statusColor: "bg-accent/10 text-accent",
    truck: "HCV",
    eta: "Starting",
    price: "₹55,000"
  }
];

const RecentBookings = () => {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Bookings</h3>
        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
          View All
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </Button>
      </div>
      
      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-border">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-accent">{booking.id}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${booking.statusColor}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{booking.customer}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {booking.route}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{booking.truck} • {booking.eta}</span>
              <span className="text-sm font-semibold text-foreground">{booking.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3">Booking ID</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3 hidden md:table-cell">Route</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3 hidden lg:table-cell">Truck Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3 hidden lg:table-cell">ETA</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3">Price</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 lg:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 lg:px-6 py-4">
                  <span className="text-sm font-medium text-accent">{booking.id}</span>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <span className="text-sm text-foreground">{booking.customer}</span>
                </td>
                <td className="px-4 lg:px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {booking.route}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-foreground">{booking.truck}</span>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${booking.statusColor}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{booking.eta}</span>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">{booking.price}</span>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
