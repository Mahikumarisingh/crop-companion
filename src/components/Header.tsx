import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, LogOut, Menu, X, Home, Calendar, Landmark, LayoutDashboard, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const isHindi = language === "hi";

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation || detectedLocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'CropWise AI App' } }
          );
          const data = await res.json();
          if (data.address) {
            const area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || "";
            const city = data.address.city || data.address.state_district || "";
            const state = data.address.state || "";
            const pin = data.address.postcode || "";
            const shortLabel = area || city || state;
            const fullAddr = [area, city, state, pin ? `${pin}` : "", "India"].filter(Boolean).join(", ");
            setDetectedLocation(shortLabel);
            setFullAddress(fullAddr);
          }
        } catch { /* silently fail */ }
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [detectedLocation]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { to: "/", label: t('home'), icon: Home },
    { to: "/crop-calendar", label: t('cropCalendar'), icon: Calendar },
    { to: "/government-schemes", label: t('govSchemes'), icon: Landmark },
    { to: "/dashboard", label: t('myFarm'), icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hidden sm:inline">{t('appName')}</span>
        </Link>

        {/* Zomato/Swiggy style location */}
        <div className="relative">
          <button
            onClick={() => {
              if (!detectedLocation) detectLocation();
              else setShowAddressPopup(!showAddressPopup);
            }}
            className="flex items-center gap-1.5 ml-2 md:ml-4 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors max-w-[180px] md:max-w-[240px] group"
          >
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : detectedLocation ? (
              <span className="text-sm font-medium truncate text-foreground">{detectedLocation}</span>
            ) : (
              <span className="text-sm text-muted-foreground">{isHindi ? "स्थान पता करें" : "Detect location"}</span>
            )}
            <ChevronDown className={cn("w-3 h-3 text-muted-foreground shrink-0 transition-transform", showAddressPopup && "rotate-180")} />
          </button>

          {showAddressPopup && fullAddress && (
            <div className="absolute top-full left-0 mt-1 w-72 md:w-80 bg-card border border-border rounded-xl shadow-lg p-4 z-50 animate-fade-up">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{detectedLocation}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{fullAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hidden md:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button variant="default" size="sm">
                {t('login')}
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-2">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-muted-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
