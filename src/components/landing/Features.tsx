import { 
  Truck, 
  MapPin, 
  Package, 
  Calculator, 
  Users, 
  BarChart3, 
  Shield, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Smart Route Management",
    description: "Define multi-stop routes with origin, stops, and destination. Auto-calculate distances and map providers to routes."
  },
  {
    icon: Calculator,
    title: "Dynamic Pricing Engine",
    description: "Flexible pricing based on weight, dimensions, distance, truck type. Platform & affiliate markup controls."
  },
  {
    icon: Truck,
    title: "Fleet Management",
    description: "Complete fleet visibility with truck types, container allocation, capacity management, and supplier mapping."
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Tailored experiences for Admin, Support, Affiliates, Customers, and Providers with role-based permissions."
  },
  {
    icon: BarChart3,
    title: "AI-Enabled Dashboards",
    description: "Real-time analytics, cost vs profit insights, booking performance, and predictive recommendations."
  },
  {
    icon: Package,
    title: "End-to-End Tracking",
    description: "Live shipment tracking from booking to delivery with ETA updates and status notifications."
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "RBAC security, encrypted data, comprehensive audit logs, and 99.9% uptime guarantee."
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Self-serve booking with text/voice search, instant availability check, and real-time price calculation."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="text-gradient block">Modern Logistics</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed to digitize, optimize, and scale your transportation operations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  index 
}: { 
  icon: typeof Truck; 
  title: string; 
  description: string; 
  index: number;
}) => (
  <div 
    className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-glow transition-all duration-300 hover-lift"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

export default Features;
