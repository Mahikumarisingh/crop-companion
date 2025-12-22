import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import CropForm, { FormData } from "@/components/CropForm";
import RecommendationResults from "@/components/RecommendationResults";
import TechnologiesSection from "@/components/TechnologiesSection";
import { CropRecommendation } from "@/components/CropCard";
import { generateRecommendations } from "@/lib/cropRecommendation";
import { Sprout } from "lucide-react";

const Index = () => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const results = generateRecommendations(formData);
    setRecommendations(results);
    setIsLoading(false);
  };

  const handleReset = () => {
    setRecommendations(null);
    scrollToForm();
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
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
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

      {/* Technologies Section */}
      <TechnologiesSection />

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
            Empowering farmers with AI-driven insights for sustainable agriculture.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            © {new Date().getFullYear()} CropWise AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
