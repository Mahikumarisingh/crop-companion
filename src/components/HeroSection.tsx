import { Sprout, Leaf, Sun, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful farm field at golden hour" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 animate-float opacity-60">
        <Leaf className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed opacity-50">
        <Sprout className="w-10 h-10 text-primary" />
      </div>
      <div className="absolute bottom-40 left-1/4 animate-float opacity-40">
        <Sun className="w-8 h-8 text-accent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Sprout className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Agriculture</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up">
            Grow Smarter with{" "}
            <span className="text-gradient-primary">AI-Driven</span>{" "}
            Crop Recommendations
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delayed">
            Harness the power of artificial intelligence to optimize your farm's potential. 
            Get personalized crop suggestions based on your soil, climate, and resources.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delayed">
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Get Crop Recommendations
              <Sprout className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="xl">
              Learn How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto animate-fade-up-delayed">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Crop Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Farmers</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
