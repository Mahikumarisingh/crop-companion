import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CropForm, { FormData } from "@/components/CropForm";
import RecommendationResults from "@/components/RecommendationResults";
import ImageUpload from "@/components/ImageUpload";
import FarmingTools from "@/components/FarmingTools";
import VoiceInput from "@/components/VoiceInput";
import { CropRecommendation } from "@/components/CropCard";
import { generateRecommendations } from "@/lib/cropRecommendation";
import { Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const Index = () => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const results = generateRecommendations(formData);
    setRecommendations(results);
    setIsLoading(false);
    // Persist a stable anchor so back/forward and shares land on results
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "#results");
    }
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    resultsRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (recommendations && resultsRef.current) {
      requestAnimationFrame(scrollToResults);
    }
  }, [recommendations]);

  // Re-scroll on hash changes (nav links, back/forward) while results exist
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#results" && resultsRef.current) {
        requestAnimationFrame(scrollToResults);
      } else if (window.location.hash === "#form") {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    // Handle initial load with #results in URL
    if (window.location.hash === "#results" && recommendations) {
      requestAnimationFrame(scrollToResults);
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [recommendations]);

  const handleReset = () => {
    setRecommendations(null);
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    scrollToForm();
  };


  const handleVoiceResult = (text: string) => {
    toast.info(`🎤 "${text}"`, { duration: 4000 });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Voice Input */}
      <VoiceInput onResult={handleVoiceResult} />

      {/* Hero Section */}
      <HeroSection onGetStarted={scrollToForm} />

      {/* Form Section */}
      <section ref={formRef} className="py-20 px-4 bg-muted/30" id="form">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <CropForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            <ImageUpload />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {recommendations && (
        <div id="results" ref={resultsRef} tabIndex={-1} className="scroll-mt-20 outline-none">
          <RecommendationResults recommendations={recommendations} onReset={handleReset} />
        </div>
      )}

      {/* Farming Tools Section */}
      <FarmingTools />

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{t('appName')}</span>
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