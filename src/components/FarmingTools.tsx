import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bug, Leaf, Thermometer, CloudSun, AlertTriangle, CheckCircle, Info, Search } from "lucide-react";

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

const FarmingTools = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [customCrop, setCustomCrop] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const crops = [
    { id: "rice", name: language === 'hi' ? "चावल" : "Rice" },
    { id: "wheat", name: language === 'hi' ? "गेहूं" : "Wheat" },
    { id: "cotton", name: language === 'hi' ? "कपास" : "Cotton" },
    { id: "sugarcane", name: language === 'hi' ? "गन्ना" : "Sugarcane" },
    { id: "corn", name: language === 'hi' ? "मक्का" : "Corn" },
    { id: "potato", name: language === 'hi' ? "आलू" : "Potato" },
    { id: "tomato", name: language === 'hi' ? "टमाटर" : "Tomato" },
    { id: "onion", name: language === 'hi' ? "प्याज" : "Onion" },
    { id: "soybean", name: language === 'hi' ? "सोयाबीन" : "Soybean" },
    { id: "mustard", name: language === 'hi' ? "सरसों" : "Mustard" },
    { id: "groundnut", name: language === 'hi' ? "मूंगफली" : "Groundnut" },
    { id: "chilli", name: language === 'hi' ? "मिर्च" : "Chilli" },
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
                placeholder={language === 'hi' ? "फसल खोजें या लिखें..." : "Search or type crop name..."}
                value={customCrop}
                onChange={(e) => {
                  setCustomCrop(e.target.value);
                  if (e.target.value) {
                    setShowCustomInput(true);
                    // Check if entered value matches any crop
                    const matchedCrop = crops.find(c => 
                      c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      c.id.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    if (matchedCrop) {
                      setSelectedCrop(matchedCrop.id);
                    }
                  } else {
                    setShowCustomInput(false);
                  }
                }}
                className="pl-10 h-12 rounded-full border-2"
              />
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {crops.map((crop) => (
              <Button
                key={crop.id}
                variant={selectedCrop === crop.id && !showCustomInput ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCrop(crop.id);
                  setCustomCrop("");
                  setShowCustomInput(false);
                }}
                className="rounded-full"
              >
                {crop.name}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="pesticides" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
