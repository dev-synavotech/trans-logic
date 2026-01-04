import { 
  DollarSign, 
  Users2, 
  TrendingUp, 
  Link2, 
  Copy, 
  ArrowUpRight,
  Package,
  Percent,
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import affiliateHero from "@/assets/affiliate-hero.png";

const commissionHistory = [
  { id: "COM-001", booking: "BK-2024102", customer: "Acme Corp", amount: "₹2,450", status: "paid", date: "Today" },
  { id: "COM-002", booking: "BK-2024098", customer: "Tech Solutions", amount: "₹1,800", status: "pending", date: "Yesterday" },
  { id: "COM-003", booking: "BK-2024095", customer: "Global Imports", amount: "₹5,200", status: "paid", date: "2 days ago" },
  { id: "COM-004", booking: "BK-2024090", customer: "Fresh Foods", amount: "₹3,100", status: "paid", date: "3 days ago" },
  { id: "COM-005", booking: "BK-2024085", customer: "Steel Works", amount: "₹4,750", status: "processing", date: "4 days ago" },
];

const topCustomers = [
  { name: "Acme Corp", bookings: 45, revenue: "₹4.2L", growth: "+12%" },
  { name: "Tech Solutions", bookings: 38, revenue: "₹3.8L", growth: "+8%" },
  { name: "Global Imports", bookings: 32, revenue: "₹3.2L", growth: "+15%" },
  { name: "Fresh Foods Ltd", bookings: 28, revenue: "₹2.6L", growth: "+5%" },
];

const AffiliateDashboard = () => {
  const referralLink = "https://translogic.io/ref/AFF-2024-XYZ";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <DashboardLayout role="affiliate">
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600">
          <img 
            src={affiliateHero} 
            alt="Affiliate Dashboard" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Affiliate Dashboard</h1>
                <p className="text-white/80">Track commissions, manage referrals, and grow your network</p>
              </div>
              <Button variant="secondary" className="w-fit">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Referral Link</p>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{referralLink}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="accent" size="sm">
                Share
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="Total Earnings"
            value="₹1.85L"
            change="+22%"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-amber-500/10 text-amber-500"
          />
          <StatsCard
            title="Active Referrals"
            value="48"
            change="+5 this month"
            changeType="positive"
            icon={Users2}
            iconColor="bg-purple-500/10 text-purple-500"
          />
          <StatsCard
            title="Bookings Generated"
            value="156"
            change="+18%"
            changeType="positive"
            icon={Package}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            title="Commission Rate"
            value="8%"
            change="Standard"
            changeType="neutral"
            icon={Percent}
            iconColor="bg-accent/10 text-accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Commission History */}
          <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Commission History</h3>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                This Month
              </Button>
            </div>
            
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-border">
              {commissionHistory.map((item) => (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">{item.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'paid' ? 'bg-success/10 text-success' :
                      item.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{item.customer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                    <span className="text-sm font-semibold text-foreground">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Booking</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissionHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-accent">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.booking}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.customer}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          item.status === 'paid' ? 'bg-success/10 text-success' :
                          item.status === 'pending' ? 'bg-warning/10 text-warning' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Customers */}
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Top Customers</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{customer.name}</span>
                    </div>
                    <span className="text-xs text-success">{customer.growth}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{customer.bookings} bookings</span>
                    <span className="font-semibold text-foreground">{customer.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Customers
            </Button>
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Earnings Trend</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Earnings chart visualization</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDashboard;
