import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Sun, Calendar, TrendingUp, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CropRecommendation {
  name: string;
  scientificName: string;
  matchScore: number;
  waterNeeds: "Low" | "Medium" | "High";
  sunlight: "Full Sun" | "Partial Shade" | "Shade Tolerant";
  growthPeriod: string;
  yieldPotential: "Low" | "Medium" | "High";
  description: string;
  tips: string[];
}

interface CropCardProps {
  crop: CropRecommendation;
  rank: number;
}

const cropNameKeys: Record<string, string> = {
  "Rice": "rice",
  "Wheat": "wheat",
  "Corn (Maize)": "corn",
  "Soybean": "soybean",
  "Cotton": "cotton",
  "Millet": "millet",
  "Potatoes": "potatoes",
  "Tomatoes": "tomatoes",
  "Sorghum": "sorghum",
  "Sugarcane": "sugarcane",
};

const CropCard = ({ crop, rank }: CropCardProps) => {
  const { t } = useLanguage();
  
  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-primary text-primary-foreground";
    if (score >= 75) return "bg-accent text-accent-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  const getWaterIcon = (level: string) => {
    const colors = {
      Low: "text-amber-500",
      Medium: "text-blue-400",
      High: "text-blue-600",
    };
    return colors[level as keyof typeof colors] || "text-muted-foreground";
  };

  const getCropName = (name: string) => {
    const key = cropNameKeys[name];
    return key ? t(key) : name;
  };

  return (
    <Card variant="recommendation" className="animate-scale-in" style={{ animationDelay: `${rank * 0.1}s` }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{getCropName(crop.name)}</CardTitle>
              <p className="text-sm text-muted-foreground italic">{crop.scientificName}</p>
            </div>
          </div>
          <Badge className={getMatchColor(crop.matchScore)}>
            {crop.matchScore}% {t('match')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{crop.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className={`w-4 h-4 ${getWaterIcon(crop.waterNeeds)}`} />
            <div>
              <p className="text-xs text-muted-foreground">{t('water')}</p>
              <p className="text-sm font-medium">{crop.waterNeeds}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t('sunlight')}</p>
              <p className="text-sm font-medium">{crop.sunlight}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('growth')}</p>
              <p className="text-sm font-medium">{crop.growthPeriod}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t('yield')}</p>
              <p className="text-sm font-medium">{crop.yieldPotential}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">{t('growingTips')}:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {crop.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCard;
