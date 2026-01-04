import { useState } from "react";
import { 
  Headphones, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  User,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import supportHero from "@/assets/support-hero.png";

const tickets = [
  {
    id: "TKT-001",
    customer: "Acme Corp",
    issue: "Shipment delayed - BK-2024001",
    priority: "high",
    status: "open",
    assignee: "John D.",
    createdAt: "10 mins ago"
  },
  {
    id: "TKT-002",
    customer: "Tech Solutions",
    issue: "Wrong delivery address",
    priority: "medium",
    status: "in_progress",
    assignee: "Sarah M.",
    createdAt: "1 hour ago"
  },
  {
    id: "TKT-003",
    customer: "Global Imports",
    issue: "Invoice discrepancy",
    priority: "low",
    status: "resolved",
    assignee: "Mike R.",
    createdAt: "3 hours ago"
  },
  {
    id: "TKT-004",
    customer: "Fresh Foods Ltd",
    issue: "Reefer temperature issue",
    priority: "high",
    status: "escalated",
    assignee: "Team Lead",
    createdAt: "5 hours ago"
  },
  {
    id: "TKT-005",
    customer: "Steel Works Inc",
    issue: "Route change request",
    priority: "medium",
    status: "open",
    assignee: "Unassigned",
    createdAt: "6 hours ago"
  }
];

const recentChats = [
  { customer: "Rajesh Kumar", message: "When will my shipment arrive?", time: "2 mins ago", unread: true },
  { customer: "Priya Sharma", message: "I need to cancel my booking", time: "15 mins ago", unread: true },
  { customer: "Amit Patel", message: "Thank you for the help!", time: "1 hour ago", unread: false },
];

const SupportDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout role="support">
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800">
          <img 
            src={supportHero} 
            alt="Support Dashboard" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Support Dashboard</h1>
                <p className="text-white/80">Manage tickets, assist customers, and resolve issues</p>
              </div>
              <Button variant="secondary" className="w-fit">
                <Phone className="w-4 h-4 mr-2" />
                Start Support Call
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="Open Tickets"
            value="24"
            change="-5 today"
            changeType="positive"
            icon={MessageSquare}
            iconColor="bg-purple-500/10 text-purple-500"
          />
          <StatsCard
            title="Avg Response Time"
            value="4.2 min"
            change="-12%"
            changeType="positive"
            icon={Clock}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            title="Resolved Today"
            value="38"
            change="+15%"
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-success/10 text-success"
          />
          <StatsCard
            title="Escalations"
            value="3"
            change="+1"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tickets Table */}
          <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">Active Tickets</h3>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-border">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-accent">{ticket.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ticket.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          ticket.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                          ticket.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                          ticket.status === 'resolved' ? 'bg-success/10 text-success' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{ticket.issue}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{ticket.customer}</span>
                        <span>•</span>
                        <span>{ticket.assignee}</span>
                        <span>•</span>
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Chat */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Live Chats</h3>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              <div className="space-y-3">
                {recentChats.map((chat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{chat.customer}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{chat.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                        {chat.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Chats
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex-col h-auto py-4">
                  <MessageSquare className="w-5 h-5 mb-2 text-purple-500" />
                  <span className="text-xs">New Ticket</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4">
                  <Phone className="w-5 h-5 mb-2 text-blue-500" />
                  <span className="text-xs">Call Customer</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4">
                  <Mail className="w-5 h-5 mb-2 text-amber-500" />
                  <span className="text-xs">Send Email</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4">
                  <RefreshCw className="w-5 h-5 mb-2 text-emerald-500" />
                  <span className="text-xs">Reassign</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportDashboard;
