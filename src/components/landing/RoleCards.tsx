import { Link } from "react-router-dom";
import { 
  Shield, 
  Headphones, 
  Users2, 
  UserCircle, 
  Truck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: Shield,
    title: "Admin",
    description: "Platform control, pricing governance, user management, and complete system visibility.",
    features: ["User & Access Management", "Fleet Configuration", "Pricing Controls", "Booking Governance"],
    color: "from-blue-500 to-blue-600",
    link: "/admin"
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Manual booking assistance, issue resolution, and customer service operations.",
    features: ["Manual Bookings", "Route Change Handling", "Provider Reassignment", "Escalation Management"],
    color: "from-purple-500 to-purple-600",
    link: "/support"
  },
  {
    icon: Users2,
    title: "Affiliate",
    description: "Resell logistics services with custom pricing and earn commissions on bookings.",
    features: ["Custom Pricing", "Commission Tracking", "Booking Dashboard", "Revenue Analytics"],
    color: "from-amber-500 to-orange-500",
    link: "/affiliate"
  },
  {
    icon: UserCircle,
    title: "Customer",
    description: "Self-serve logistics booking with tracking, history, and seamless payment.",
    features: ["Route Search", "Instant Booking", "Live Tracking", "Booking History"],
    color: "from-teal-500 to-emerald-500",
    link: "/customer"
  },
  {
    icon: Truck,
    title: "Provider",
    description: "Fleet supply, booking execution, and performance monitoring for fleet owners.",
    features: ["Fleet Onboarding", "Booking Management", "Route Pricing", "Performance Dashboard"],
    color: "from-rose-500 to-pink-500",
    link: "/provider"
  }
];

const RoleCards = () => {
  return (
    <section className="py-24 bg-muted/30" id="roles">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            User Roles
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tailored for
            <span className="text-gradient block">Every Stakeholder</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Role-based access ensures each user gets the tools and visibility they need.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RoleCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  link,
  index 
}: { 
  icon: typeof Shield; 
  title: string; 
  description: string; 
  features: string[];
  color: string;
  link: string;
  index: number;
}) => (
  <div 
    className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-medium transition-all duration-300 hover-lift flex flex-col"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-medium`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    
    <h3 className="text-xl font-semibold text-foreground mb-2">
      {title}
    </h3>
    
    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
      {description}
    </p>
    
    <ul className="space-y-2 mb-6 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {feature}
        </li>
      ))}
    </ul>
    
    <Link to={link}>
      <Button variant="outline" className="w-full group-hover:border-accent group-hover:text-accent transition-colors">
        Access Portal
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  </div>
);

export default RoleCards;
