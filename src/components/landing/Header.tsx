import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Truck, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, session, signOut } = useAuth();
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loadingTrucks, setLoadingTrucks] = useState(false);

  useEffect(() => {
    const fetchTrucks = async () => {
      if (!user || user.role !== 'Provider') return;
      const token = session?.token || localStorage.getItem('authToken');
      if (!token) return;
      setLoadingTrucks(true);
      try {
        const res = await fetch('http://localhost:8000/providers/trucks?page=1&limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn('Failed to fetch trucks', res.status);
          setTrucks([]);
        } else {
          const body = await res.json();
          // backend returns { data: rows, total }
          setTrucks(body.data || []);
        }
      } catch (err) {
        console.error('Error fetching trucks', err);
      } finally {
        setLoadingTrucks(false);
      }
    };
    fetchTrucks();
  }, [user, session]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Trans<span className="text-accent">Logic</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="Solutions" hasDropdown />
            <NavItem label="Features" />
            <NavItem label="Pricing" />
            <NavItem label="Resources" hasDropdown />
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="default" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{user.username || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3">
                    <div className="font-medium">{user.username || 'User'}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">Role: {user.role}</div>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === 'Provider' && (
                    <div className="p-2">
                      <div className="text-sm font-medium mb-2">Your Trucks</div>
                      {loadingTrucks ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                      ) : trucks.length ? (
                        trucks.slice(0,3).map((t:any) => (
                          <DropdownMenuItem key={t.id} className="flex flex-col">
                            <div className="font-medium">{t.truck_name || t.truck_number}</div>
                            <div className="text-xs text-muted-foreground">{t.truck_number} • {t.truck_type}</div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No trucks found</div>
                      )}
                      <div className="mt-2">
                        <DropdownMenuItem asChild>
                          <Link to="/provider" className="cursor-pointer">Manage Trucks</Link>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={user.role === 'Provider' ? '/provider' : '/customer'} className="cursor-pointer">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="default">
                    Sign In
                  </Button>
                </Link>
                <Link to="/book">
                  <Button variant="accent" size="default">
                    Book Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 animate-slide-up">
            <div className="flex flex-col gap-4">
              <MobileNavItem label="Solutions" />
              <MobileNavItem label="Features" />
              <MobileNavItem label="Pricing" />
              <MobileNavItem label="Resources" />
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/customer">
                      <Button variant="outline" className="w-full">My Dashboard</Button>
                    </Link>
                    <Button variant="ghost" className="w-full text-destructive" onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/book">
                      <Button variant="accent" className="w-full">Book Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavItem = ({ label, hasDropdown }: { label: string; hasDropdown?: boolean }) => (
  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium">
    {label}
    {hasDropdown && <ChevronDown className="w-4 h-4" />}
  </button>
);

const MobileNavItem = ({ label }: { label: string }) => (
  <button className="text-left py-2 text-foreground font-medium hover:text-accent transition-colors">
    {label}
  </button>
);

export default Header;
