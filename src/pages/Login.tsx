import { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  { id: "admin", label: "Admin", description: "Full platform access" },
  { id: "support", label: "Support", description: "Customer service & bookings" },
  { id: "affiliate", label: "Affiliate", description: "Reseller portal" },
  { id: "customer", label: "Customer", description: "Book & track shipments" },
  { id: "provider", label: "Provider", description: "Fleet management" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow">
              <Truck className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Trans<span className="text-accent">Logic</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to access your account</p>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Select your role</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-2 sm:p-3 rounded-lg border text-left transition-all ${
                    selectedRole === role.id
                      ? "border-accent bg-accent/5 shadow-glow"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium text-foreground">{role.label}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
            </div>

            <Link to="/dashboard">
              <Button variant="accent" size="lg" className="w-full">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-accent hover:underline font-medium">Contact admin</a>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8 animate-float">
            <Truck className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            AI-Powered Logistics
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Transform your transportation operations with our unified digital platform for route-based logistics, dynamic pricing, and real-time tracking.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-primary-foreground/10">
            <div>
              <p className="text-2xl font-bold text-accent">99.9%</p>
              <p className="text-sm text-primary-foreground/60">Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">500+</p>
              <p className="text-sm text-primary-foreground/60">Fleet Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">10K+</p>
              <p className="text-sm text-primary-foreground/60">Shipments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
