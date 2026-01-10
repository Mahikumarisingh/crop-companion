import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bug, Leaf, Thermometer, CloudSun, AlertTriangle, CheckCircle, Info, Search, IndianRupee, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PesticideInfo {
  name: string;
  target: string;
  dosage: string;
  timing: string;
  safety: string;
}

interface FertilizerInfo {
  name: string;
  nutrients: string;
  application: string;
  timing: string;
}

interface DiseaseInfo {
  name: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

interface WeatherAlert {
  type: "warning" | "info" | "success";
  title: string;
  description: string;
}

interface MandiPrice {
  market: string;
  price: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: string;
}

const FarmingTools = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [searchQuery, setSearchQuery] = useState("");

  const crops = [
    { id: "rice", name: language === 'hi' ? "चावल" : "Rice" },
    { id: "wheat", name: language === 'hi' ? "गेहूं" : "Wheat" },
    { id: "cotton", name: language === 'hi' ? "कपास" : "Cotton" },
    { id: "sugarcane", name: language === 'hi' ? "गन्ना" : "Sugarcane" },
    { id: "corn", name: language === 'hi' ? "मक्का" : "Corn" },
    { id: "bajra", name: language === 'hi' ? "बाजरा" : "Pearl Millet" },
    { id: "jowar", name: language === 'hi' ? "ज्वार" : "Sorghum" },
    { id: "potato", name: language === 'hi' ? "आलू" : "Potato" },
    { id: "tomato", name: language === 'hi' ? "टमाटर" : "Tomato" },
    { id: "onion", name: language === 'hi' ? "प्याज" : "Onion" },
    { id: "soybean", name: language === 'hi' ? "सोयाबीन" : "Soybean" },
    { id: "mustard", name: language === 'hi' ? "सरसों" : "Mustard" },
    { id: "groundnut", name: language === 'hi' ? "मूंगफली" : "Groundnut" },
    { id: "chilli", name: language === 'hi' ? "मिर्च" : "Chilli" },
    { id: "moong", name: language === 'hi' ? "मूंग" : "Green Gram" },
    { id: "urad", name: language === 'hi' ? "उड़द" : "Black Gram" },
    { id: "chana", name: language === 'hi' ? "चना" : "Chickpea" },
    { id: "mango", name: language === 'hi' ? "आम" : "Mango" },
    { id: "banana", name: language === 'hi' ? "केला" : "Banana" },
    { id: "guava", name: language === 'hi' ? "अमरूद" : "Guava" },
    { id: "sweetpotato", name: language === 'hi' ? "शकरकंद" : "Sweet Potato" },
    { id: "apple", name: language === 'hi' ? "सेब" : "Apple" },
    { id: "orange", name: language === 'hi' ? "संतरा" : "Orange" },
    { id: "papaya", name: language === 'hi' ? "पपीता" : "Papaya" },
    { id: "grapes", name: language === 'hi' ? "अंगूर" : "Grapes" },
    { id: "brinjal", name: language === 'hi' ? "बैंगन" : "Brinjal" },
    { id: "cabbage", name: language === 'hi' ? "पत्ता गोभी" : "Cabbage" },
    { id: "cauliflower", name: language === 'hi' ? "फूल गोभी" : "Cauliflower" },
    { id: "okra", name: language === 'hi' ? "भिंडी" : "Okra" },
    { id: "garlic", name: language === 'hi' ? "लहसुन" : "Garlic" },
    { id: "ginger", name: language === 'hi' ? "अदरक" : "Ginger" },
    { id: "turmeric", name: language === 'hi' ? "हल्दी" : "Turmeric" },
    { id: "watermelon", name: language === 'hi' ? "तरबूज" : "Watermelon" },
    { id: "cucumber", name: language === 'hi' ? "खीरा" : "Cucumber" },
    { id: "pumpkin", name: language === 'hi' ? "कद्दू" : "Pumpkin" },
    { id: "carrot", name: language === 'hi' ? "गाजर" : "Carrot" },
    { id: "peas", name: language === 'hi' ? "मटर" : "Peas" },
  ];

