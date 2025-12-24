import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import CropForm, { FormData } from "@/components/CropForm";
import RecommendationResults from "@/components/RecommendationResults";
import { CropRecommendation } from "@/components/CropCard";
import { generateRecommendations } from "@/lib/cropRecommendation";
import { Sprout, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const results = generateRecommendations(formData);
    setRecommendations(results);
    setIsLoading(false);
  };

  const handleReset = () => {
    setRecommendations(null);
    scrollToForm();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CropWise AI</span>
          </div>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  {t('login')}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onGetStarted={scrollToForm} />

      {/* Form Section */}
      <section ref={formRef} className="py-20 px-4 bg-muted/30" id="form">
        <div className="container mx-auto">
          <CropForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
      </section>

      {/* Results Section */}
      {recommendations && (
        <RecommendationResults recommendations={recommendations} onReset={handleReset} />
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">CropWise AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {t('footerText')}
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            © {new Date().getFullYear()} CropWise AI. {t('allRights')}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;