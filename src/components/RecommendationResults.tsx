import { Button } from "@/components/ui/button";
import CropCard, { CropRecommendation } from "@/components/CropCard";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RecommendationResultsProps {
  recommendations: CropRecommendation[];
  onReset: () => void;
}

const RecommendationResults = ({ recommendations, onReset }: RecommendationResultsProps) => {
  const handleDownloadReport = () => {
    const reportContent = `
CropWise AI - Crop Recommendation Report
Generated: ${new Date().toLocaleDateString()}
========================================

TOP RECOMMENDED CROPS
---------------------

${recommendations.map((crop, index) => `
${index + 1}. ${crop.name} (${crop.scientificName})
   Match Score: ${crop.matchScore}%
   Growth Period: ${crop.growthPeriod}
   Water Needs: ${crop.waterNeeds}
   Sunlight: ${crop.sunlight}
   Yield Potential: ${crop.yieldPotential}
   
   Description: ${crop.description}
   
   Tips: ${crop.tips.join(', ')}
`).join('\n')}

========================================
Thank you for using CropWise AI!
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cropwise-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your crop recommendation report has been saved.",
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient-primary">Recommended Crops</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Based on your farm conditions, our AI recommends these crops for optimal growth and yield.
          </p>
        </div>

        {/* Results Grid */}
        <div className="space-y-6 mb-12">
          {recommendations.map((crop, index) => (
            <CropCard key={crop.name} crop={crop} rank={index} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
          <Button variant="outline" size="lg" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Different Conditions
          </Button>
          <Button variant="hero" size="lg" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationResults;
