import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Upload, X, Loader2, Leaf, Droplets, Sun, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageAnalysis {
  imageType?: string;
  soilAnalysis?: {
    type: string;
    condition: string;
    moisture: string;
    healthScore: number;
  };
  weatherAnalysis?: {
    climate: string;
    conditions: string;
    suitability: string;
  };
  cropRecommendations?: Array<{
    name: string;
    matchScore: number;
    reason: string;
    tips: string[];
    waterNeeds: string;
    growthPeriod: string;
  }>;
  overallSummary?: string;
  rawAnalysis?: string;
}

interface ImageUploadProps {
  onAnalysisComplete?: (analysis: ImageAnalysis) => void;
}

const ImageUpload = ({ onAnalysisComplete }: ImageUploadProps) => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large. Max 10MB allowed.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: selectedImage, language },
      });

      if (error) throw error;

      if (data.analysis) {
        setAnalysis(data.analysis);
        onAnalysisComplete?.(data.analysis);
        toast.success(t("analysisComplete") || "Analysis complete!");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return "bg-green-500/20 text-green-600";
    if (score >= 70) return "bg-yellow-500/20 text-yellow-600";
    return "bg-orange-500/20 text-orange-600";
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          {t("orUploadImage")}
        </CardTitle>
        <CardDescription>{t("uploadImageDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-primary/30 hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            <p className={isDragging ? "text-primary font-medium" : "text-muted-foreground"}>
              {isDragging ? (t("dropHere") || "Drop image here") : t("uploadPhoto")}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover rounded-xl"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {!analysis && (
              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("analyzingImage")}
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4 mr-2" />
                    {t("analyzeImage")}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Summary */}
            {analysis.overallSummary && (
              <div className="p-4 bg-primary/10 rounded-xl">
                <p className="text-sm">{analysis.overallSummary}</p>
              </div>
            )}

            {/* Soil Analysis */}
            {analysis.soilAnalysis && (
              <div className="p-4 bg-muted rounded-xl space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  {t("soilAnalysisTitle") || "Soil Analysis"}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t("soilType")}:</span>{" "}
                    <span className="font-medium">{analysis.soilAnalysis.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("moisture") || "Moisture"}:</span>{" "}
                    <span className="font-medium">{analysis.soilAnalysis.moisture}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.soilAnalysis.condition}</p>
              </div>
            )}

            {/* Weather Analysis */}
            {analysis.weatherAnalysis && (
              <div className="p-4 bg-muted rounded-xl space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  {t("weatherAnalysisTitle") || "Weather Analysis"}
                </h4>
                <div className="text-sm">
                  <span className="text-muted-foreground">{t("climate")}:</span>{" "}
                  <span className="font-medium">{analysis.weatherAnalysis.climate}</span>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.weatherAnalysis.conditions}</p>
              </div>
            )}

            {/* Crop Recommendations */}
            {analysis.cropRecommendations && analysis.cropRecommendations.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">{t("recommendedCrops")}</h4>
                {analysis.cropRecommendations.map((crop, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-lg">{crop.name}</h5>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(crop.matchScore)}`}>
                          {crop.matchScore}% {t("match")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{crop.reason}</p>
                      
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span>{crop.waterNeeds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{crop.growthPeriod}</span>
                        </div>
                      </div>

                      {crop.tips && crop.tips.length > 0 && (
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{t("growingTips")}:</p>
                          <ul className="text-xs space-y-1">
                            {crop.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-1">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Raw Analysis Fallback */}
            {analysis.rawAnalysis && !analysis.cropRecommendations && (
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm whitespace-pre-wrap">{analysis.rawAnalysis}</p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleRemoveImage}
            >
              {t("tryDifferent")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
