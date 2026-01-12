import { useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Droplets, Sun, Scissors, Sprout, Bug, FlaskConical } from "lucide-react";

interface CropActivity {
  month: string;
  monthHi: string;
  activities: {
    type: "sowing" | "irrigation" | "fertilizer" | "pesticide" | "harvest";
    description: string;
    descriptionHi: string;
  }[];
}

interface CropCalendarData {
  name: string;
  nameHi: string;
  season: string;
  seasonHi: string;
  duration: string;
  durationHi: string;
  calendar: CropActivity[];
}

const cropsCalendarData: CropCalendarData[] = [
  {
    name: "Rice (Paddy)",
    nameHi: "धान (चावल)",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "120-150 days",
    durationHi: "120-150 दिन",
    calendar: [
      {
        month: "June",
        monthHi: "जून",
        activities: [
          { type: "sowing", description: "Prepare nursery beds, sow seeds", descriptionHi: "नर्सरी बेड तैयार करें, बीज बोएं" },
          { type: "irrigation", description: "Keep nursery moist", descriptionHi: "नर्सरी को नम रखें" },
        ],
      },
      {
        month: "July",
        monthHi: "जुलाई",
        activities: [
          { type: "sowing", description: "Transplant seedlings to main field", descriptionHi: "पौधों को मुख्य खेत में रोपें" },
          { type: "fertilizer", description: "Apply basal dose of NPK", descriptionHi: "NPK की बेसल डोज डालें" },
          { type: "irrigation", description: "Maintain 5cm standing water", descriptionHi: "5 सेमी खड़ा पानी बनाए रखें" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "fertilizer", description: "First top dressing of nitrogen", descriptionHi: "नाइट्रोजन की पहली टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for stem borer, apply pesticide if needed", descriptionHi: "तना छेदक की निगरानी करें, जरूरत हो तो कीटनाशक डालें" },
          { type: "irrigation", description: "Continue standing water", descriptionHi: "खड़ा पानी जारी रखें" },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "fertilizer", description: "Second top dressing of nitrogen", descriptionHi: "नाइट्रोजन की दूसरी टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Watch for leaf folder, blast disease", descriptionHi: "लीफ फोल्डर, ब्लास्ट रोग पर नजर रखें" },
        ],
      },
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "irrigation", description: "Reduce water before harvest", descriptionHi: "कटाई से पहले पानी कम करें" },
          { type: "harvest", description: "Harvest when grains are golden", descriptionHi: "जब दाने सुनहरे हों तब कटाई करें" },
        ],
      },
    ],
  },
  {
    name: "Wheat",
    nameHi: "गेहूं",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "120-150 days",
    durationHi: "120-150 दिन",
    calendar: [
      {
        month: "November",
        monthHi: "नवंबर",
        activities: [
          { type: "sowing", description: "Prepare field, sow seeds", descriptionHi: "खेत तैयार करें, बीज बोएं" },
          { type: "fertilizer", description: "Apply basal dose of NPK", descriptionHi: "NPK की बेसल डोज डालें" },
          { type: "irrigation", description: "First irrigation after sowing", descriptionHi: "बुवाई के बाद पहली सिंचाई" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Second irrigation at crown root stage", descriptionHi: "क्राउन रूट स्टेज पर दूसरी सिंचाई" },
          { type: "fertilizer", description: "First top dressing of nitrogen", descriptionHi: "नाइट्रोजन की पहली टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Third irrigation at tillering", descriptionHi: "कल्ले फूटने पर तीसरी सिंचाई" },
          { type: "pesticide", description: "Monitor for aphids, rust", descriptionHi: "माहू, रतुआ की निगरानी करें" },
        ],
      },
      {
        month: "February",
        monthHi: "फरवरी",
        activities: [
          { type: "irrigation", description: "Fourth irrigation at flowering", descriptionHi: "फूल आने पर चौथी सिंचाई" },
          { type: "fertilizer", description: "Foliar spray of urea if needed", descriptionHi: "जरूरत हो तो यूरिया का पर्णीय छिड़काव" },
        ],
      },
      {
        month: "March",
        monthHi: "मार्च",
        activities: [
          { type: "irrigation", description: "Fifth irrigation at grain filling", descriptionHi: "दाना भरने पर पांचवीं सिंचाई" },
        ],
      },
      {
        month: "April",
        monthHi: "अप्रैल",
        activities: [
          { type: "harvest", description: "Harvest when grains are hard", descriptionHi: "जब दाने कड़े हों तब कटाई करें" },
        ],
      },
    ],
  },
  {
    name: "Mustard",
    nameHi: "सरसों",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "110-140 days",
    durationHi: "110-140 दिन",
    calendar: [
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "sowing", description: "Prepare field, sow seeds", descriptionHi: "खेत तैयार करें, बीज बोएं" },
          { type: "fertilizer", description: "Apply basal dose of NPK", descriptionHi: "NPK की बेसल डोज डालें" },
        ],
      },
      {
        month: "November",
        monthHi: "नवंबर",
        activities: [
          { type: "irrigation", description: "First irrigation 30-35 days after sowing", descriptionHi: "बुवाई के 30-35 दिन बाद पहली सिंचाई" },
          { type: "pesticide", description: "Monitor for aphids", descriptionHi: "माहू की निगरानी करें" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Second irrigation at flowering", descriptionHi: "फूल आने पर दूसरी सिंचाई" },
          { type: "pesticide", description: "Apply pesticide for aphids if needed", descriptionHi: "जरूरत हो तो माहू के लिए कीटनाशक" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Third irrigation at pod formation", descriptionHi: "फली बनने पर तीसरी सिंचाई" },
        ],
      },
      {
        month: "February",
        monthHi: "फरवरी",
        activities: [
          { type: "harvest", description: "Harvest when pods turn yellow", descriptionHi: "जब फलियां पीली हों तब कटाई करें" },
        ],
      },
    ],
  },
  {
    name: "Sugarcane",
    nameHi: "गन्ना",
    season: "Year-round",
    seasonHi: "साल भर",
    duration: "10-12 months",
    durationHi: "10-12 महीने",
    calendar: [
      {
        month: "February-March",
        monthHi: "फरवरी-मार्च",
        activities: [
          { type: "sowing", description: "Plant setts in furrows", descriptionHi: "नालियों में पेड़ी लगाएं" },
          { type: "fertilizer", description: "Apply basal dose of NPK", descriptionHi: "NPK की बेसल डोज डालें" },
          { type: "irrigation", description: "Light irrigation after planting", descriptionHi: "रोपण के बाद हल्की सिंचाई" },
        ],
      },
      {
        month: "April-May",
        monthHi: "अप्रैल-मई",
        activities: [
          { type: "irrigation", description: "Regular irrigation every 7-10 days", descriptionHi: "हर 7-10 दिन नियमित सिंचाई" },
          { type: "fertilizer", description: "First top dressing of nitrogen", descriptionHi: "नाइट्रोजन की पहली टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Watch for early shoot borer", descriptionHi: "अर्ली शूट बोरर पर नजर रखें" },
        ],
      },
      {
        month: "June-July",
        monthHi: "जून-जुलाई",
        activities: [
          { type: "fertilizer", description: "Second top dressing, earthing up", descriptionHi: "दूसरी टॉप ड्रेसिंग, मिट्टी चढ़ाएं" },
          { type: "irrigation", description: "Continue regular irrigation", descriptionHi: "नियमित सिंचाई जारी रखें" },
        ],
      },
      {
        month: "August-September",
        monthHi: "अगस्त-सितंबर",
        activities: [
          { type: "pesticide", description: "Monitor for top borer, red rot", descriptionHi: "टॉप बोरर, लाल सड़न की निगरानी" },
          { type: "irrigation", description: "Reduce irrigation frequency", descriptionHi: "सिंचाई की बारंबारता कम करें" },
        ],
      },
      {
        month: "November-March",
        monthHi: "नवंबर-मार्च",
        activities: [
          { type: "harvest", description: "Harvest when sugar content is maximum", descriptionHi: "जब चीनी अधिकतम हो तब कटाई करें" },
        ],
      },
    ],
  },
  {
    name: "Cotton",
    nameHi: "कपास",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "150-180 days",
    durationHi: "150-180 दिन",
    calendar: [
      {
        month: "May-June",
        monthHi: "मई-जून",
        activities: [
          { type: "sowing", description: "Sow seeds with first monsoon shower", descriptionHi: "पहली मानसून बारिश के साथ बीज बोएं" },
          { type: "fertilizer", description: "Apply basal dose of NPK", descriptionHi: "NPK की बेसल डोज डालें" },
        ],
      },
      {
        month: "July",
        monthHi: "जुलाई",
        activities: [
          { type: "irrigation", description: "If rain is inadequate, irrigate", descriptionHi: "अगर बारिश कम हो तो सिंचाई करें" },
          { type: "pesticide", description: "Monitor for sucking pests", descriptionHi: "रस चूसक कीटों की निगरानी करें" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "fertilizer", description: "First top dressing of nitrogen", descriptionHi: "नाइट्रोजन की पहली टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Watch for bollworm", descriptionHi: "बॉलवर्म पर नजर रखें" },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "fertilizer", description: "Second top dressing, potash application", descriptionHi: "दूसरी टॉप ड्रेसिंग, पोटाश डालें" },
          { type: "irrigation", description: "Critical irrigation at boll formation", descriptionHi: "बॉल बनने पर महत्वपूर्ण सिंचाई" },
        ],
      },
      {
        month: "October-December",
        monthHi: "अक्टूबर-दिसंबर",
        activities: [
          { type: "harvest", description: "Pick cotton in 3-4 pickings", descriptionHi: "3-4 बार में कपास चुनें" },
        ],
      },
    ],
  },
];

