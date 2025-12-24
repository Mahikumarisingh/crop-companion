import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        <CardTitle className="text-2xl md:text-3xl">{t('formTitle')}</CardTitle>
        <CardDescription className="text-base">
          {t('formSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType" className="text-base font-medium">
                {t('soilType')}
              </Label>
              <Select
                value={formData.soilType}
                onValueChange={(value) => setFormData({ ...formData, soilType: value })}
              >
                <SelectTrigger id="soilType" className="h-12">
                  <SelectValue placeholder={t('selectSoilType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">{t('clay')}</SelectItem>
                  <SelectItem value="sandy">{t('sandy')}</SelectItem>
                  <SelectItem value="loamy">{t('loamy')}</SelectItem>
                  <SelectItem value="silt">{t('silt')}</SelectItem>
                  <SelectItem value="peaty">{t('peat')}</SelectItem>
                  <SelectItem value="chalky">{t('chalky')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Climate */}
            <div className="space-y-2">
              <Label htmlFor="climate" className="text-base font-medium">
                {t('climate')}
              </Label>
              <Select
                value={formData.climate}
                onValueChange={(value) => setFormData({ ...formData, climate: value })}
              >
                <SelectTrigger id="climate" className="h-12">
                  <SelectValue placeholder={t('selectClimate')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">{t('tropical')}</SelectItem>
                  <SelectItem value="subtropical">{t('subtropical')}</SelectItem>
                  <SelectItem value="temperate">{t('temperate')}</SelectItem>
                  <SelectItem value="arid">{t('arid')}</SelectItem>
                  <SelectItem value="semiarid">{t('semiarid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Water Availability */}
            <div className="space-y-2">
              <Label htmlFor="water" className="text-base font-medium">
                {t('waterAvailability')}
              </Label>
              <Select
                value={formData.waterAvailability}
                onValueChange={(value) => setFormData({ ...formData, waterAvailability: value })}
              >
                <SelectTrigger id="water" className="h-12">
                  <SelectValue placeholder={t('selectWaterAvailability')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abundant">{t('abundant')}</SelectItem>
                  <SelectItem value="moderate">{t('moderate')}</SelectItem>
                  <SelectItem value="limited">{t('limited')}</SelectItem>
                  <SelectItem value="rainfed">{t('rainfed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label htmlFor="season" className="text-base font-medium">
                {t('season')}
              </Label>
              <Select
                value={formData.season}
                onValueChange={(value) => setFormData({ ...formData, season: value })}
              >
                <SelectTrigger id="season" className="h-12">
                  <SelectValue placeholder={t('selectSeason')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kharif">{t('kharif')}</SelectItem>
                  <SelectItem value="rabi">{t('rabi')}</SelectItem>
                  <SelectItem value="zaid">{t('zaid')}</SelectItem>
                  <SelectItem value="yearround">{t('yearround')}</SelectItem>
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
                {t('analyzing')}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t('getRecommendations')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CropForm;