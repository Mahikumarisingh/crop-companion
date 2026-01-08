import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { indiaLocationData, getClimateForDistrict } from "@/data/indiaLocations";
import { toast } from "sonner";
import SoilTypeHelper from "./SoilTypeHelper";

interface CropFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export interface FormData {
  soilType: string;
  climate: string;
  waterAvailability: string;
  season: string;
  state?: string;
  district?: string;
}

const CropForm = ({ onSubmit, isLoading }: CropFormProps) => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    soilType: "",
    climate: "",
    waterAvailability: "",
    season: "",
  });

  // Normalize string for better matching
  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Find closest matching location from our data based on reverse geocoded result
  const findMatchingLocation = (state: string, district: string, city?: string) => {
    const normalizedState = normalizeString(state);
    
    // Try to find state match
    const stateData = indiaLocationData.states.find(s => {
      const stateName = normalizeString(s.name);
      return stateName === normalizedState ||
             stateName.includes(normalizedState) ||
             normalizedState.includes(stateName);
    });
    
    if (stateData) {
      // Try to find district match - check both district and city names from API
      const searchTerms = [district, city].filter(Boolean).map(t => normalizeString(t!));
      
      const districtData = stateData.districts.find(d => {
        const districtName = normalizeString(d.name);
        return searchTerms.some(term => 
          districtName === term ||
          districtName.includes(term) ||
          term.includes(districtName)
        );
      });
      
      // If district found, return it; otherwise return first district of state
      return {
        state: stateData.name,
        district: districtData?.name || stateData.districts[0]?.name || ""
      };
    }
    
    return null;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('locationNotSupported'));
      return;
    }

    setIsLocating(true);
    toast.info("Getting your location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding API with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { 
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'CropWise AI App'
              }
            }
          );
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.address) {
            const state = data.address.state || "";
            const district = data.address.state_district || data.address.county || "";
            const city = data.address.city || data.address.town || data.address.village || "";
            
            console.log("Location API response:", { state, district, city, full: data.address });
            
            const match = findMatchingLocation(state, district, city);
            
            if (match) {
              setSelectedState(match.state);
              setTimeout(() => {
                setSelectedDistrict(match.district);
              }, 100);
              toast.success(`${t('locationDetected')}: ${match.district}, ${match.state}`);
            } else {
              toast.error(`${t('locationNotInList')}: ${state}`);
            }
          } else {
            toast.error(t('locationError'));
          }
        } catch (error: any) {
          console.error("Location fetch error:", error);
          if (error.name === 'AbortError') {
            toast.error("Location fetch timed out. Please try again.");
          } else {
            toast.error(`${t('locationError')}: ${error.message}`);
          }
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(t('locationPermissionDenied'));
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(t('locationUnavailable'));
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error(t('locationError'));
        }
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 60000 }
    );
  };

  // Get districts for selected state
  const districts = selectedState
    ? indiaLocationData.states.find(s => s.name === selectedState)?.districts || []
    : [];

  // Auto-set climate when district is selected
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      const climate = getClimateForDistrict(selectedState, selectedDistrict);
      if (climate) {
        setFormData(prev => ({ ...prev, climate, state: selectedState, district: selectedDistrict }));
      }
    }
  }, [selectedState, selectedDistrict]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setFormData(prev => ({ ...prev, climate: "", state, district: "" }));
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

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
          {/* Location Section */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{t('selectLocation')}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="gap-2"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {t('useMyLocation')}
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  {t('state')}
                </Label>
                <Select
                  value={selectedState}
                  onValueChange={handleStateChange}
                >
                  <SelectTrigger id="state" className="h-11">
                    <SelectValue placeholder={t('selectState')} />
                  </SelectTrigger>
                  <SelectContent>
                    {indiaLocationData.states.map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-medium">
                  {t('district')}
                </Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={handleDistrictChange}
                  disabled={!selectedState}
                >
                  <SelectTrigger id="district" className="h-11">
                    <SelectValue placeholder={t('selectDistrict')} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.name} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedDistrict && formData.climate && (
              <p className="text-sm text-muted-foreground">
                ✓ {t('climateDetected')}: <span className="text-primary font-medium">{t(formData.climate)}</span>
              </p>
            )}
          </div>

          {/* Soil Type with Helper */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Label htmlFor="soilType" className="text-base font-medium">
                {t('soilType')}
              </Label>
              <SoilTypeHelper 
                onSoilTypeDetected={(type) => setFormData({ ...formData, soilType: type })} 
              />
            </div>
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

          <div className="grid md:grid-cols-2 gap-6">
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