const activityIcons = {
  sowing: Sprout,
  irrigation: Droplets,
  fertilizer: FlaskConical,
  pesticide: Bug,
  harvest: Scissors,
};

const activityColors = {
  sowing: "bg-green-500/10 text-green-600 border-green-500/20",
  irrigation: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  fertilizer: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  pesticide: "bg-red-500/10 text-red-600 border-red-500/20",
  harvest: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const CropCalendar = () => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [selectedCrop, setSelectedCrop] = useState(cropsCalendarData[0].name);

  const currentCrop = cropsCalendarData.find(c => c.name === selectedCrop) || cropsCalendarData[0];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {isHindi ? "फसल कैलेंडर" : "Crop Calendar"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isHindi ? "महीने-वार खेती गतिविधियां" : "Month-wise Farming Activities"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isHindi 
                ? "अपनी फसल के लिए बुवाई, सिंचाई, खाद और कटाई का सही समय जानें"
                : "Know the right time for sowing, irrigation, fertilizer and harvesting for your crop"
              }
            </p>
          </div>

          <Tabs value={selectedCrop} onValueChange={setSelectedCrop} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
              {cropsCalendarData.map((crop) => (
                <TabsTrigger
                  key={crop.name}
                  value={crop.name}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-full border"
                >
                  {isHindi ? crop.nameHi : crop.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {cropsCalendarData.map((crop) => (
              <TabsContent key={crop.name} value={crop.name}>
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <CardTitle className="text-2xl">
                        {isHindi ? crop.nameHi : crop.name}
                      </CardTitle>
                      <Badge variant="outline" className="bg-primary/10">
                        {isHindi ? crop.seasonHi : crop.season}
                      </Badge>
                      <Badge variant="outline">
                        {isHindi ? crop.durationHi : crop.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid gap-4">
                  {crop.calendar.map((monthData, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 py-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          {isHindi ? monthData.monthHi : monthData.month}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid gap-3">
                          {monthData.activities.map((activity, actIndex) => {
                            const Icon = activityIcons[activity.type];
                            return (
                              <div
                                key={actIndex}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${activityColors[activity.type]}`}
                              >
                                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                  <Badge variant="outline" className="mb-1 text-xs">
                                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                  </Badge>
                                  <p className="text-sm">
                                    {isHindi ? activity.descriptionHi : activity.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Legend */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">
                {isHindi ? "गतिविधि प्रकार" : "Activity Types"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {Object.entries(activityIcons).map(([type, Icon]) => (
                  <div key={type} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${activityColors[type as keyof typeof activityColors]}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CropCalendar;