  const pesticides: Record<string, PesticideInfo[]> = {
    rice: [
      {
        name: language === 'hi' ? "कार्बेंडाजिम" : "Carbendazim",
        target: language === 'hi' ? "ब्लास्ट रोग, शीथ ब्लाइट" : "Blast disease, Sheath blight",
        dosage: language === 'hi' ? "1 ग्राम/लीटर पानी" : "1 gm/litre water",
        timing: language === 'hi' ? "रोग के लक्षण दिखने पर" : "When symptoms appear",
        safety: language === 'hi' ? "छिड़काव के 15 दिन बाद कटाई करें" : "Harvest 15 days after spraying"
      },
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "भूरा फुदका, हरा फुदका" : "Brown planthopper, Green leafhopper",
        dosage: language === 'hi' ? "0.5 मिली/लीटर पानी" : "0.5 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "सुबह या शाम छिड़काव करें" : "Spray in morning or evening"
      }
    ],
    wheat: [
      {
        name: language === 'hi' ? "प्रोपिकोनाजोल" : "Propiconazole",
        target: language === 'hi' ? "रस्ट, पाउडरी मिल्ड्यू" : "Rust, Powdery mildew",
        dosage: language === 'hi' ? "1 मिली/लीटर पानी" : "1 ml/litre water",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering",
        safety: language === 'hi' ? "21 दिन का अंतराल रखें" : "Keep 21 days interval"
      }
    ],
    cotton: [
      {
        name: language === 'hi' ? "इमामेक्टिन बेंजोएट" : "Emamectin Benzoate",
        target: language === 'hi' ? "बॉलवर्म, स्पोडोप्टेरा" : "Bollworm, Spodoptera",
        dosage: language === 'hi' ? "0.4 ग्राम/लीटर पानी" : "0.4 gm/litre water",
        timing: language === 'hi' ? "कीट अंडे देने के बाद" : "After pest egg laying",
        safety: language === 'hi' ? "7-10 दिन का अंतराल" : "7-10 days interval"
      }
    ],
    sugarcane: [
      {
        name: language === 'hi' ? "क्लोरपायरीफॉस" : "Chlorpyrifos",
        target: language === 'hi' ? "तना छेदक, दीमक" : "Stem borer, Termite",
        dosage: language === 'hi' ? "2.5 मिली/लीटर पानी" : "2.5 ml/litre water",
        timing: language === 'hi' ? "रोपाई के 30-45 दिन बाद" : "30-45 days after planting",
        safety: language === 'hi' ? "मिट्टी में मिलाएं" : "Mix in soil"
      }
    ],
    corn: [
      {
        name: language === 'hi' ? "स्पिनोसैड" : "Spinosad",
        target: language === 'hi' ? "फॉल आर्मीवर्म" : "Fall armyworm",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "अंडे से लार्वा निकलने पर" : "When larvae emerge from eggs",
        safety: language === 'hi' ? "जैविक खेती में भी उपयोग" : "Can use in organic farming"
      }
    ],
    bajra: [
      {
        name: language === 'hi' ? "क्विनालफॉस" : "Quinalphos",
        target: language === 'hi' ? "तना छेदक, शूट फ्लाई" : "Stem borer, Shoot fly",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "बुवाई के 20-25 दिन बाद" : "20-25 days after sowing",
        safety: language === 'hi' ? "सुबह छिड़काव करें" : "Spray in morning"
      },
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "डाउनी मिल्ड्यू, अर्गट" : "Downy mildew, Ergot",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "रोग दिखने पर" : "When disease appears",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    jowar: [
      {
        name: language === 'hi' ? "कार्बेरिल" : "Carbaryl",
        target: language === 'hi' ? "शूट फ्लाई, स्टेम बोरर" : "Shoot fly, Stem borer",
        dosage: language === 'hi' ? "2 ग्राम/लीटर पानी" : "2 gm/litre water",
        timing: language === 'hi' ? "बुवाई के 15-20 दिन बाद" : "15-20 days after sowing",
        safety: language === 'hi' ? "21 दिन का अंतराल" : "21 days interval"
      }
    ],
    potato: [
      {
        name: language === 'hi' ? "मेटालैक्सिल + मैंकोजेब" : "Metalaxyl + Mancozeb",
        target: language === 'hi' ? "लेट ब्लाइट, अर्ली ब्लाइट" : "Late blight, Early blight",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "रोग दिखने से पहले" : "Before disease appears",
        safety: language === 'hi' ? "7-10 दिन का अंतराल" : "7-10 days interval"
      }
    ],
    tomato: [
      {
        name: language === 'hi' ? "अबामेक्टिन" : "Abamectin",
        target: language === 'hi' ? "लीफ माइनर, व्हाइटफ्लाई" : "Leaf miner, Whitefly",
        dosage: language === 'hi' ? "0.5 मिली/लीटर पानी" : "0.5 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "5 दिन का अंतराल" : "5 days interval"
      }
    ],
    onion: [
      {
        name: language === 'hi' ? "थायोमेथोक्सम" : "Thiamethoxam",
        target: language === 'hi' ? "थ्रिप्स, एफिड" : "Thrips, Aphid",
        dosage: language === 'hi' ? "0.25 ग्राम/लीटर पानी" : "0.25 gm/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    soybean: [
      {
        name: language === 'hi' ? "लैम्ब्डा साइहैलोथ्रिन" : "Lambda Cyhalothrin",
        target: language === 'hi' ? "स्टेम फ्लाई, गर्डल बीटल" : "Stem fly, Girdle beetle",
        dosage: language === 'hi' ? "1 मिली/लीटर पानी" : "1 ml/litre water",
        timing: language === 'hi' ? "फूल आने के समय" : "During flowering",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    mustard: [
      {
        name: language === 'hi' ? "डाइमेथोएट" : "Dimethoate",
        target: language === 'hi' ? "एफिड, पेंटेड बग" : "Aphid, Painted bug",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering",
        safety: language === 'hi' ? "21 दिन का अंतराल" : "21 days interval"
      }
    ],
    groundnut: [
      {
        name: language === 'hi' ? "क्लोरपायरीफॉस" : "Chlorpyrifos",
        target: language === 'hi' ? "सफेद ग्रब, दीमक" : "White grub, Termite",
        dosage: language === 'hi' ? "4 मिली/लीटर पानी" : "4 ml/litre water",
        timing: language === 'hi' ? "बुवाई से पहले मिट्टी में" : "In soil before sowing",
        safety: language === 'hi' ? "मिट्टी उपचार" : "Soil treatment"
      }
    ],
    chilli: [
      {
        name: language === 'hi' ? "फिप्रोनिल" : "Fipronil",
        target: language === 'hi' ? "थ्रिप्स, माइट" : "Thrips, Mite",
        dosage: language === 'hi' ? "1 मिली/लीटर पानी" : "1 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    moong: [
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "सफेद मक्खी, जैसिड" : "Whitefly, Jassid",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    urad: [
      {
        name: language === 'hi' ? "डाइमेथोएट" : "Dimethoate",
        target: language === 'hi' ? "एफिड, जैसिड" : "Aphid, Jassid",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    chana: [
      {
        name: language === 'hi' ? "क्विनालफॉस" : "Quinalphos",
        target: language === 'hi' ? "पॉड बोरर" : "Pod borer",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "फूल आने के समय" : "During flowering",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    mango: [
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "हॉपर, मिली बग" : "Hopper, Mealy bug",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "फूल आने से पहले और बाद" : "Before and after flowering",
        safety: language === 'hi' ? "15 दिन का अंतराल" : "15 days interval"
      },
      {
        name: language === 'hi' ? "कार्बेंडाजिम" : "Carbendazim",
        target: language === 'hi' ? "पाउडरी मिल्ड्यू, एन्थ्रेक्नोज" : "Powdery mildew, Anthracnose",
        dosage: language === 'hi' ? "1 ग्राम/लीटर पानी" : "1 gm/litre water",
        timing: language === 'hi' ? "फूल और फल लगने पर" : "During flowering and fruiting",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      }
    ],
    banana: [
      {
        name: language === 'hi' ? "क्लोरपायरीफॉस" : "Chlorpyrifos",
        target: language === 'hi' ? "राइजोम वीविल, तना छेदक" : "Rhizome weevil, Stem borer",
        dosage: language === 'hi' ? "2.5 मिली/लीटर पानी" : "2.5 ml/litre water",
        timing: language === 'hi' ? "रोपाई के बाद" : "After planting",
        safety: language === 'hi' ? "मिट्टी में उपयोग" : "Soil application"
      },
      {
        name: language === 'hi' ? "कार्बेंडाजिम + मैंकोजेब" : "Carbendazim + Mancozeb",
        target: language === 'hi' ? "सिगाटोका, पनामा विल्ट" : "Sigatoka, Panama wilt",
        dosage: language === 'hi' ? "2 ग्राम/लीटर पानी" : "2 gm/litre water",
        timing: language === 'hi' ? "रोग दिखने पर" : "When disease appears",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    guava: [
      {
        name: language === 'hi' ? "डाइमेथोएट" : "Dimethoate",
        target: language === 'hi' ? "फ्रूट फ्लाई, एफिड" : "Fruit fly, Aphid",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "फल लगने के समय" : "During fruiting",
        safety: language === 'hi' ? "21 दिन का अंतराल" : "21 days interval"
      },
      {
        name: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड" : "Copper Oxychloride",
        target: language === 'hi' ? "एन्थ्रेक्नोज, कैंकर" : "Anthracnose, Canker",
        dosage: language === 'hi' ? "3 ग्राम/लीटर पानी" : "3 gm/litre water",
        timing: language === 'hi' ? "बारिश के बाद" : "After rain",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      }
    ],
    sweetpotato: [
      {
        name: language === 'hi' ? "क्लोरपायरीफॉस" : "Chlorpyrifos",
        target: language === 'hi' ? "स्वीट पोटैटो वीविल, दीमक" : "Sweet potato weevil, Termite",
        dosage: language === 'hi' ? "2.5 मिली/लीटर पानी" : "2.5 ml/litre water",
        timing: language === 'hi' ? "रोपाई के 30 दिन बाद" : "30 days after planting",
        safety: language === 'hi' ? "मिट्टी उपचार" : "Soil treatment"
      },
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "व्हाइटफ्लाई, एफिड" : "Whitefly, Aphid",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    apple: [
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "स्कैब, पाउडरी मिल्ड्यू" : "Scab, Powdery mildew",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      },
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "एफिड, वूली एफिड" : "Aphid, Woolly aphid",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "वसंत में नई पत्तियों पर" : "On new leaves in spring",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    orange: [
      {
        name: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड" : "Copper Oxychloride",
        target: language === 'hi' ? "कैंकर, गमोसिस" : "Canker, Gummosis",
        dosage: language === 'hi' ? "3 ग्राम/लीटर पानी" : "3 gm/litre water",
        timing: language === 'hi' ? "बारिश के बाद" : "After rain",
        safety: language === 'hi' ? "15 दिन का अंतराल" : "15 days interval"
      },
      {
        name: language === 'hi' ? "डाइमेथोएट" : "Dimethoate",
        target: language === 'hi' ? "सिट्रस साइला, लीफ माइनर" : "Citrus psylla, Leaf miner",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "नई पत्तियों पर" : "On new leaves",
        safety: language === 'hi' ? "21 दिन का अंतराल" : "21 days interval"
      }
    ],
    papaya: [
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "एफिड, व्हाइटफ्लाई (वायरस वाहक)" : "Aphid, Whitefly (virus vectors)",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "15 दिन के अंतराल पर" : "At 15 days interval",
        safety: language === 'hi' ? "वायरस रोकथाम के लिए जरूरी" : "Essential for virus prevention"
      },
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "एन्थ्रेक्नोज, पाउडरी मिल्ड्यू" : "Anthracnose, Powdery mildew",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "फल लगने के समय" : "During fruiting",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      }
    ],
    grapes: [
      {
        name: language === 'hi' ? "सल्फर" : "Sulphur",
        target: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery mildew",
        dosage: language === 'hi' ? "2 ग्राम/लीटर पानी" : "2 gm/litre water",
        timing: language === 'hi' ? "नई पत्तियों पर" : "On new leaves",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      },
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "डाउनी मिल्ड्यू, एन्थ्रेक्नोज" : "Downy mildew, Anthracnose",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "बारिश के मौसम में" : "During rainy season",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      }
    ],
    brinjal: [
      {
        name: language === 'hi' ? "स्पिनोसैड" : "Spinosad",
        target: language === 'hi' ? "फल और तना छेदक" : "Fruit and shoot borer",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "फूल आने के समय" : "During flowering",
        safety: language === 'hi' ? "जैविक खेती में उपयोग" : "Safe for organic farming"
      }
    ],
    cabbage: [
      {
        name: language === 'hi' ? "बीटी (बैसिलस थुरिंजिएंसिस)" : "Bt (Bacillus thuringiensis)",
        target: language === 'hi' ? "डायमंड बैक मोथ, कैटरपिलर" : "Diamond back moth, Caterpillar",
        dosage: language === 'hi' ? "1 ग्राम/लीटर पानी" : "1 gm/litre water",
        timing: language === 'hi' ? "लार्वा दिखने पर" : "When larvae appear",
        safety: language === 'hi' ? "जैविक कीटनाशक" : "Bio-pesticide"
      }
    ],
    cauliflower: [
      {
        name: language === 'hi' ? "इमामेक्टिन बेंजोएट" : "Emamectin Benzoate",
        target: language === 'hi' ? "बोरर, कैटरपिलर" : "Borer, Caterpillar",
        dosage: language === 'hi' ? "0.4 ग्राम/लीटर पानी" : "0.4 gm/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    okra: [
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "जैसिड, व्हाइटफ्लाई" : "Jassid, Whitefly",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    garlic: [
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "पर्पल ब्लॉच, स्टेम्फिलियम ब्लाइट" : "Purple blotch, Stemphylium blight",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "रोग दिखने पर" : "When disease appears",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    ginger: [
      {
        name: language === 'hi' ? "मेटालैक्सिल + मैंकोजेब" : "Metalaxyl + Mancozeb",
        target: language === 'hi' ? "सॉफ्ट रॉट, राइजोम रॉट" : "Soft rot, Rhizome rot",
        dosage: language === 'hi' ? "2 ग्राम/लीटर पानी" : "2 gm/litre water",
        timing: language === 'hi' ? "बारिश के मौसम में" : "During rainy season",
        safety: language === 'hi' ? "मिट्टी में भी उपयोग" : "Soil drench also"
      }
    ],
    turmeric: [
      {
        name: language === 'hi' ? "क्लोरपायरीफॉस" : "Chlorpyrifos",
        target: language === 'hi' ? "राइजोम फ्लाई, शूट बोरर" : "Rhizome fly, Shoot borer",
        dosage: language === 'hi' ? "2.5 मिली/लीटर पानी" : "2.5 ml/litre water",
        timing: language === 'hi' ? "रोपाई के 45 दिन बाद" : "45 days after planting",
        safety: language === 'hi' ? "मिट्टी उपचार" : "Soil treatment"
      }
    ],
    watermelon: [
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "डाउनी मिल्ड्यू, एन्थ्रेक्नोज" : "Downy mildew, Anthracnose",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "बेल बढ़ने के समय" : "During vine growth",
        safety: language === 'hi' ? "7 दिन का अंतराल" : "7 days interval"
      }
    ],
    cucumber: [
      {
        name: language === 'hi' ? "इमिडाक्लोप्रिड" : "Imidacloprid",
        target: language === 'hi' ? "एफिड, व्हाइटफ्लाई" : "Aphid, Whitefly",
        dosage: language === 'hi' ? "0.3 मिली/लीटर पानी" : "0.3 ml/litre water",
        timing: language === 'hi' ? "कीट दिखने पर" : "When pests appear",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    pumpkin: [
      {
        name: language === 'hi' ? "कार्बेरिल" : "Carbaryl",
        target: language === 'hi' ? "फ्रूट फ्लाई, रेड पम्पकिन बीटल" : "Fruit fly, Red pumpkin beetle",
        dosage: language === 'hi' ? "2 ग्राम/लीटर पानी" : "2 gm/litre water",
        timing: language === 'hi' ? "फल बनने के समय" : "During fruiting",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ],
    carrot: [
      {
        name: language === 'hi' ? "मैंकोजेब" : "Mancozeb",
        target: language === 'hi' ? "अल्टरनेरिया ब्लाइट" : "Alternaria blight",
        dosage: language === 'hi' ? "2.5 ग्राम/लीटर पानी" : "2.5 gm/litre water",
        timing: language === 'hi' ? "रोग दिखने पर" : "When disease appears",
        safety: language === 'hi' ? "10 दिन का अंतराल" : "10 days interval"
      }
    ],
    peas: [
      {
        name: language === 'hi' ? "डाइमेथोएट" : "Dimethoate",
        target: language === 'hi' ? "पॉड बोरर, एफिड" : "Pod borer, Aphid",
        dosage: language === 'hi' ? "2 मिली/लीटर पानी" : "2 ml/litre water",
        timing: language === 'hi' ? "फूल आने के समय" : "During flowering",
        safety: language === 'hi' ? "14 दिन का अंतराल" : "14 days interval"
      }
    ]
  };

  const fertilizers: Record<string, FertilizerInfo[]> = {
    rice: [
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "50-60 किग्रा/एकड़" : "50-60 kg/acre",
        timing: language === 'hi' ? "3 बार: रोपाई, कल्ले फूटने, बाली आने पर" : "3 times: Transplanting, Tillering, Panicle"
      },
      {
        name: language === 'hi' ? "DAP" : "DAP",
        nutrients: language === 'hi' ? "18% N, 46% P" : "18% N, 46% P",
        application: language === 'hi' ? "25-30 किग्रा/एकड़" : "25-30 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय बेसल" : "Basal at transplanting"
      }
    ],
    wheat: [
      {
        name: language === 'hi' ? "NPK 12:32:16" : "NPK 12:32:16",
        nutrients: language === 'hi' ? "नाइट्रोजन, फॉस्फोरस, पोटाश" : "Nitrogen, Phosphorus, Potash",
        application: language === 'hi' ? "50 किग्रा/एकड़" : "50 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    cotton: [
      {
        name: language === 'hi' ? "पोटाश (MOP)" : "Potash (MOP)",
        nutrients: language === 'hi' ? "60% K2O" : "60% K2O",
        application: language === 'hi' ? "20-25 किग्रा/एकड़" : "20-25 kg/acre",
        timing: language === 'hi' ? "फूल और बॉल बनते समय" : "During flowering and boll formation"
      }
    ],
    sugarcane: [
      {
        name: language === 'hi' ? "सिंगल सुपर फॉस्फेट" : "Single Super Phosphate",
        nutrients: language === 'hi' ? "16% P, 11% S" : "16% P, 11% S",
        application: language === 'hi' ? "75 किग्रा/एकड़" : "75 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय गड्ढों में" : "In furrows at planting"
      }
    ],
    corn: [
      {
        name: language === 'hi' ? "जिंक सल्फेट" : "Zinc Sulphate",
        nutrients: language === 'hi' ? "33% Zn, 15% S" : "33% Zn, 15% S",
        application: language === 'hi' ? "10 किग्रा/एकड़" : "10 kg/acre",
        timing: language === 'hi' ? "बुवाई से पहले मिट्टी में" : "In soil before sowing"
      }
    ],
    bajra: [
      {
        name: language === 'hi' ? "DAP" : "DAP",
        nutrients: language === 'hi' ? "18% N, 46% P" : "18% N, 46% P",
        application: language === 'hi' ? "25 किग्रा/एकड़" : "25 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      },
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "30-40 किग्रा/एकड़" : "30-40 kg/acre",
        timing: language === 'hi' ? "बुवाई के 25-30 दिन बाद" : "25-30 days after sowing"
      }
    ],
    jowar: [
      {
        name: language === 'hi' ? "NPK 20:20:0" : "NPK 20:20:0",
        nutrients: language === 'hi' ? "नाइट्रोजन, फॉस्फोरस" : "Nitrogen, Phosphorus",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    potato: [
      {
        name: language === 'hi' ? "NPK 10:26:26" : "NPK 10:26:26",
        nutrients: language === 'hi' ? "संतुलित पोषक तत्व" : "Balanced nutrients",
        application: language === 'hi' ? "80-100 किग्रा/एकड़" : "80-100 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At planting time"
      }
    ],
    tomato: [
      {
        name: language === 'hi' ? "NPK 19:19:19" : "NPK 19:19:19",
        nutrients: language === 'hi' ? "संतुलित पोषक" : "Balanced nutrients",
        application: language === 'hi' ? "5 ग्राम/लीटर पानी" : "5 gm/litre water",
        timing: language === 'hi' ? "हर 15 दिन पर स्प्रे" : "Spray every 15 days"
      }
    ],
    onion: [
      {
        name: language === 'hi' ? "सल्फर" : "Sulphur",
        nutrients: language === 'hi' ? "90% सल्फर" : "90% Sulphur",
        application: language === 'hi' ? "10-15 किग्रा/एकड़" : "10-15 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय" : "At transplanting"
      }
    ],
    soybean: [
      {
        name: language === 'hi' ? "SSP + राइजोबियम" : "SSP + Rhizobium",
        nutrients: language === 'hi' ? "फॉस्फोरस + जैविक" : "Phosphorus + Organic",
        application: language === 'hi' ? "50 किग्रा/एकड़" : "50 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    mustard: [
      {
        name: language === 'hi' ? "सल्फर 90%" : "Sulphur 90%",
        nutrients: language === 'hi' ? "सल्फर" : "Sulphur",
        application: language === 'hi' ? "10 किग्रा/एकड़" : "10 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    groundnut: [
      {
        name: language === 'hi' ? "जिप्सम" : "Gypsum",
        nutrients: language === 'hi' ? "कैल्शियम, सल्फर" : "Calcium, Sulphur",
        application: language === 'hi' ? "100 किग्रा/एकड़" : "100 kg/acre",
        timing: language === 'hi' ? "फूल आने के समय" : "At flowering"
      }
    ],
    chilli: [
      {
        name: language === 'hi' ? "कैल्शियम नाइट्रेट" : "Calcium Nitrate",
        nutrients: language === 'hi' ? "कैल्शियम, नाइट्रोजन" : "Calcium, Nitrogen",
        application: language === 'hi' ? "5 ग्राम/लीटर पानी" : "5 gm/litre water",
        timing: language === 'hi' ? "फल बनते समय" : "During fruiting"
      }
    ],
    moong: [
      {
        name: language === 'hi' ? "DAP + राइजोबियम" : "DAP + Rhizobium",
        nutrients: language === 'hi' ? "फॉस्फोरस + जैविक" : "Phosphorus + Organic",
        application: language === 'hi' ? "20 किग्रा/एकड़" : "20 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    urad: [
      {
        name: language === 'hi' ? "SSP" : "SSP",
        nutrients: language === 'hi' ? "16% फॉस्फोरस" : "16% Phosphorus",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    chana: [
      {
        name: language === 'hi' ? "DAP + पोटाश" : "DAP + Potash",
        nutrients: language === 'hi' ? "N, P, K" : "N, P, K",
        application: language === 'hi' ? "30 किग्रा/एकड़" : "30 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing time"
      }
    ],
    mango: [
      {
        name: language === 'hi' ? "NPK 10:26:26" : "NPK 10:26:26",
        nutrients: language === 'hi' ? "संतुलित पोषक तत्व" : "Balanced nutrients",
        application: language === 'hi' ? "500 ग्राम/पेड़/वर्ष उम्र" : "500 gm/tree/year of age",
        timing: language === 'hi' ? "मानसून से पहले और बाद" : "Before and after monsoon"
      },
      {
        name: language === 'hi' ? "पोटेशियम सल्फेट" : "Potassium Sulphate",
        nutrients: language === 'hi' ? "50% K, 18% S" : "50% K, 18% S",
        application: language === 'hi' ? "200 ग्राम/पेड़" : "200 gm/tree",
        timing: language === 'hi' ? "फल लगने के समय" : "During fruiting"
      }
    ],
    banana: [
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "200 ग्राम/पौधा" : "200 gm/plant",
        timing: language === 'hi' ? "रोपाई के 2, 4, 6 महीने बाद" : "2, 4, 6 months after planting"
      },
      {
        name: language === 'hi' ? "MOP (पोटाश)" : "MOP (Potash)",
        nutrients: language === 'hi' ? "60% K2O" : "60% K2O",
        application: language === 'hi' ? "300 ग्राम/पौधा" : "300 gm/plant",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering"
      }
    ],
    guava: [
      {
        name: language === 'hi' ? "गोबर की खाद" : "FYM",
        nutrients: language === 'hi' ? "जैविक पोषक" : "Organic nutrients",
        application: language === 'hi' ? "25-30 किग्रा/पेड़" : "25-30 kg/tree",
        timing: language === 'hi' ? "साल में एक बार" : "Once a year"
      },
      {
        name: language === 'hi' ? "NPK 15:15:15" : "NPK 15:15:15",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "500 ग्राम/पेड़" : "500 gm/tree",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering"
      }
    ],
    sweetpotato: [
      {
        name: language === 'hi' ? "गोबर की खाद" : "FYM",
        nutrients: language === 'hi' ? "जैविक पोषक" : "Organic nutrients",
        application: language === 'hi' ? "8-10 टन/हेक्टेयर" : "8-10 ton/hectare",
        timing: language === 'hi' ? "खेत तैयारी के समय" : "During field preparation"
      },
      {
        name: language === 'hi' ? "पोटाश (MOP)" : "Potash (MOP)",
        nutrients: language === 'hi' ? "60% K2O" : "60% K2O",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय" : "At planting"
      }
    ],
    apple: [
      {
        name: language === 'hi' ? "NPK 10:10:10" : "NPK 10:10:10",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "500 ग्राम-2 किग्रा/पेड़ (उम्र अनुसार)" : "500gm-2kg/tree (as per age)",
        timing: language === 'hi' ? "फरवरी-मार्च" : "February-March"
      },
      {
        name: language === 'hi' ? "कैल्शियम नाइट्रेट" : "Calcium Nitrate",
        nutrients: language === 'hi' ? "15.5% N, 19% Ca" : "15.5% N, 19% Ca",
        application: language === 'hi' ? "छिड़काव 5 ग्राम/लीटर" : "Spray 5 gm/litre",
        timing: language === 'hi' ? "फल बनने के बाद" : "After fruit set"
      }
    ],
    orange: [
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "500 ग्राम/पेड़" : "500 gm/tree",
        timing: language === 'hi' ? "फूल आने से पहले" : "Before flowering"
      },
      {
        name: language === 'hi' ? "जिंक सल्फेट" : "Zinc Sulphate",
        nutrients: language === 'hi' ? "33% Zn" : "33% Zn",
        application: language === 'hi' ? "छिड़काव 5 ग्राम/लीटर" : "Spray 5 gm/litre",
        timing: language === 'hi' ? "नई पत्तियों पर" : "On new flush"
      }
    ],
    papaya: [
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "200 ग्राम/पौधा हर 2 महीने" : "200 gm/plant every 2 months",
        timing: language === 'hi' ? "रोपाई के बाद" : "After planting"
      },
      {
        name: language === 'hi' ? "DAP" : "DAP",
        nutrients: language === 'hi' ? "18% N, 46% P" : "18% N, 46% P",
        application: language === 'hi' ? "150 ग्राम/पौधा" : "150 gm/plant",
        timing: language === 'hi' ? "रोपाई के समय" : "At planting"
      }
    ],
    grapes: [
      {
        name: language === 'hi' ? "NPK 19:19:19" : "NPK 19:19:19",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "5 ग्राम/लीटर छिड़काव" : "5 gm/litre spray",
        timing: language === 'hi' ? "बेल बढ़ने के समय" : "During vine growth"
      },
      {
        name: language === 'hi' ? "पोटेशियम सल्फेट" : "Potassium Sulphate",
        nutrients: language === 'hi' ? "50% K, 18% S" : "50% K, 18% S",
        application: language === 'hi' ? "500 ग्राम/बेल" : "500 gm/vine",
        timing: language === 'hi' ? "फल पकने से पहले" : "Before fruit ripening"
      }
    ],
    brinjal: [
      {
        name: language === 'hi' ? "DAP" : "DAP",
        nutrients: language === 'hi' ? "18% N, 46% P" : "18% N, 46% P",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय" : "At transplanting"
      }
    ],
    cabbage: [
      {
        name: language === 'hi' ? "यूरिया" : "Urea",
        nutrients: language === 'hi' ? "46% नाइट्रोजन" : "46% Nitrogen",
        application: language === 'hi' ? "50 किग्रा/एकड़" : "50 kg/acre",
        timing: language === 'hi' ? "रोपाई के 15 और 30 दिन बाद" : "15 and 30 days after transplanting"
      }
    ],
    cauliflower: [
      {
        name: language === 'hi' ? "बोरॉन" : "Boron",
        nutrients: language === 'hi' ? "सूक्ष्म पोषक" : "Micronutrient",
        application: language === 'hi' ? "1 किग्रा/एकड़" : "1 kg/acre",
        timing: language === 'hi' ? "खेत तैयारी के समय" : "During field preparation"
      }
    ],
    okra: [
      {
        name: language === 'hi' ? "NPK 10:26:26" : "NPK 10:26:26",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing"
      }
    ],
    garlic: [
      {
        name: language === 'hi' ? "सल्फर" : "Sulphur",
        nutrients: language === 'hi' ? "90% S" : "90% S",
        application: language === 'hi' ? "15 किग्रा/एकड़" : "15 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing"
      }
    ],
    ginger: [
      {
        name: language === 'hi' ? "गोबर की खाद" : "FYM",
        nutrients: language === 'hi' ? "जैविक पोषक" : "Organic nutrients",
        application: language === 'hi' ? "15-20 टन/हेक्टेयर" : "15-20 ton/hectare",
        timing: language === 'hi' ? "खेत तैयारी के समय" : "During field preparation"
      }
    ],
    turmeric: [
      {
        name: language === 'hi' ? "NPK 10:26:26" : "NPK 10:26:26",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "50 किग्रा/एकड़" : "50 kg/acre",
        timing: language === 'hi' ? "रोपाई के समय" : "At planting"
      }
    ],
    watermelon: [
      {
        name: language === 'hi' ? "पोटाश" : "Potash",
        nutrients: language === 'hi' ? "60% K2O" : "60% K2O",
        application: language === 'hi' ? "30 किग्रा/एकड़" : "30 kg/acre",
        timing: language === 'hi' ? "फल बनने के समय" : "During fruiting"
      }
    ],
    cucumber: [
      {
        name: language === 'hi' ? "NPK 19:19:19" : "NPK 19:19:19",
        nutrients: language === 'hi' ? "संतुलित NPK" : "Balanced NPK",
        application: language === 'hi' ? "5 ग्राम/लीटर छिड़काव" : "5 gm/litre spray",
        timing: language === 'hi' ? "बेल बढ़ने के समय" : "During vine growth"
      }
    ],
    pumpkin: [
      {
        name: language === 'hi' ? "गोबर की खाद" : "FYM",
        nutrients: language === 'hi' ? "जैविक पोषक" : "Organic nutrients",
        application: language === 'hi' ? "10-15 टन/हेक्टेयर" : "10-15 ton/hectare",
        timing: language === 'hi' ? "खेत तैयारी के समय" : "During field preparation"
      }
    ],
    carrot: [
      {
        name: language === 'hi' ? "पोटाश" : "Potash",
        nutrients: language === 'hi' ? "60% K2O" : "60% K2O",
        application: language === 'hi' ? "25 किग्रा/एकड़" : "25 kg/acre",
        timing: language === 'hi' ? "जड़ बनने के समय" : "During root development"
      }
    ],
    peas: [
      {
        name: language === 'hi' ? "DAP" : "DAP",
        nutrients: language === 'hi' ? "18% N, 46% P" : "18% N, 46% P",
        application: language === 'hi' ? "40 किग्रा/एकड़" : "40 kg/acre",
        timing: language === 'hi' ? "बुवाई के समय" : "At sowing"
      }
    ]
  };

  const diseases: Record<string, DiseaseInfo[]> = {
    rice: [
      {
        name: language === 'hi' ? "ब्लास्ट (झुलसा)" : "Blast",
        symptoms: language === 'hi' ? "पत्तियों पर हीरे जैसे धब्बे, गर्दन टूटना" : "Diamond-shaped spots on leaves, neck breaking",
        treatment: language === 'hi' ? "ट्राइसाइक्लाजोल 0.6 ग्राम/लीटर छिड़काव" : "Spray Tricyclazole 0.6 gm/litre",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, संतुलित खाद" : "Resistant varieties, balanced fertilizer"
      },
      {
        name: language === 'hi' ? "बैक्टीरियल लीफ ब्लाइट" : "Bacterial Leaf Blight",
        symptoms: language === 'hi' ? "पत्तियों के किनारे पीले होकर सूखना" : "Yellowing and drying of leaf margins",
        treatment: language === 'hi' ? "स्ट्रेप्टोसाइक्लिन 0.5 ग्राम/लीटर" : "Streptocycline 0.5 gm/litre",
        prevention: language === 'hi' ? "बीज उपचार, जल निकासी" : "Seed treatment, proper drainage"
      }
    ],
    wheat: [
      {
        name: language === 'hi' ? "पीला रस्ट" : "Yellow Rust",
        symptoms: language === 'hi' ? "पत्तियों पर पीली धारियां" : "Yellow stripes on leaves",
        treatment: language === 'hi' ? "प्रोपिकोनाजोल 1 मिली/लीटर" : "Propiconazole 1 ml/litre",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, समय पर बुवाई" : "Resistant varieties, timely sowing"
      }
    ],
    cotton: [
      {
        name: language === 'hi' ? "रूट रॉट" : "Root Rot",
        symptoms: language === 'hi' ? "पौधा मुरझाना, जड़ें काली" : "Wilting plant, black roots",
        treatment: language === 'hi' ? "कार्बेंडाजिम से मिट्टी उपचार" : "Soil treatment with Carbendazim",
        prevention: language === 'hi' ? "फसल चक्र, जल निकासी" : "Crop rotation, drainage"
      }
    ],
    sugarcane: [
      {
        name: language === 'hi' ? "रेड रॉट" : "Red Rot",
        symptoms: language === 'hi' ? "तने के अंदर लाल रंग, सड़ी गंध" : "Red color inside stem, rotting smell",
        treatment: language === 'hi' ? "संक्रमित पौधे निकालें और जलाएं" : "Remove and burn infected plants",
        prevention: language === 'hi' ? "स्वस्थ बीज, प्रतिरोधी किस्में" : "Healthy seeds, resistant varieties"
      }
    ],
    corn: [
      {
        name: language === 'hi' ? "मेडिस लीफ ब्लाइट" : "Maydis Leaf Blight",
        symptoms: language === 'hi' ? "पत्तियों पर भूरे लंबे धब्बे" : "Long brown spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब 2.5 ग्राम/लीटर" : "Mancozeb 2.5 gm/litre",
        prevention: language === 'hi' ? "फसल अवशेष हटाएं, फसल चक्र" : "Remove crop residue, crop rotation"
      }
    ],
    bajra: [
      {
        name: language === 'hi' ? "डाउनी मिल्ड्यू" : "Downy Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर, बाली में दाने नहीं" : "White powder on leaves, no grains in ear",
        treatment: language === 'hi' ? "मेटालैक्सिल से बीज उपचार" : "Seed treatment with Metalaxyl",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, बीज उपचार" : "Resistant varieties, seed treatment"
      },
      {
        name: language === 'hi' ? "अर्गट" : "Ergot",
        symptoms: language === 'hi' ? "बाली से मीठा रस निकलना" : "Sweet liquid oozing from ear",
        treatment: language === 'hi' ? "मैंकोजेब 0.2% छिड़काव" : "Spray Mancozeb 0.2%",
        prevention: language === 'hi' ? "स्वस्थ बीज, समय पर बुवाई" : "Healthy seeds, timely sowing"
      }
    ],
    jowar: [
      {
        name: language === 'hi' ? "ग्रेन मोल्ड" : "Grain Mold",
        symptoms: language === 'hi' ? "दानों पर फफूंद" : "Mold on grains",
        treatment: language === 'hi' ? "कार्बेंडाजिम छिड़काव" : "Spray Carbendazim",
        prevention: language === 'hi' ? "सूखे मौसम में कटाई" : "Harvest in dry weather"
      }
    ],
    potato: [
      {
        name: language === 'hi' ? "लेट ब्लाइट" : "Late Blight",
        symptoms: language === 'hi' ? "पत्तियों पर भूरे धब्बे, तेजी से फैलना" : "Brown spots on leaves, rapid spread",
        treatment: language === 'hi' ? "मैंकोजेब + मेटालैक्सिल" : "Mancozeb + Metalaxyl",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, जल निकासी" : "Resistant varieties, drainage"
      }
    ],
    tomato: [
      {
        name: language === 'hi' ? "पत्ती मोड़क विषाणु" : "Leaf Curl Virus",
        symptoms: language === 'hi' ? "पत्तियां मुड़ना, पीला पड़ना" : "Leaf curling, yellowing",
        treatment: language === 'hi' ? "प्रभावित पौधे निकालें" : "Remove affected plants",
        prevention: language === 'hi' ? "सफेद मक्खी नियंत्रण" : "Whitefly control"
      }
    ],
    onion: [
      {
        name: language === 'hi' ? "पर्पल ब्लॉच" : "Purple Blotch",
        symptoms: language === 'hi' ? "पत्तियों पर बैंगनी धब्बे" : "Purple spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब 2.5 ग्राम/लीटर" : "Mancozeb 2.5 gm/litre",
        prevention: language === 'hi' ? "फसल चक्र, जल निकासी" : "Crop rotation, drainage"
      }
    ],
    soybean: [
      {
        name: language === 'hi' ? "पीला मोजैक" : "Yellow Mosaic",
        symptoms: language === 'hi' ? "पत्तियों पर पीले धब्बे" : "Yellow patches on leaves",
        treatment: language === 'hi' ? "प्रभावित पौधे निकालें" : "Remove affected plants",
        prevention: language === 'hi' ? "सफेद मक्खी नियंत्रण" : "Whitefly control"
      }
    ],
    mustard: [
      {
        name: language === 'hi' ? "अल्टरनेरिया ब्लाइट" : "Alternaria Blight",
        symptoms: language === 'hi' ? "पत्तियों पर गोल धब्बे" : "Round spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब + आइप्रोडियॉन" : "Mancozeb + Iprodione",
        prevention: language === 'hi' ? "स्वस्थ बीज, फसल चक्र" : "Healthy seeds, crop rotation"
      }
    ],
    groundnut: [
      {
        name: language === 'hi' ? "टिक्का रोग" : "Tikka Disease",
        symptoms: language === 'hi' ? "पत्तियों पर गोल धब्बे" : "Round spots on leaves",
        treatment: language === 'hi' ? "कार्बेंडाजिम 1 ग्राम/लीटर" : "Carbendazim 1 gm/litre",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में" : "Resistant varieties"
      }
    ],
    chilli: [
      {
        name: language === 'hi' ? "डाई बैक" : "Die Back",
        symptoms: language === 'hi' ? "तना सूखना, ऊपर से नीचे" : "Stem drying, top to bottom",
        treatment: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड" : "Copper Oxychloride",
        prevention: language === 'hi' ? "स्वस्थ बीज, जल निकासी" : "Healthy seeds, drainage"
      }
    ],
    moong: [
      {
        name: language === 'hi' ? "पीला मोजैक" : "Yellow Mosaic",
        symptoms: language === 'hi' ? "पत्तियां पीली, विकृत" : "Yellow, deformed leaves",
        treatment: language === 'hi' ? "प्रभावित पौधे निकालें" : "Remove affected plants",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में" : "Resistant varieties"
      }
    ],
    urad: [
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर" : "White powder on leaves",
        treatment: language === 'hi' ? "सल्फर 2 ग्राम/लीटर" : "Sulphur 2 gm/litre",
        prevention: language === 'hi' ? "हवादार जगह" : "Good ventilation"
      }
    ],
    chana: [
      {
        name: language === 'hi' ? "विल्ट" : "Wilt",
        symptoms: language === 'hi' ? "पौधा अचानक सूखना" : "Sudden plant drying",
        treatment: language === 'hi' ? "ट्राइकोडर्मा से बीज उपचार" : "Seed treatment with Trichoderma",
        prevention: language === 'hi' ? "फसल चक्र, प्रतिरोधी किस्में" : "Crop rotation, resistant varieties"
      }
    ],
    mango: [
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "फूलों और पत्तियों पर सफेद पाउडर" : "White powder on flowers and leaves",
        treatment: language === 'hi' ? "सल्फर डस्टिंग या वेटेबल सल्फर" : "Sulphur dusting or wettable sulphur",
        prevention: language === 'hi' ? "समय पर छिड़काव, हवादार बाग" : "Timely spraying, ventilated orchard"
      },
      {
        name: language === 'hi' ? "एन्थ्रेक्नोज" : "Anthracnose",
        symptoms: language === 'hi' ? "फलों पर काले धब्बे, सड़न" : "Black spots on fruits, rotting",
        treatment: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड 3 ग्राम/लीटर" : "Copper Oxychloride 3 gm/litre",
        prevention: language === 'hi' ? "बाग की सफाई, छंटाई" : "Orchard sanitation, pruning"
      }
    ],
    banana: [
      {
        name: language === 'hi' ? "पनामा विल्ट" : "Panama Wilt",
        symptoms: language === 'hi' ? "पत्तियां पीली, तना टूटना" : "Yellow leaves, stem splitting",
        treatment: language === 'hi' ? "प्रभावित पौधे निकालें, मिट्टी उपचार" : "Remove affected plants, soil treatment",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, स्वस्थ पौधे" : "Resistant varieties, healthy plants"
      },
      {
        name: language === 'hi' ? "सिगाटोका" : "Sigatoka",
        symptoms: language === 'hi' ? "पत्तियों पर पीले-भूरे धब्बे" : "Yellow-brown spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब + कार्बेंडाजिम" : "Mancozeb + Carbendazim",
        prevention: language === 'hi' ? "पुरानी पत्तियां हटाएं" : "Remove old leaves"
      }
    ],
    guava: [
      {
        name: language === 'hi' ? "विल्ट (मुरझान)" : "Wilt",
        symptoms: language === 'hi' ? "पत्तियां पीली, पौधा सूखना" : "Yellow leaves, plant drying",
        treatment: language === 'hi' ? "ट्राइकोडर्मा मिट्टी में डालें" : "Apply Trichoderma to soil",
        prevention: language === 'hi' ? "जल निकासी, स्वस्थ पौधे" : "Drainage, healthy plants"
      },
      {
        name: language === 'hi' ? "फल सड़न" : "Fruit Rot",
        symptoms: language === 'hi' ? "फलों पर भूरे धब्बे, सड़न" : "Brown spots on fruits, rotting",
        treatment: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड छिड़काव" : "Copper Oxychloride spray",
        prevention: language === 'hi' ? "फलों को बारिश से बचाएं" : "Protect fruits from rain"
      }
    ],
    sweetpotato: [
      {
        name: language === 'hi' ? "वीविल क्षति" : "Weevil Damage",
        symptoms: language === 'hi' ? "कंद में छेद, सड़न" : "Holes in tuber, rotting",
        treatment: language === 'hi' ? "क्लोरपायरीफॉस मिट्टी में डालें" : "Apply Chlorpyrifos to soil",
        prevention: language === 'hi' ? "समय पर कटाई, साफ खेती" : "Timely harvest, clean cultivation"
      },
      {
        name: language === 'hi' ? "वायरस रोग" : "Virus Disease",
        symptoms: language === 'hi' ? "पत्तियां मुड़ना, पीली नसें" : "Leaf curling, yellow veins",
        treatment: language === 'hi' ? "संक्रमित पौधे निकालें" : "Remove infected plants",
        prevention: language === 'hi' ? "स्वस्थ बेल, कीट नियंत्रण" : "Healthy vines, pest control"
      }
    ],
    apple: [
      {
        name: language === 'hi' ? "स्कैब" : "Scab",
        symptoms: language === 'hi' ? "फलों और पत्तियों पर काले धब्बे" : "Black spots on fruits and leaves",
        treatment: language === 'hi' ? "मैंकोजेब + कार्बेंडाजिम छिड़काव" : "Mancozeb + Carbendazim spray",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में, पुरानी पत्तियां हटाएं" : "Resistant varieties, remove old leaves"
      },
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर" : "White powder on leaves",
        treatment: language === 'hi' ? "सल्फर या कार्बेंडाजिम छिड़काव" : "Sulphur or Carbendazim spray",
        prevention: language === 'hi' ? "हवादार छंटाई" : "Pruning for ventilation"
      }
    ],
    orange: [
      {
        name: language === 'hi' ? "सिट्रस कैंकर" : "Citrus Canker",
        symptoms: language === 'hi' ? "पत्तियों और फलों पर उभरे धब्बे" : "Raised spots on leaves and fruits",
        treatment: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड छिड़काव" : "Copper Oxychloride spray",
        prevention: language === 'hi' ? "संक्रमित भाग काटें" : "Prune infected parts"
      },
      {
        name: language === 'hi' ? "गमोसिस" : "Gummosis",
        symptoms: language === 'hi' ? "तने से गोंद निकलना" : "Gum oozing from trunk",
        treatment: language === 'hi' ? "बोर्डो पेस्ट लगाएं" : "Apply Bordeaux paste",
        prevention: language === 'hi' ? "जल निकासी, तने को नम न रखें" : "Drainage, keep trunk dry"
      }
    ],
    papaya: [
      {
        name: language === 'hi' ? "रिंग स्पॉट वायरस" : "Ring Spot Virus",
        symptoms: language === 'hi' ? "पत्तियों पर पीले धब्बे, फलों पर रिंग" : "Yellow spots on leaves, rings on fruits",
        treatment: language === 'hi' ? "कोई इलाज नहीं, पौधे निकालें" : "No cure, remove plants",
        prevention: language === 'hi' ? "एफिड नियंत्रण, स्वस्थ पौधे" : "Aphid control, healthy plants"
      },
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर" : "White powder on leaves",
        treatment: language === 'hi' ? "सल्फर छिड़काव" : "Sulphur spray",
        prevention: language === 'hi' ? "हवादार जगह रोपाई" : "Plant in airy location"
      }
    ],
    grapes: [
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों और दानों पर सफेद पाउडर" : "White powder on leaves and berries",
        treatment: language === 'hi' ? "सल्फर या डिनोकैप छिड़काव" : "Sulphur or Dinocap spray",
        prevention: language === 'hi' ? "हवादार छंटाई" : "Pruning for ventilation"
      },
      {
        name: language === 'hi' ? "डाउनी मिल्ड्यू" : "Downy Mildew",
        symptoms: language === 'hi' ? "पत्तियों के नीचे सफेद फफूंद" : "White fungus under leaves",
        treatment: language === 'hi' ? "मैंकोजेब छिड़काव" : "Mancozeb spray",
        prevention: language === 'hi' ? "जल निकासी, पत्तियां सूखी रखें" : "Drainage, keep leaves dry"
      }
    ],
    brinjal: [
      {
        name: language === 'hi' ? "फल और तना छेदक" : "Fruit and Shoot Borer",
        symptoms: language === 'hi' ? "तना और फल में छेद" : "Holes in stem and fruit",
        treatment: language === 'hi' ? "स्पिनोसैड छिड़काव" : "Spinosad spray",
        prevention: language === 'hi' ? "फेरोमोन ट्रैप, प्रभावित भाग काटें" : "Pheromone traps, remove affected parts"
      }
    ],
    cabbage: [
      {
        name: language === 'hi' ? "ब्लैक रॉट" : "Black Rot",
        symptoms: language === 'hi' ? "पत्तियों के किनारे काले, V-आकार" : "Black leaf margins, V-shaped",
        treatment: language === 'hi' ? "कॉपर ऑक्सीक्लोराइड छिड़काव" : "Copper Oxychloride spray",
        prevention: language === 'hi' ? "स्वस्थ बीज, फसल चक्र" : "Healthy seeds, crop rotation"
      }
    ],
    cauliflower: [
      {
        name: language === 'hi' ? "बोरॉन की कमी" : "Boron Deficiency",
        symptoms: language === 'hi' ? "फूल भूरा, खोखला" : "Brown, hollow curd",
        treatment: language === 'hi' ? "बोरिक एसिड छिड़काव" : "Boric acid spray",
        prevention: language === 'hi' ? "बोरॉन खाद डालें" : "Apply boron fertilizer"
      }
    ],
    okra: [
      {
        name: language === 'hi' ? "येलो वेन मोज़ेक" : "Yellow Vein Mosaic",
        symptoms: language === 'hi' ? "पत्तियों की नसें पीली" : "Yellow leaf veins",
        treatment: language === 'hi' ? "कोई इलाज नहीं, पौधे निकालें" : "No cure, remove plants",
        prevention: language === 'hi' ? "व्हाइटफ्लाई नियंत्रण, प्रतिरोधी किस्में" : "Whitefly control, resistant varieties"
      }
    ],
    garlic: [
      {
        name: language === 'hi' ? "पर्पल ब्लॉच" : "Purple Blotch",
        symptoms: language === 'hi' ? "पत्तियों पर बैंगनी धब्बे" : "Purple spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब छिड़काव" : "Mancozeb spray",
        prevention: language === 'hi' ? "फसल चक्र, जल निकासी" : "Crop rotation, drainage"
      }
    ],
    ginger: [
      {
        name: language === 'hi' ? "सॉफ्ट रॉट" : "Soft Rot",
        symptoms: language === 'hi' ? "राइजोम में पानी जैसी सड़न" : "Watery rot in rhizome",
        treatment: language === 'hi' ? "मेटालैक्सिल मिट्टी में डालें" : "Apply Metalaxyl to soil",
        prevention: language === 'hi' ? "जल निकासी, स्वस्थ बीज" : "Drainage, healthy seed"
      }
    ],
    turmeric: [
      {
        name: language === 'hi' ? "राइजोम रॉट" : "Rhizome Rot",
        symptoms: language === 'hi' ? "पत्तियां पीली, राइजोम सड़ी" : "Yellow leaves, rotted rhizome",
        treatment: language === 'hi' ? "कार्बेंडाजिम मिट्टी में डालें" : "Apply Carbendazim to soil",
        prevention: language === 'hi' ? "स्वस्थ बीज, जल निकासी" : "Healthy seed, drainage"
      }
    ],
    watermelon: [
      {
        name: language === 'hi' ? "एन्थ्रेक्नोज" : "Anthracnose",
        symptoms: language === 'hi' ? "पत्तियों और फलों पर गहरे धब्बे" : "Dark spots on leaves and fruits",
        treatment: language === 'hi' ? "मैंकोजेब छिड़काव" : "Mancozeb spray",
        prevention: language === 'hi' ? "फसल चक्र, स्वच्छ बीज" : "Crop rotation, clean seeds"
      }
    ],
    cucumber: [
      {
        name: language === 'hi' ? "डाउनी मिल्ड्यू" : "Downy Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर पीले धब्बे" : "Yellow spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब छिड़काव" : "Mancozeb spray",
        prevention: language === 'hi' ? "प्रतिरोधी किस्में" : "Resistant varieties"
      }
    ],
    pumpkin: [
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर" : "White powder on leaves",
        treatment: language === 'hi' ? "सल्फर छिड़काव" : "Sulphur spray",
        prevention: language === 'hi' ? "हवादार जगह" : "Airy location"
      }
    ],
    carrot: [
      {
        name: language === 'hi' ? "अल्टरनेरिया ब्लाइट" : "Alternaria Blight",
        symptoms: language === 'hi' ? "पत्तियों पर भूरे धब्बे" : "Brown spots on leaves",
        treatment: language === 'hi' ? "मैंकोजेब छिड़काव" : "Mancozeb spray",
        prevention: language === 'hi' ? "स्वच्छ बीज, फसल चक्र" : "Clean seeds, crop rotation"
      }
    ],
    peas: [
      {
        name: language === 'hi' ? "पाउडरी मिल्ड्यू" : "Powdery Mildew",
        symptoms: language === 'hi' ? "पत्तियों पर सफेद पाउडर" : "White powder on leaves",
        treatment: language === 'hi' ? "सल्फर छिड़काव" : "Sulphur spray",
        prevention: language === 'hi' ? "समय पर बुवाई, प्रतिरोधी किस्में" : "Timely sowing, resistant varieties"
      }
    ]
  };

  const weatherAlerts: WeatherAlert[] = [
    {
      type: "warning",
      title: language === 'hi' ? "भारी बारिश की संभावना" : "Heavy Rain Expected",
      description: language === 'hi' ? "अगले 3 दिनों में भारी बारिश। सिंचाई रोकें और जल निकासी सुनिश्चित करें।" : "Heavy rain in next 3 days. Stop irrigation and ensure drainage."
    },
    {
      type: "info",
      title: language === 'hi' ? "कीट प्रकोप का मौसम" : "Pest Outbreak Season",
      description: language === 'hi' ? "नमी और तापमान से कीट बढ़ सकते हैं। नियमित निगरानी करें।" : "Humidity and temperature may increase pests. Monitor regularly."
    },
    {
      type: "success",
      title: language === 'hi' ? "खाद देने का उचित समय" : "Good Time for Fertilization",
      description: language === 'hi' ? "आज का मौसम खाद देने के लिए अनुकूल है।" : "Today's weather is favorable for fertilization."
    }
  ];

  const mandiPrices: Record<string, MandiPrice[]> = {
    rice: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹120" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 2780, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "कोयंबटूर मंडी" : "Coimbatore Mandi", price: 2920, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹85" },
      { market: language === 'hi' ? "गुंटूर मंडी" : "Guntur Mandi", price: 2650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹45" }
    ],
    wheat: [
      { market: language === 'hi' ? "खन्ना मंडी, पंजाब" : "Khanna Mandi, Punjab", price: 2275, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹75" },
      { market: language === 'hi' ? "हापुड़ मंडी, UP" : "Hapur Mandi, UP", price: 2320, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "इंदौर मंडी, MP" : "Indore Mandi, MP", price: 2180, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹35" },
      { market: language === 'hi' ? "जयपुर मंडी" : "Jaipur Mandi", price: 2250, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹50" }
    ],
    cotton: [
      { market: language === 'hi' ? "राजकोट मंडी, गुजरात" : "Rajkot Mandi, Gujarat", price: 6850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹200" },
      { market: language === 'hi' ? "अकोला मंडी, महाराष्ट्र" : "Akola Mandi, Maharashtra", price: 6720, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "गुंटूर मंडी, AP" : "Guntur Mandi, AP", price: 6580, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹80" },
      { market: language === 'hi' ? "सिरसा मंडी, हरियाणा" : "Sirsa Mandi, Haryana", price: 6900, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹150" }
    ],
    sugarcane: [
      { market: language === 'hi' ? "मुजफ्फरनगर मंडी, UP" : "Muzaffarnagar Mandi, UP", price: 350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "कोल्हापुर मंडी" : "Kolhapur Mandi", price: 340, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹15" },
      { market: language === 'hi' ? "मेरठ मंडी" : "Meerut Mandi", price: 355, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" }
    ],
    corn: [
      { market: language === 'hi' ? "दावणगेरे मंडी, कर्नाटक" : "Davangere Mandi, Karnataka", price: 2150, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹65" },
      { market: language === 'hi' ? "गुलबर्गा मंडी" : "Gulbarga Mandi", price: 2080, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹40" },
      { market: language === 'hi' ? "उदयपुर मंडी" : "Udaipur Mandi", price: 2200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" }
    ],
    bajra: [
      { market: language === 'hi' ? "जोधपुर मंडी" : "Jodhpur Mandi", price: 2450, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" },
      { market: language === 'hi' ? "जयपुर मंडी" : "Jaipur Mandi", price: 2380, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "अहमदाबाद मंडी" : "Ahmedabad Mandi", price: 2520, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹70" }
    ],
    jowar: [
      { market: language === 'hi' ? "सोलापुर मंडी" : "Solapur Mandi", price: 3200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹110" },
      { market: language === 'hi' ? "लातूर मंडी" : "Latur Mandi", price: 3050, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "बीजापुर मंडी" : "Bijapur Mandi", price: 3150, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹55" }
    ],
    potato: [
      { market: language === 'hi' ? "आगरा मंडी" : "Agra Mandi", price: 1250, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹85" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1380, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "कोलकाता मंडी" : "Kolkata Mandi", price: 1420, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹60" }
    ],
    tomato: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹350" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 3200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹280" },
      { market: language === 'hi' ? "मदनपल्ली मंडी, AP" : "Madanapalle Mandi, AP", price: 1850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" }
    ],
    onion: [
      { market: language === 'hi' ? "लासलगांव मंडी" : "Lasalgaon Mandi", price: 1650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹120" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1920, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "नासिक मंडी" : "Nashik Mandi", price: 1580, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹95" }
    ],
    soybean: [
      { market: language === 'hi' ? "इंदौर मंडी, MP" : "Indore Mandi, MP", price: 4850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹180" },
      { market: language === 'hi' ? "लातूर मंडी" : "Latur Mandi", price: 4720, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "उज्जैन मंडी" : "Ujjain Mandi", price: 4680, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" }
    ],
    mustard: [
      { market: language === 'hi' ? "कोटा मंडी, राजस्थान" : "Kota Mandi, Rajasthan", price: 5450, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹220" },
      { market: language === 'hi' ? "अलवर मंडी" : "Alwar Mandi", price: 5380, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "ग्वालियर मंडी" : "Gwalior Mandi", price: 5520, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹150" }
    ],
    groundnut: [
      { market: language === 'hi' ? "राजकोट मंडी" : "Rajkot Mandi", price: 5850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹175" },
      { market: language === 'hi' ? "जूनागढ़ मंडी" : "Junagadh Mandi", price: 5720, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "अनंतपुर मंडी, AP" : "Anantapur Mandi, AP", price: 5680, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹65" }
    ],
    chilli: [
      { market: language === 'hi' ? "गुंटूर मंडी, AP" : "Guntur Mandi, AP", price: 18500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹850" },
      { market: language === 'hi' ? "खम्मम मंडी" : "Khammam Mandi", price: 17200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "वारंगल मंडी" : "Warangal Mandi", price: 16800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹400" }
    ],
    moong: [
      { market: language === 'hi' ? "जोधपुर मंडी" : "Jodhpur Mandi", price: 7850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹280" },
      { market: language === 'hi' ? "बीकानेर मंडी" : "Bikaner Mandi", price: 7650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "इंदौर मंडी" : "Indore Mandi", price: 7920, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹195" }
    ],
    urad: [
      { market: language === 'hi' ? "इंदौर मंडी, MP" : "Indore Mandi, MP", price: 7250, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹210" },
      { market: language === 'hi' ? "लातूर मंडी" : "Latur Mandi", price: 7120, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "अकोला मंडी" : "Akola Mandi", price: 6980, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹120" }
    ],
    chana: [
      { market: language === 'hi' ? "इंदौर मंडी, MP" : "Indore Mandi, MP", price: 5650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹165" },
      { market: language === 'hi' ? "बीकानेर मंडी" : "Bikaner Mandi", price: 5520, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "लातूर मंडी" : "Latur Mandi", price: 5480, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹85" }
    ],
    mango: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 4500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹350" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 5200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹280" },
      { market: language === 'hi' ? "रत्नागिरी मंडी" : "Ratnagiri Mandi", price: 8500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "मलिहाबाद मंडी, UP" : "Malihabad Mandi, UP", price: 3800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹150" }
    ],
    banana: [
      { market: language === 'hi' ? "जलगांव मंडी" : "Jalgaon Mandi", price: 1850, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹120" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "कोयंबटूर मंडी" : "Coimbatore Mandi", price: 1680, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹80" }
    ],
    guava: [
      { market: language === 'hi' ? "इलाहाबाद मंडी, UP" : "Allahabad Mandi, UP", price: 3200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹180" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 3800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "बरेली मंडी" : "Bareilly Mandi", price: 2950, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" }
    ],
    sweetpotato: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹120" },
      { market: language === 'hi' ? "वाराणसी मंडी" : "Varanasi Mandi", price: 1650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "पटना मंडी" : "Patna Mandi", price: 1720, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹85" }
    ],
    apple: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 8500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹450" },
      { market: language === 'hi' ? "शिमला मंडी" : "Shimla Mandi", price: 7200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "श्रीनगर मंडी" : "Srinagar Mandi", price: 6800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹320" }
    ],
    orange: [
      { market: language === 'hi' ? "नागपुर मंडी" : "Nagpur Mandi", price: 4200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹280" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 4800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "पुणे मंडी" : "Pune Mandi", price: 4350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹120" }
    ],
    papaya: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹150" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 2500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "बंगलौर मंडी" : "Bangalore Mandi", price: 2100, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" }
    ],
    grapes: [
      { market: language === 'hi' ? "नासिक मंडी" : "Nashik Mandi", price: 5500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹380" },
      { market: language === 'hi' ? "सांगली मंडी" : "Sangli Mandi", price: 5200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 6200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹450" }
    ],
    brinjal: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹120" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "बंगलौर मंडी" : "Bangalore Mandi", price: 1500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹80" }
    ],
    cabbage: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹95" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "पुणे मंडी" : "Pune Mandi", price: 1150, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹65" }
    ],
    cauliflower: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹110" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1650, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "जयपुर मंडी" : "Jaipur Mandi", price: 1380, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹75" }
    ],
    okra: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹180" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 2350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "हैदराबाद मंडी" : "Hyderabad Mandi", price: 2200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" }
    ],
    garlic: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 8500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹450" },
      { market: language === 'hi' ? "इंदौर मंडी" : "Indore Mandi", price: 7800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "जयपुर मंडी" : "Jaipur Mandi", price: 8200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹320" }
    ],
    ginger: [
      { market: language === 'hi' ? "कोचीन मंडी" : "Cochin Mandi", price: 12500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹680" },
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 14200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 13500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹420" }
    ],
    turmeric: [
      { market: language === 'hi' ? "निजामाबाद मंडी" : "Nizamabad Mandi", price: 9500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹520" },
      { market: language === 'hi' ? "सांगली मंडी" : "Sangli Mandi", price: 8800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "इरोड मंडी" : "Erode Mandi", price: 10200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹380" }
    ],
    watermelon: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹85" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "हैदराबाद मंडी" : "Hyderabad Mandi", price: 1100, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹65" }
    ],
    cucumber: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1600, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹95" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1450, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "बंगलौर मंडी" : "Bangalore Mandi", price: 1350, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹65" }
    ],
    pumpkin: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 1100, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 1250, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹75" },
      { market: language === 'hi' ? "पटना मंडी" : "Patna Mandi", price: 980, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "down", change: "-₹45" }
    ],
    carrot: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 2200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹140" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 2450, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "ऊटी मंडी" : "Ooty Mandi", price: 1800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹85" }
    ],
    peas: [
      { market: language === 'hi' ? "आजादपुर मंडी, दिल्ली" : "Azadpur Mandi, Delhi", price: 4500, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹280" },
      { market: language === 'hi' ? "वाशी मंडी, मुंबई" : "Vashi Mandi, Mumbai", price: 4200, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "stable", change: "₹0" },
      { market: language === 'hi' ? "शिमला मंडी" : "Shimla Mandi", price: 3800, unit: language === 'hi' ? "₹/क्विंटल" : "₹/quintal", trend: "up", change: "+₹150" }
    ]
  };

  return (
    <section className="py-16 px-4 bg-background" id="farming-tools">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {language === 'hi' ? "कृषि उपकरण" : "Farming Tools"}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'hi' ? "कीटनाशक, खाद और रोग प्रबंधन" : "Pesticides, Fertilizers & Disease Management"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? "अपनी फसल के लिए सही कीटनाशक, खाद और रोग उपचार जानें" 
              : "Learn the right pesticides, fertilizers and disease treatments for your crops"}
          </p>
        </div>

        {/* Crop Selector with Search */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === 'hi' ? "फसल खोजें..." : "Search any crop or fruit..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Check if entered value matches any crop
                  const matchedCrop = crops.find(c => 
                    c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    c.id.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  if (matchedCrop) {
                    setSelectedCrop(matchedCrop.id);
                  }
                }}
                className="pl-10 h-12 rounded-full border-2"
              />
            </div>
          </div>

          {/* Filtered Crop Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {crops
              .filter(crop => 
                searchQuery === "" || 
                crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.id.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((crop) => (
                <Button
                  key={crop.id}
                  variant={selectedCrop === crop.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCrop(crop.id);
                    setSearchQuery("");
                  }}
                  className="rounded-full"
                >
                  {crop.name}
                </Button>
              ))}
          </div>
        </div>

        <Tabs defaultValue="mandi" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="mandi" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? "मंडी भाव" : "Mandi Prices"}</span>
            </TabsTrigger>
            <TabsTrigger value="pesticides" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? "कीटनाशक" : "Pesticides"}</span>
            </TabsTrigger>
            <TabsTrigger value="fertilizers" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? "खाद" : "Fertilizers"}</span>
            </TabsTrigger>
            <TabsTrigger value="diseases" className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? "रोग" : "Diseases"}</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudSun className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? "मौसम" : "Weather"}</span>
            </TabsTrigger>
          </TabsList>

          {/* Mandi Prices Tab */}
          <TabsContent value="mandi">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {language === 'hi' 
                  ? "नोट: ये भाव संकेतक हैं और वास्तविक मंडी दरों से भिन्न हो सकते हैं। कृपया बेचने से पहले अपनी स्थानीय मंडी से संपर्क करें।" 
                  : "Note: These prices are indicative and may vary from actual mandi rates. Please contact your local mandi before selling."}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {(mandiPrices[selectedCrop] || []).map((price, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-primary" />
                        {price.market}
                      </span>
                      <Badge 
                        variant={price.trend === 'up' ? 'default' : price.trend === 'down' ? 'destructive' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {price.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {price.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        {price.trend === 'stable' && <Minus className="w-3 h-3" />}
                        {price.change}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-primary">₹{price.price.toLocaleString()}</span>
                      <span className="text-muted-foreground mb-1">/ {language === 'hi' ? "क्विंटल" : "quintal"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'hi' ? "आज का भाव" : "Today's rate"} • {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {(!mandiPrices[selectedCrop] || mandiPrices[selectedCrop].length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                <IndianRupee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'hi' ? "इस फसल के लिए मंडी भाव उपलब्ध नहीं है" : "Mandi prices not available for this crop"}</p>
              </div>
            )}
          </TabsContent>

          {/* Pesticides Tab */}
          <TabsContent value="pesticides">
            <div className="grid md:grid-cols-2 gap-6">
              {(pesticides[selectedCrop] || []).map((pesticide, index) => (
                <Card key={index} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="w-5 h-5 text-orange-500" />
                      {pesticide.name}
                    </CardTitle>
                    <CardDescription>{pesticide.target}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">{language === 'hi' ? "मात्रा" : "Dosage"}</Badge>
                      <span className="text-sm">{pesticide.dosage}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">{language === 'hi' ? "समय" : "Timing"}</Badge>
                      <span className="text-sm">{pesticide.timing}</span>
                    </div>
                    <div className="flex items-start gap-2 text-amber-600">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <span className="text-sm">{pesticide.safety}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fertilizers Tab */}
          <TabsContent value="fertilizers">
            <div className="grid md:grid-cols-2 gap-6">
              {(fertilizers[selectedCrop] || []).map((fertilizer, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      {fertilizer.name}
                    </CardTitle>
                    <CardDescription>{fertilizer.nutrients}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">{language === 'hi' ? "मात्रा" : "Application"}</Badge>
                      <span className="text-sm">{fertilizer.application}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">{language === 'hi' ? "समय" : "Timing"}</Badge>
                      <span className="text-sm">{fertilizer.timing}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Diseases Tab */}
          <TabsContent value="diseases">
            <div className="grid md:grid-cols-2 gap-6">
              {(diseases[selectedCrop] || []).map((disease, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-red-500" />
                      {disease.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="destructive" className="mb-2">{language === 'hi' ? "लक्षण" : "Symptoms"}</Badge>
                      <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">{language === 'hi' ? "उपचार" : "Treatment"}</Badge>
                      <p className="text-sm">{disease.treatment}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{language === 'hi' ? "रोकथाम" : "Prevention"}</Badge>
                      <p className="text-sm text-muted-foreground">{disease.prevention}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather">
            <div className="grid gap-4">
              {weatherAlerts.map((alert, index) => (
                <Card 
                  key={index} 
                  className={`border-l-4 ${
                    alert.type === 'warning' ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' :
                    alert.type === 'success' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' :
                    'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                      {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {alert.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                      {alert.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{alert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FarmingTools;
