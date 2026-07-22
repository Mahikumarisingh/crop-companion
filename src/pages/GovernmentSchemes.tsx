import Header from "@/components/Header";
import VoiceInput from "@/components/VoiceInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Landmark, ExternalLink, IndianRupee, Shield, Tractor, Droplets, Wheat, Users, Search, Mic, MicOff, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { indiaLocationData } from "@/data/indiaLocations";

const iconMap: Record<string, typeof Landmark> = {
  IndianRupee, Shield, Tractor, Droplets, Wheat, Users, Landmark,
};

interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  benefits: string[];
  benefitsHi: string[];
  eligibility: string;
  eligibilityHi: string;
  amount: string;
  amountHi: string;
  link: string;
  icon: typeof Landmark;
  category: "subsidy" | "insurance" | "loan" | "support";
}

const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    nameHi: "पीएम-किसान सम्मान निधि",
    description: "Direct income support of ₹6,000 per year to farmer families in three equal installments.",
    descriptionHi: "किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
    benefits: [
      "₹2,000 every 4 months directly to bank account",
      "No middlemen - DBT transfer",
      "Covers all landholding farmer families",
    ],
    benefitsHi: [
      "हर 4 महीने ₹2,000 सीधे बैंक खाते में",
      "कोई बिचौलिया नहीं - DBT ट्रांसफर",
      "सभी भूमिधारक किसान परिवारों को कवर करता है",
    ],
    eligibility: "All landholding farmer families with cultivable land",
    eligibilityHi: "कृषि योग्य भूमि वाले सभी भूमिधारक किसान परिवार",
    amount: "₹6,000/year",
    amountHi: "₹6,000/वर्ष",
    link: "https://pmkisan.gov.in/",
    icon: IndianRupee,
    category: "support",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    nameHi: "पीएम फसल बीमा योजना",
    description: "Comprehensive crop insurance scheme providing coverage against crop loss due to natural calamities.",
    descriptionHi: "प्राकृतिक आपदाओं से फसल नुकसान के खिलाफ कवरेज प्रदान करने वाली व्यापक फसल बीमा योजना।",
    benefits: [
      "Low premium: 2% for Kharif, 1.5% for Rabi",
      "Coverage for pre-sowing to post-harvest losses",
      "Quick claim settlement via technology",
    ],
    benefitsHi: [
      "कम प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%",
      "बुवाई पूर्व से कटाई के बाद तक नुकसान के लिए कवरेज",
      "प्रौद्योगिकी के माध्यम से त्वरित दावा निपटान",
    ],
    eligibility: "All farmers including sharecroppers and tenant farmers",
    eligibilityHi: "बटाईदार और किरायेदार किसानों सहित सभी किसान",
    amount: "Sum Insured varies by crop",
    amountHi: "बीमित राशि फसल के अनुसार भिन्न",
    link: "https://pmfby.gov.in/",
    icon: Shield,
    category: "insurance",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    nameHi: "किसान क्रेडिट कार्ड",
    description: "Easy credit facility for farmers to meet their agricultural and other needs at low interest rates.",
    descriptionHi: "किसानों की कृषि और अन्य जरूरतों को कम ब्याज दरों पर पूरा करने के लिए आसान ऋण सुविधा।",
    benefits: [
      "Interest rate as low as 4% (with subsidy)",
      "Flexible repayment options",
      "Can be used for crop production, post-harvest, and consumption needs",
    ],
    benefitsHi: [
      "ब्याज दर 4% तक कम (सब्सिडी के साथ)",
      "लचीले पुनर्भुगतान विकल्प",
      "फसल उत्पादन, कटाई के बाद और उपभोग की जरूरतों के लिए उपयोग किया जा सकता है",
    ],
    eligibility: "Individual farmers, Joint liability groups, SHGs",
    eligibilityHi: "व्यक्तिगत किसान, संयुक्त देयता समूह, स्वयं सहायता समूह",
    amount: "Up to ₹3 lakh at subsidized rate",
    amountHi: "सब्सिडी दर पर ₹3 लाख तक",
    link: "https://www.nabard.org/",
    icon: Tractor,
    category: "loan",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchai Yojana",
    nameHi: "पीएम कृषि सिंचाई योजना",
    description: "Scheme to improve irrigation coverage and water use efficiency through 'Har Khet Ko Paani'.",
    descriptionHi: "'हर खेत को पानी' के माध्यम से सिंचाई कवरेज और जल उपयोग दक्षता में सुधार की योजना।",
    benefits: [
      "55-75% subsidy on micro-irrigation systems",
      "Support for water harvesting structures",
      "Drip and sprinkler irrigation support",
    ],
    benefitsHi: [
      "सूक्ष्म सिंचाई प्रणालियों पर 55-75% सब्सिडी",
      "जल संचयन संरचनाओं के लिए सहायता",
      "ड्रिप और स्प्रिंकलर सिंचाई सहायता",
    ],
    eligibility: "All categories of farmers with focus on small and marginal",
    eligibilityHi: "लघु और सीमांत किसानों पर फोकस के साथ सभी श्रेणियों के किसान",
    amount: "Varies by component",
    amountHi: "घटक के अनुसार भिन्न",
    link: "https://pmksy.gov.in/",
    icon: Droplets,
    category: "subsidy",
  },
  {
    id: "soil-health",
    name: "Soil Health Card Scheme",
    nameHi: "मृदा स्वास्थ्य कार्ड योजना",
    description: "Provides farmers with information on nutrient status of soil and recommendations for fertilizers.",
    descriptionHi: "किसानों को मिट्टी की पोषक तत्व स्थिति और उर्वरकों की सिफारिशों की जानकारी प्रदान करता है।",
    benefits: [
      "Free soil testing every 2 years",
      "Customized fertilizer recommendations",
      "Helps reduce input costs",
    ],
    benefitsHi: [
      "हर 2 साल में मुफ्त मिट्टी परीक्षण",
      "अनुकूलित उर्वरक सिफारिशें",
      "इनपुट लागत कम करने में मदद करता है",
    ],
    eligibility: "All farmers",
    eligibilityHi: "सभी किसान",
    amount: "Free service",
    amountHi: "मुफ्त सेवा",
    link: "https://soilhealth.dac.gov.in/",
    icon: Wheat,
    category: "support",
  },
  {
    id: "enam",
    name: "e-NAM (National Agriculture Market)",
    nameHi: "ई-नाम (राष्ट्रीय कृषि बाजार)",
    description: "Online trading platform for agricultural commodities connecting farmers to markets across India.",
    descriptionHi: "कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म जो किसानों को भारत भर के बाजारों से जोड़ता है।",
    benefits: [
      "Access to multiple markets from single point",
      "Better price discovery through transparent bidding",
      "Reduced transaction costs",
    ],
    benefitsHi: [
      "एक बिंदु से कई बाजारों तक पहुंच",
      "पारदर्शी बोली के माध्यम से बेहतर मूल्य खोज",
      "कम लेनदेन लागत",
    ],
    eligibility: "All farmers with Aadhaar-linked bank account",
    eligibilityHi: "आधार-लिंक्ड बैंक खाते वाले सभी किसान",
    amount: "Free registration",
    amountHi: "मुफ्त पंजीकरण",
    link: "https://enam.gov.in/",
    icon: Users,
    category: "support",
  },
];

