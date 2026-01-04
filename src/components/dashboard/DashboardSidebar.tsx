import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Package, 
  Calculator, 
  Users, 
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Headphones,
  DollarSign,
  Link2,
  Clock,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DashboardSidebarProps {
  role?: "admin" | "support" | "affiliate" | "customer" | "provider";
}

const getMenuItems = (role: string) => {
  switch (role) {
    case "support":
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/support" },
        { icon: MessageSquare, label: "Tickets", path: "/support/tickets" },
        { icon: Headphones, label: "Live Chat", path: "/support/chat" },
        { icon: Package, label: "Bookings", path: "/support/bookings" },
        { icon: Users, label: "Customers", path: "/support/customers" },
      ];
    case "affiliate":
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/affiliate" },
        { icon: DollarSign, label: "Commissions", path: "/affiliate/commissions" },
        { icon: Link2, label: "Referrals", path: "/affiliate/referrals" },
        { icon: Package, label: "Bookings", path: "/affiliate/bookings" },
        { icon: BarChart3, label: "Analytics", path: "/affiliate/analytics" },
      ];
    case "customer":
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/customer" },
        { icon: Package, label: "My Bookings", path: "/customer/bookings" },
        { icon: MapPin, label: "Track Shipment", path: "/customer/tracking" },
        { icon: Clock, label: "History", path: "/customer/history" },
        { icon: Wallet, label: "Payments", path: "/customer/payments" },
      ];
    case "provider":
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/provider" },
        { icon: Truck, label: "My Fleet", path: "/provider/fleet" },
        { icon: Package, label: "Bookings", path: "/provider/bookings" },
        { icon: MapPin, label: "Routes", path: "/provider/routes" },
        { icon: DollarSign, label: "Earnings", path: "/provider/earnings" },
      ];
    case "admin":
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Package, label: "Bookings", path: "/admin/bookings" },
        { icon: Truck, label: "Fleet", path: "/admin/fleet" },
        { icon: MapPin, label: "Routes", path: "/admin/routes" },
        { icon: Calculator, label: "Pricing", path: "/admin/pricing" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      ];
    default:
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Package, label: "Bookings", path: "/dashboard/bookings" },
        { icon: Truck, label: "Fleet", path: "/dashboard/fleet" },
        { icon: MapPin, label: "Routes", path: "/dashboard/routes" },
        { icon: Calculator, label: "Pricing", path: "/dashboard/pricing" },
        { icon: Users, label: "Users", path: "/dashboard/users" },
        { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
      ];
  }
};

const DashboardSidebar = ({ role = "admin" }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const menuItems = getMenuItems(role);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center shadow-medium"
      >
        <Menu className="w-5 h-5 text-sidebar-foreground" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-sidebar-accent/50 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-sidebar-foreground" />
        </button>

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="text-lg font-bold text-sidebar-foreground">
                Trans<span className="text-sidebar-primary">Logic</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {(!collapsed || mobileOpen) && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link
            to="/dashboard/settings"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            {(!collapsed || mobileOpen) && <span className="font-medium">Settings</span>}
          </Link>
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {(!collapsed || mobileOpen) && <span className="font-medium">Logout</span>}
          </Link>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground items-center justify-center shadow-medium hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
