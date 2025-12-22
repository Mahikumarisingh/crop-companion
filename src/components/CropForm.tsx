import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface CropFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export interface FormData {
  soilType: string;
  climate: string;
  waterAvailability: string;
  season: string;
}

const CropForm = ({ onSubmit, isLoading }: CropFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    soilType: "",
    climate: "",
    waterAvailability: "",
    season: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.soilType && formData.climate && formData.waterAvailability && formData.season) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.soilType && formData.climate && formData.waterAvailability && formData.season;

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl">Tell Us About Your Farm</CardTitle>
        <CardDescription className="text-base">
          Enter your farm conditions to get personalized AI crop recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType" className="text-base font-medium">
                Soil Type
              </Label>
              <Select
                value={formData.soilType}
                onValueChange={(value) => setFormData({ ...formData, soilType: value })}
              >
                <SelectTrigger id="soilType" className="h-12">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                  <SelectItem value="chalky">Chalky</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Climate */}
            <div className="space-y-2">
              <Label htmlFor="climate" className="text-base font-medium">
                Climate Zone
              </Label>
              <Select
                value={formData.climate}
                onValueChange={(value) => setFormData({ ...formData, climate: value })}
              >
                <SelectTrigger id="climate" className="h-12">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">Tropical</SelectItem>
                  <SelectItem value="subtropical">Subtropical</SelectItem>
                  <SelectItem value="temperate">Temperate</SelectItem>
                  <SelectItem value="arid">Arid / Desert</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="continental">Continental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Water Availability */}
            <div className="space-y-2">
              <Label htmlFor="water" className="text-base font-medium">
                Water Availability
              </Label>
              <Select
                value={formData.waterAvailability}
                onValueChange={(value) => setFormData({ ...formData, waterAvailability: value })}
              >
                <SelectTrigger id="water" className="h-12">
                  <SelectValue placeholder="Select water access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abundant">Abundant (Irrigation)</SelectItem>
                  <SelectItem value="moderate">Moderate (Seasonal Rain)</SelectItem>
                  <SelectItem value="limited">Limited (Dry Region)</SelectItem>
                  <SelectItem value="rainfed">Rain-fed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label htmlFor="season" className="text-base font-medium">
                Planting Season
              </Label>
              <Select
                value={formData.season}
                onValueChange={(value) => setFormData({ ...formData, season: value })}
              >
                <SelectTrigger id="season" className="h-12">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn / Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="monsoon">Monsoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Your Farm...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CropForm;