const categoryColors = {
  subsidy: "bg-green-500/10 text-green-600 border-green-500/20",
  insurance: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  loan: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  support: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const categoryLabels = {
  subsidy: { en: "Subsidy", hi: "सब्सिडी" },
  insurance: { en: "Insurance", hi: "बीमा" },
  loan: { en: "Loan", hi: "ऋण" },
  support: { en: "Support", hi: "सहायता" },
};

const GovernmentSchemes = () => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [liveSchemes, setLiveSchemes] = useState<Scheme[]>(schemes);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const voiceRef = useRef<any>(null);

  const langMap: Record<string, string> = {
    en: "en-IN", hi: "hi-IN", pa: "pa-IN", mr: "mr-IN",
    ta: "ta-IN", te: "te-IN", bn: "bn-IN", gu: "gu-IN",
  };

  const loadSchemes = useCallback(async () => {
    const { data, error } = await supabase
      .from("government_schemes")
      .select("data, updated_at")
      .eq("id", "latest")
      .maybeSingle();
    if (!error && data?.data) {
      const raw = (data.data as any).schemes ?? [];
      const mapped: Scheme[] = raw.map((s: any) => ({
        ...s,
        icon: iconMap[s.iconName] ?? Landmark,
      }));
      if (mapped.length) {
        setLiveSchemes(mapped);
        setLastUpdated(data.updated_at as string);
      }
    }
  }, []);

  useEffect(() => { loadSchemes(); }, [loadSchemes]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke("refresh-government-schemes");
      if (error) throw error;
      await loadSchemes();
      toast.success(isHindi ? "योजनाएं अपडेट हो गईं" : "Schemes updated");
    } catch (e) {
      toast.error(isHindi ? "अपडेट असफल" : "Update failed");
    } finally {
      setIsRefreshing(false);
    }
  }, [loadSchemes, isHindi]);


  const handleInlineVoice = useCallback(() => {
    if (isVoiceListening) {
      voiceRef.current?.stop();
      setIsVoiceListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error(isHindi ? "आपका ब्राउज़र वॉइस सपोर्ट नहीं करता" : "Browser doesn't support voice input");
      return;
    }
    const recognition = new SR();
    recognition.lang = langMap[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript || "";
      if (text) {
        setSearchQuery(text);
        toast.info(`🎤 "${text}"`);
      }
    };
    recognition.onerror = () => setIsVoiceListening(false);
    recognition.onend = () => setIsVoiceListening(false);
    voiceRef.current = recognition;
    recognition.start();
    setIsVoiceListening(true);
    toast.info(isHindi ? "🎤 बोलिए..." : "🎤 Listening...");
  }, [isVoiceListening, isHindi, language]);

  const filteredSchemes = liveSchemes.filter((scheme) => {
    if (activeCategory && scheme.category !== activeCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (isHindi ? scheme.nameHi : scheme.name).toLowerCase();
    const desc = (isHindi ? scheme.descriptionHi : scheme.description).toLowerCase();
    const cat = (isHindi ? categoryLabels[scheme.category].hi : categoryLabels[scheme.category].en).toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <VoiceInput onResult={(text) => { setSearchQuery(text); toast.info(`🎤 "${text}"`, { duration: 4000 }); }} />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Landmark className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {isHindi ? "सरकारी योजनाएं" : "Government Schemes"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isHindi ? "किसानों के लिए सरकारी योजनाएं" : "Government Schemes for Farmers"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isHindi 
                ? "पीएम किसान, फसल बीमा, किसान क्रेडिट कार्ड और अन्य सरकारी योजनाओं की पूरी जानकारी"
                : "Complete information about PM Kisan, Crop Insurance, Kisan Credit Card and other government schemes"
              }
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              {lastUpdated && (
                <span>
                  {isHindi ? "अंतिम अपडेट: " : "Last updated: "}
                  {new Date(lastUpdated).toLocaleString(isHindi ? "hi-IN" : "en-IN")}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-7 gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                {isHindi ? "अभी अपडेट करें" : "Refresh now"}
              </Button>
            </div>
          </div>

          {/* Search Bar with Voice */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? "योजना खोजें..." : "Search schemes..."}
                  className="pl-10"
                />
              </div>
              <button
                onClick={handleInlineVoice}
                className={`p-2.5 rounded-lg border transition-all ${
                  isVoiceListening
                    ? "bg-destructive text-destructive-foreground animate-pulse border-destructive"
                    : "bg-card text-muted-foreground hover:text-primary hover:border-primary border-border"
                }`}
                aria-label="Voice search"
              >
                {isVoiceListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge
              variant="outline"
              onClick={() => setActiveCategory(null)}
              className={`cursor-pointer transition-all ${!activeCategory ? "bg-primary text-primary-foreground border-primary" : "hover:opacity-80"}`}
            >
              {isHindi ? "सभी" : "All"}
            </Badge>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Badge
                key={key}
                variant="outline"
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className={`cursor-pointer transition-all ${
                  activeCategory === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : `${categoryColors[key as keyof typeof categoryColors]} hover:opacity-80`
                }`}
              >
                {isHindi ? label.hi : label.en}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => {
              const Icon = scheme.icon;
              return (
                <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryColors[scheme.category]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg leading-tight">
                            {isHindi ? scheme.nameHi : scheme.name}
                          </CardTitle>
                          <Badge variant="outline" className={`mt-1 text-xs ${categoryColors[scheme.category]}`}>
                            {isHindi ? categoryLabels[scheme.category].hi : categoryLabels[scheme.category].en}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-3">
                      {isHindi ? scheme.descriptionHi : scheme.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {isHindi ? "लाभ:" : "Benefits:"}
                        </h4>
                        <ul className="space-y-1">
                          {(isHindi ? scheme.benefitsHi : scheme.benefits).map((benefit, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{isHindi ? "पात्रता:" : "Eligibility:"}</span>
                          <p className="font-medium">{isHindi ? scheme.eligibilityHi : scheme.eligibility}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{isHindi ? "राशि:" : "Amount:"}</span>
                          <p className="font-medium text-primary">{isHindi ? scheme.amountHi : scheme.amount}</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                          {isHindi ? "आधिकारिक वेबसाइट पर जाएं" : "Visit Official Website"}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Helpline */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">
                  {isHindi ? "किसान कॉल सेंटर" : "Kisan Call Center"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isHindi 
                    ? "किसी भी योजना या कृषि संबंधी प्रश्न के लिए कॉल करें"
                    : "Call for any scheme or agriculture related queries"
                  }
                </p>
                <div className="text-3xl font-bold text-primary">1800-180-1551</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {isHindi ? "टोल-फ्री, 24x7 उपलब्ध" : "Toll-free, Available 24x7"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default GovernmentSchemes;
