import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Droplets, Scissors, Sprout, Bug, FlaskConical, Search, X, Loader2 } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  // Kharif Crops
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
  {
    name: "Moong (Green Gram)",
    nameHi: "मूंग",
    season: "Kharif/Zaid",
    seasonHi: "खरीफ/जायद",
    duration: "60-75 days",
    durationHi: "60-75 दिन",
    calendar: [
      {
        month: "March (Zaid)",
        monthHi: "मार्च (जायद)",
        activities: [
          { type: "sowing", description: "Sow seeds in lines 30cm apart", descriptionHi: "30 सेमी की दूरी पर कतारों में बोएं" },
          { type: "fertilizer", description: "Apply 20kg Nitrogen, 40kg Phosphorus/ha", descriptionHi: "20 किलो नाइट्रोजन, 40 किलो फास्फोरस/हेक्टेयर डालें" },
        ],
      },
      {
        month: "July (Kharif)",
        monthHi: "जुलाई (खरीफ)",
        activities: [
          { type: "sowing", description: "Sow with onset of monsoon", descriptionHi: "मानसून शुरू होते ही बोएं" },
          { type: "irrigation", description: "Usually rain-fed, irrigate if dry", descriptionHi: "आमतौर पर बारिश पर निर्भर, सूखा हो तो सिंचाई" },
        ],
      },
      {
        month: "April/August",
        monthHi: "अप्रैल/अगस्त",
        activities: [
          { type: "pesticide", description: "Spray for thrips, whitefly", descriptionHi: "थ्रिप्स, सफेद मक्खी के लिए स्प्रे करें" },
          { type: "irrigation", description: "One irrigation at flowering if needed", descriptionHi: "जरूरत हो तो फूल आने पर एक सिंचाई" },
        ],
      },
      {
        month: "May/September",
        monthHi: "मई/सितंबर",
        activities: [
          { type: "harvest", description: "Harvest when 80% pods turn black", descriptionHi: "जब 80% फलियां काली हों तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Urad (Black Gram)",
    nameHi: "उड़द",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "70-90 days",
    durationHi: "70-90 दिन",
    calendar: [
      {
        month: "June-July",
        monthHi: "जून-जुलाई",
        activities: [
          { type: "sowing", description: "Sow seeds 4-5cm deep in rows", descriptionHi: "4-5 सेमी गहरी कतारों में बीज बोएं" },
          { type: "fertilizer", description: "Apply 20kg N, 40kg P2O5/ha as basal", descriptionHi: "20 किलो N, 40 किलो P2O5/हे. बेसल में डालें" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "irrigation", description: "Irrigate if no rain for 15+ days", descriptionHi: "15+ दिन बारिश न हो तो सिंचाई करें" },
          { type: "pesticide", description: "Monitor for yellow mosaic virus", descriptionHi: "पीला मोज़ेक वायरस पर नजर रखें" },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "harvest", description: "Harvest when pods turn black", descriptionHi: "जब फलियां काली हों तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Maize (Corn)",
    nameHi: "मक्का",
    season: "Kharif/Rabi",
    seasonHi: "खरीफ/रबी",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "June-July (Kharif)",
        monthHi: "जून-जुलाई (खरीफ)",
        activities: [
          { type: "sowing", description: "Sow seeds 5cm deep, 60x20cm spacing", descriptionHi: "5 सेमी गहरे, 60x20 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 60kg N, 30kg P, 30kg K/ha", descriptionHi: "60 किलो N, 30 किलो P, 30 किलो K/हे. डालें" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "fertilizer", description: "Top dress nitrogen at knee-high stage", descriptionHi: "घुटने तक ऊंचाई पर नाइट्रोजन की टॉप ड्रेसिंग" },
          { type: "irrigation", description: "Critical irrigation at tasseling", descriptionHi: "नर मंजरी निकलने पर महत्वपूर्ण सिंचाई" },
          { type: "pesticide", description: "Watch for fall armyworm", descriptionHi: "फॉल आर्मीवर्म पर नजर रखें" },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "irrigation", description: "Irrigate at grain filling", descriptionHi: "दाना भरने पर सिंचाई करें" },
        ],
      },
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "harvest", description: "Harvest when husk turns brown", descriptionHi: "जब छिलका भूरा हो जाए तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Soybean",
    nameHi: "सोयाबीन",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "90-100 days",
    durationHi: "90-100 दिन",
    calendar: [
      {
        month: "June",
        monthHi: "जून",
        activities: [
          { type: "sowing", description: "Sow with onset of monsoon, 45x5cm spacing", descriptionHi: "मानसून शुरू होते ही 45x5 सेमी पर बोएं" },
          { type: "fertilizer", description: "Apply 20kg N, 60kg P2O5, 40kg K2O/ha", descriptionHi: "20 किलो N, 60 किलो P2O5, 40 किलो K2O/हे." },
        ],
      },
      {
        month: "July",
        monthHi: "जुलाई",
        activities: [
          { type: "pesticide", description: "Spray for girdle beetle if seen", descriptionHi: "गर्डल बीटल दिखे तो स्प्रे करें" },
          { type: "irrigation", description: "Usually rain-fed", descriptionHi: "आमतौर पर बारिश पर निर्भर" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "pesticide", description: "Monitor for semilooper, stem fly", descriptionHi: "सेमीलूपर, स्टेम फ्लाई पर नजर रखें" },
        ],
      },
      {
        month: "September-October",
        monthHi: "सितंबर-अक्टूबर",
        activities: [
          { type: "harvest", description: "Harvest when leaves turn yellow and drop", descriptionHi: "जब पत्ते पीले होकर गिरें तब कटाई" },
        ],
      },
    ],
  },
  {
    name: "Groundnut (Peanut)",
    nameHi: "मूंगफली",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "100-130 days",
    durationHi: "100-130 दिन",
    calendar: [
      {
        month: "June-July",
        monthHi: "जून-जुलाई",
        activities: [
          { type: "sowing", description: "Sow kernels 5cm deep, 30x10cm spacing", descriptionHi: "5 सेमी गहरे, 30x10 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply gypsum 500kg/ha at flowering", descriptionHi: "फूल आने पर 500 किलो जिप्सम/हे. डालें" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "irrigation", description: "Critical at pegging and pod formation", descriptionHi: "पेगिंग और फली बनने पर महत्वपूर्ण सिंचाई" },
          { type: "pesticide", description: "Monitor for leaf miner, tikka disease", descriptionHi: "लीफ माइनर, टिक्का रोग पर नजर रखें" },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "irrigation", description: "Light irrigation if needed", descriptionHi: "जरूरत हो तो हल्की सिंचाई" },
        ],
      },
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "harvest", description: "Uproot when leaves yellow, shell mature", descriptionHi: "पत्ते पीले और फली पक जाए तब उखाड़ें" },
        ],
      },
    ],
  },
  // Rabi Crops
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
    name: "Chana (Chickpea)",
    nameHi: "चना",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "100-120 days",
    durationHi: "100-120 दिन",
    calendar: [
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "sowing", description: "Sow seeds 8-10cm deep, 30x10cm spacing", descriptionHi: "8-10 सेमी गहरे, 30x10 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 20kg N, 40kg P2O5/ha", descriptionHi: "20 किलो N, 40 किलो P2O5/हे. डालें" },
        ],
      },
      {
        month: "November",
        monthHi: "नवंबर",
        activities: [
          { type: "irrigation", description: "First light irrigation if needed", descriptionHi: "जरूरत हो तो पहली हल्की सिंचाई" },
          { type: "pesticide", description: "Watch for pod borer", descriptionHi: "फली छेदक पर नजर रखें" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "One irrigation at flowering", descriptionHi: "फूल आने पर एक सिंचाई" },
          { type: "pesticide", description: "Spray for Helicoverpa if needed", descriptionHi: "जरूरत हो तो हेलिकोवर्पा के लिए स्प्रे" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Light irrigation at pod filling", descriptionHi: "फली भरने पर हल्की सिंचाई" },
        ],
      },
      {
        month: "February-March",
        monthHi: "फरवरी-मार्च",
        activities: [
          { type: "harvest", description: "Harvest when pods turn brown", descriptionHi: "जब फलियां भूरी हों तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Masoor (Lentil)",
    nameHi: "मसूर",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "100-120 days",
    durationHi: "100-120 दिन",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Sow 3-4cm deep, 25x5cm spacing", descriptionHi: "3-4 सेमी गहरे, 25x5 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 20kg N, 40kg P2O5/ha", descriptionHi: "20 किलो N, 40 किलो P2O5/हे." },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "One light irrigation if winter rains fail", descriptionHi: "सर्दी की बारिश न हो तो हल्की सिंचाई" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "pesticide", description: "Monitor for rust, wilt", descriptionHi: "रतुआ, उकठा पर नजर रखें" },
        ],
      },
      {
        month: "February-March",
        monthHi: "फरवरी-मार्च",
        activities: [
          { type: "harvest", description: "Harvest when pods turn yellow-brown", descriptionHi: "जब फलियां पीली-भूरी हों तब कटाई" },
        ],
      },
    ],
  },
  {
    name: "Barley",
    nameHi: "जौ",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "110-130 days",
    durationHi: "110-130 दिन",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Sow seeds 5cm deep, 22cm row spacing", descriptionHi: "5 सेमी गहरे, 22 सेमी कतार दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 60kg N, 30kg P2O5/ha", descriptionHi: "60 किलो N, 30 किलो P2O5/हे." },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "First irrigation at tillering", descriptionHi: "कल्ले फूटने पर पहली सिंचाई" },
          { type: "fertilizer", description: "Top dress nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Second irrigation at jointing", descriptionHi: "गांठ बनने पर दूसरी सिंचाई" },
        ],
      },
      {
        month: "February",
        monthHi: "फरवरी",
        activities: [
          { type: "irrigation", description: "Third irrigation at heading", descriptionHi: "बालियां निकलने पर तीसरी सिंचाई" },
          { type: "pesticide", description: "Monitor for aphids, stripe disease", descriptionHi: "माहू, स्ट्राइप रोग पर नजर रखें" },
        ],
      },
      {
        month: "March-April",
        monthHi: "मार्च-अप्रैल",
        activities: [
          { type: "harvest", description: "Harvest when grains are hard", descriptionHi: "जब दाने कड़े हों तब कटाई" },
        ],
      },
    ],
  },
  // Vegetables
  {
    name: "Potato",
    nameHi: "आलू",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "80-100 days",
    durationHi: "80-100 दिन",
    calendar: [
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "sowing", description: "Plant tubers 5-7cm deep, 60x20cm spacing", descriptionHi: "5-7 सेमी गहरे, 60x20 सेमी दूरी पर कंद लगाएं" },
          { type: "fertilizer", description: "Apply 120kg N, 80kg P, 80kg K/ha", descriptionHi: "120 किलो N, 80 किलो P, 80 किलो K/हे." },
          { type: "irrigation", description: "Light irrigation after planting", descriptionHi: "रोपण के बाद हल्की सिंचाई" },
        ],
      },
      {
        month: "November",
        monthHi: "नवंबर",
        activities: [
          { type: "irrigation", description: "Regular irrigation every 10-12 days", descriptionHi: "हर 10-12 दिन नियमित सिंचाई" },
          { type: "fertilizer", description: "First earthing up and top dressing", descriptionHi: "पहली मिट्टी चढ़ाना और टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for late blight, aphids", descriptionHi: "झुलसा रोग, माहू पर नजर रखें" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "fertilizer", description: "Second earthing up", descriptionHi: "दूसरी बार मिट्टी चढ़ाएं" },
          { type: "pesticide", description: "Spray fungicide for late blight", descriptionHi: "झुलसा के लिए फंगीसाइड स्प्रे करें" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Stop irrigation 10-15 days before harvest", descriptionHi: "कटाई से 10-15 दिन पहले सिंचाई बंद करें" },
          { type: "harvest", description: "Harvest when vines dry", descriptionHi: "जब बेलें सूख जाएं तब खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Onion",
    nameHi: "प्याज",
    season: "Rabi/Kharif",
    seasonHi: "रबी/खरीफ",
    duration: "100-120 days",
    durationHi: "100-120 दिन",
    calendar: [
      {
        month: "September-October (Nursery)",
        monthHi: "सितंबर-अक्टूबर (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery beds", descriptionHi: "नर्सरी बेड में बीज बोएं" },
          { type: "irrigation", description: "Keep nursery moist", descriptionHi: "नर्सरी को नम रखें" },
        ],
      },
      {
        month: "November-December",
        monthHi: "नवंबर-दिसंबर",
        activities: [
          { type: "sowing", description: "Transplant 6-8 week old seedlings", descriptionHi: "6-8 सप्ताह पुराने पौधे रोपें" },
          { type: "fertilizer", description: "Apply 100kg N, 50kg P, 50kg K/ha", descriptionHi: "100 किलो N, 50 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Irrigate every 10-12 days", descriptionHi: "हर 10-12 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress with nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for purple blotch, thrips", descriptionHi: "पर्पल ब्लॉच, थ्रिप्स पर नजर रखें" },
        ],
      },
      {
        month: "February",
        monthHi: "फरवरी",
        activities: [
          { type: "irrigation", description: "Critical irrigation at bulb formation", descriptionHi: "बल्ब बनने पर महत्वपूर्ण सिंचाई" },
        ],
      },
      {
        month: "March-April",
        monthHi: "मार्च-अप्रैल",
        activities: [
          { type: "irrigation", description: "Stop irrigation when necks soften", descriptionHi: "जब गर्दन नरम हो तब सिंचाई बंद करें" },
          { type: "harvest", description: "Harvest when tops fall over", descriptionHi: "जब ऊपरी भाग गिर जाए तब खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Tomato",
    nameHi: "टमाटर",
    season: "Rabi/Year-round",
    seasonHi: "रबी/साल भर",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "September (Nursery)",
        monthHi: "सितंबर (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in raised nursery beds", descriptionHi: "उठी हुई नर्सरी में बीज बोएं" },
          { type: "irrigation", description: "Keep nursery moist", descriptionHi: "नर्सरी को नम रखें" },
        ],
      },
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Transplant 4-5 week old seedlings, 60x45cm", descriptionHi: "4-5 सप्ताह पुराने पौधे 60x45 सेमी पर रोपें" },
          { type: "fertilizer", description: "Apply 120kg N, 60kg P, 60kg K/ha", descriptionHi: "120 किलो N, 60 किलो P, 60 किलो K/हे." },
          { type: "irrigation", description: "Irrigate after transplanting", descriptionHi: "रोपण के बाद सिंचाई करें" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Irrigate every 7-8 days", descriptionHi: "हर 7-8 दिन सिंचाई करें" },
          { type: "fertilizer", description: "First top dressing of nitrogen", descriptionHi: "नाइट्रोजन की पहली टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Stake plants, spray for early blight", descriptionHi: "पौधों को सहारा दें, झुलसा के लिए स्प्रे" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "fertilizer", description: "Second top dressing", descriptionHi: "दूसरी टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for fruit borer, leaf curl virus", descriptionHi: "फल छेदक, लीफ कर्ल वायरस पर नजर रखें" },
        ],
      },
      {
        month: "February-April",
        monthHi: "फरवरी-अप्रैल",
        activities: [
          { type: "harvest", description: "Harvest at mature green or ripe stage", descriptionHi: "हरे पके या पूरे पके फल तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Brinjal (Eggplant)",
    nameHi: "बैंगन",
    season: "Year-round",
    seasonHi: "साल भर",
    duration: "120-150 days",
    durationHi: "120-150 दिन",
    calendar: [
      {
        month: "June-July (Kharif Nursery)",
        monthHi: "जून-जुलाई (खरीफ नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery", descriptionHi: "नर्सरी में बीज बोएं" },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "sowing", description: "Transplant seedlings 60x60cm spacing", descriptionHi: "60x60 सेमी दूरी पर पौधे रोपें" },
          { type: "fertilizer", description: "Apply 150kg N, 75kg P, 50kg K/ha", descriptionHi: "150 किलो N, 75 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "September",
        monthHi: "सितंबर",
        activities: [
          { type: "irrigation", description: "Irrigate every 5-7 days", descriptionHi: "हर 5-7 दिन सिंचाई करें" },
          { type: "pesticide", description: "Monitor for fruit & shoot borer", descriptionHi: "फल और तना छेदक पर नजर रखें" },
        ],
      },
      {
        month: "October onwards",
        monthHi: "अक्टूबर से आगे",
        activities: [
          { type: "harvest", description: "Harvest every 5-7 days when tender", descriptionHi: "हर 5-7 दिन नरम फल तोड़ें" },
          { type: "fertilizer", description: "Apply nitrogen after each harvest", descriptionHi: "हर तुड़ाई के बाद नाइट्रोजन डालें" },
        ],
      },
    ],
  },
  {
    name: "Cabbage",
    nameHi: "पत्ता गोभी",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "September (Nursery)",
        monthHi: "सितंबर (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery beds", descriptionHi: "नर्सरी में बीज बोएं" },
        ],
      },
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Transplant 4-5 week seedlings, 45x45cm", descriptionHi: "4-5 सप्ताह पुराने पौधे 45x45 सेमी पर रोपें" },
          { type: "fertilizer", description: "Apply 120kg N, 60kg P, 60kg K/ha", descriptionHi: "120 किलो N, 60 किलो P, 60 किलो K/हे." },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Irrigate every 10-15 days", descriptionHi: "हर 10-15 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress with nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for diamondback moth", descriptionHi: "डायमंडबैक मोथ पर नजर रखें" },
        ],
      },
      {
        month: "January-February",
        monthHi: "जनवरी-फरवरी",
        activities: [
          { type: "harvest", description: "Harvest when heads are firm and compact", descriptionHi: "जब सिर मजबूत और गोल हो तब काटें" },
        ],
      },
    ],
  },
  {
    name: "Cauliflower",
    nameHi: "फूल गोभी",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "August-September (Nursery)",
        monthHi: "अगस्त-सितंबर (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery", descriptionHi: "नर्सरी में बीज बोएं" },
        ],
      },
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "sowing", description: "Transplant 4-6 week seedlings, 60x45cm", descriptionHi: "4-6 सप्ताह पुराने पौधे 60x45 सेमी पर रोपें" },
          { type: "fertilizer", description: "Apply 150kg N, 80kg P, 80kg K/ha", descriptionHi: "150 किलो N, 80 किलो P, 80 किलो K/हे." },
        ],
      },
      {
        month: "November",
        monthHi: "नवंबर",
        activities: [
          { type: "irrigation", description: "Irrigate every 8-10 days", descriptionHi: "हर 8-10 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress nitrogen in 2 splits", descriptionHi: "2 बार में नाइट्रोजन की टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "pesticide", description: "Monitor for black rot, curd borer", descriptionHi: "ब्लैक रॉट, कर्ड बोरर पर नजर रखें" },
        ],
      },
      {
        month: "January-February",
        monthHi: "जनवरी-फरवरी",
        activities: [
          { type: "harvest", description: "Harvest when curds are compact", descriptionHi: "जब फूल मजबूत हों तब काटें" },
        ],
      },
    ],
  },
  {
    name: "Carrot",
    nameHi: "गाजर",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "90-100 days",
    durationHi: "90-100 दिन",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Sow seeds 1cm deep in rows 30cm apart", descriptionHi: "1 सेमी गहरे, 30 सेमी कतार दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 60kg N, 50kg P, 50kg K/ha", descriptionHi: "60 किलो N, 50 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Light irrigation every 8-10 days", descriptionHi: "हर 8-10 दिन हल्की सिंचाई" },
          { type: "fertilizer", description: "Thin seedlings 5cm apart", descriptionHi: "पौधों को 5 सेमी दूरी पर छांटें" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Continue regular irrigation", descriptionHi: "नियमित सिंचाई जारी रखें" },
        ],
      },
      {
        month: "February-March",
        monthHi: "फरवरी-मार्च",
        activities: [
          { type: "harvest", description: "Harvest when roots are well developed", descriptionHi: "जब जड़ें अच्छी बन जाएं तब खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Radish",
    nameHi: "मूली",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "25-45 days",
    durationHi: "25-45 दिन",
    calendar: [
      {
        month: "September-February (Any month)",
        monthHi: "सितंबर-फरवरी (कोई भी महीना)",
        activities: [
          { type: "sowing", description: "Sow seeds 2cm deep, 30x8cm spacing", descriptionHi: "2 सेमी गहरे, 30x8 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 40kg N, 30kg P/ha", descriptionHi: "40 किलो N, 30 किलो P/हे." },
        ],
      },
      {
        month: "10-15 days after sowing",
        monthHi: "बुवाई के 10-15 दिन बाद",
        activities: [
          { type: "irrigation", description: "Light irrigation every 5-7 days", descriptionHi: "हर 5-7 दिन हल्की सिंचाई" },
        ],
      },
      {
        month: "25-45 days after sowing",
        monthHi: "बुवाई के 25-45 दिन बाद",
        activities: [
          { type: "harvest", description: "Harvest before roots become pithy", descriptionHi: "जड़ें फोक होने से पहले खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Peas",
    nameHi: "मटर",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Sow seeds 4-5cm deep, 30x10cm spacing", descriptionHi: "4-5 सेमी गहरे, 30x10 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 20kg N, 60kg P, 40kg K/ha", descriptionHi: "20 किलो N, 60 किलो P, 40 किलो K/हे." },
        ],
      },
      {
        month: "December",
        monthHi: "दिसंबर",
        activities: [
          { type: "irrigation", description: "Light irrigation every 15 days", descriptionHi: "हर 15 दिन हल्की सिंचाई" },
          { type: "pesticide", description: "Monitor for powdery mildew, aphids", descriptionHi: "पाउडरी मिल्ड्यू, माहू पर नजर रखें" },
        ],
      },
      {
        month: "January",
        monthHi: "जनवरी",
        activities: [
          { type: "irrigation", description: "Critical irrigation at flowering", descriptionHi: "फूल आने पर महत्वपूर्ण सिंचाई" },
        ],
      },
      {
        month: "February-March",
        monthHi: "फरवरी-मार्च",
        activities: [
          { type: "harvest", description: "Harvest green pods when well filled", descriptionHi: "जब फलियां अच्छी भर जाएं तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Capsicum (Bell Pepper)",
    nameHi: "शिमला मिर्च",
    season: "Rabi/Year-round",
    seasonHi: "रबी/साल भर",
    duration: "90-120 days",
    durationHi: "90-120 दिन",
    calendar: [
      {
        month: "August-September (Nursery)",
        monthHi: "अगस्त-सितंबर (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery beds", descriptionHi: "नर्सरी में बीज बोएं" },
        ],
      },
      {
        month: "October",
        monthHi: "अक्टूबर",
        activities: [
          { type: "sowing", description: "Transplant 5-6 week seedlings, 60x45cm", descriptionHi: "5-6 सप्ताह पुराने पौधे 60x45 सेमी पर रोपें" },
          { type: "fertilizer", description: "Apply 100kg N, 60kg P, 80kg K/ha", descriptionHi: "100 किलो N, 60 किलो P, 80 किलो K/हे." },
        ],
      },
      {
        month: "November-December",
        monthHi: "नवंबर-दिसंबर",
        activities: [
          { type: "irrigation", description: "Irrigate every 5-7 days", descriptionHi: "हर 5-7 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress with nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
          { type: "pesticide", description: "Monitor for thrips, fruit rot", descriptionHi: "थ्रिप्स, फल सड़न पर नजर रखें" },
        ],
      },
      {
        month: "January onwards",
        monthHi: "जनवरी से आगे",
        activities: [
          { type: "harvest", description: "Harvest at green or colored stage", descriptionHi: "हरे या रंगीन फल तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Green Chilli",
    nameHi: "हरी मिर्च",
    season: "Kharif/Year-round",
    seasonHi: "खरीफ/साल भर",
    duration: "120-150 days",
    durationHi: "120-150 दिन",
    calendar: [
      {
        month: "May-June (Nursery)",
        monthHi: "मई-जून (नर्सरी)",
        activities: [
          { type: "sowing", description: "Sow seeds in nursery", descriptionHi: "नर्सरी में बीज बोएं" },
        ],
      },
      {
        month: "July",
        monthHi: "जुलाई",
        activities: [
          { type: "sowing", description: "Transplant seedlings 60x45cm", descriptionHi: "60x45 सेमी दूरी पर पौधे रोपें" },
          { type: "fertilizer", description: "Apply 100kg N, 50kg P, 50kg K/ha", descriptionHi: "100 किलो N, 50 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "August",
        monthHi: "अगस्त",
        activities: [
          { type: "irrigation", description: "Irrigate every 7-10 days", descriptionHi: "हर 7-10 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "September onwards",
        monthHi: "सितंबर से आगे",
        activities: [
          { type: "pesticide", description: "Monitor for thrips, mites, leaf curl", descriptionHi: "थ्रिप्स, माइट्स, लीफ कर्ल पर नजर रखें" },
          { type: "harvest", description: "Harvest green chillies every 7-10 days", descriptionHi: "हर 7-10 दिन हरी मिर्च तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Bottle Gourd (Lauki)",
    nameHi: "लौकी (घीया)",
    season: "Kharif/Zaid",
    seasonHi: "खरीफ/जायद",
    duration: "55-60 days first harvest",
    durationHi: "55-60 दिन पहली तुड़ाई",
    calendar: [
      {
        month: "February-March (Zaid)",
        monthHi: "फरवरी-मार्च (जायद)",
        activities: [
          { type: "sowing", description: "Sow seeds 2-3cm deep, 3x2m spacing", descriptionHi: "2-3 सेमी गहरे, 3x2 मी. दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 60kg N, 40kg P, 40kg K/ha", descriptionHi: "60 किलो N, 40 किलो P, 40 किलो K/हे." },
        ],
      },
      {
        month: "June-July (Kharif)",
        monthHi: "जून-जुलाई (खरीफ)",
        activities: [
          { type: "sowing", description: "Sow with onset of monsoon", descriptionHi: "मानसून शुरू होते ही बोएं" },
          { type: "irrigation", description: "Irrigate every 4-5 days", descriptionHi: "हर 4-5 दिन सिंचाई करें" },
        ],
      },
      {
        month: "Throughout growing season",
        monthHi: "पूरे बढ़वार के दौरान",
        activities: [
          { type: "fertilizer", description: "Apply nitrogen after each harvest", descriptionHi: "हर तुड़ाई के बाद नाइट्रोजन डालें" },
          { type: "pesticide", description: "Monitor for fruit fly, powdery mildew", descriptionHi: "फ्रूट फ्लाई, पाउडरी मिल्ड्यू पर नजर रखें" },
          { type: "harvest", description: "Harvest tender fruits every 3-4 days", descriptionHi: "हर 3-4 दिन नरम फल तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Bitter Gourd (Karela)",
    nameHi: "करेला",
    season: "Kharif/Zaid",
    seasonHi: "खरीफ/जायद",
    duration: "55-60 days first harvest",
    durationHi: "55-60 दिन पहली तुड़ाई",
    calendar: [
      {
        month: "February-March (Zaid)",
        monthHi: "फरवरी-मार्च (जायद)",
        activities: [
          { type: "sowing", description: "Soak seeds 24hrs, sow 2cm deep, 2x1.5m", descriptionHi: "बीज 24 घंटे भिगोएं, 2 सेमी गहरे, 2x1.5 मी. पर बोएं" },
          { type: "fertilizer", description: "Apply 50kg N, 40kg P, 30kg K/ha", descriptionHi: "50 किलो N, 40 किलो P, 30 किलो K/हे." },
        ],
      },
      {
        month: "June-July (Kharif)",
        monthHi: "जून-जुलाई (खरीफ)",
        activities: [
          { type: "sowing", description: "Sow with monsoon", descriptionHi: "मानसून के साथ बोएं" },
          { type: "irrigation", description: "Irrigate every 4-5 days", descriptionHi: "हर 4-5 दिन सिंचाई करें" },
        ],
      },
      {
        month: "Throughout growing season",
        monthHi: "पूरे बढ़वार के दौरान",
        activities: [
          { type: "pesticide", description: "Monitor for fruit fly, aphids", descriptionHi: "फ्रूट फ्लाई, माहू पर नजर रखें" },
          { type: "harvest", description: "Harvest when fruits are green, tender", descriptionHi: "जब फल हरे और नरम हों तब तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Cucumber (Kheera)",
    nameHi: "खीरा",
    season: "Zaid/Kharif",
    seasonHi: "जायद/खरीफ",
    duration: "45-50 days first harvest",
    durationHi: "45-50 दिन पहली तुड़ाई",
    calendar: [
      {
        month: "February-March (Zaid)",
        monthHi: "फरवरी-मार्च (जायद)",
        activities: [
          { type: "sowing", description: "Sow seeds 2cm deep, 1.5x0.6m spacing", descriptionHi: "2 सेमी गहरे, 1.5x0.6 मी. दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 60kg N, 40kg P, 40kg K/ha", descriptionHi: "60 किलो N, 40 किलो P, 40 किलो K/हे." },
        ],
      },
      {
        month: "June-July (Kharif)",
        monthHi: "जून-जुलाई (खरीफ)",
        activities: [
          { type: "sowing", description: "Sow with monsoon onset", descriptionHi: "मानसून शुरू होते ही बोएं" },
        ],
      },
      {
        month: "Growing season",
        monthHi: "बढ़वार का समय",
        activities: [
          { type: "irrigation", description: "Irrigate every 3-4 days", descriptionHi: "हर 3-4 दिन सिंचाई करें" },
          { type: "pesticide", description: "Monitor for downy mildew, fruit fly", descriptionHi: "डाउनी मिल्ड्यू, फ्रूट फ्लाई पर नजर रखें" },
          { type: "harvest", description: "Harvest every 2-3 days when tender", descriptionHi: "हर 2-3 दिन नरम फल तोड़ें" },
        ],
      },
    ],
  },
  {
    name: "Spinach (Palak)",
    nameHi: "पालक",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "25-30 days first cut",
    durationHi: "25-30 दिन पहली कटाई",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Sow seeds 2cm deep, broadcast or 20cm rows", descriptionHi: "2 सेमी गहरे, छिटकाकर या 20 सेमी कतार में बोएं" },
          { type: "fertilizer", description: "Apply 50kg N, 30kg P/ha", descriptionHi: "50 किलो N, 30 किलो P/हे." },
        ],
      },
      {
        month: "November-December",
        monthHi: "नवंबर-दिसंबर",
        activities: [
          { type: "irrigation", description: "Light irrigation every 10-15 days", descriptionHi: "हर 10-15 दिन हल्की सिंचाई" },
          { type: "fertilizer", description: "Apply nitrogen after each cutting", descriptionHi: "हर कटाई के बाद नाइट्रोजन डालें" },
        ],
      },
      {
        month: "Every 15-20 days",
        monthHi: "हर 15-20 दिन",
        activities: [
          { type: "harvest", description: "Cut leaves 2-3cm above ground", descriptionHi: "जमीन से 2-3 सेमी ऊपर पत्ते काटें" },
        ],
      },
    ],
  },
  {
    name: "Coriander (Dhaniya)",
    nameHi: "धनिया",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "30-40 days (leaves), 90-110 (seeds)",
    durationHi: "30-40 दिन (पत्ते), 90-110 (बीज)",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Crush seeds gently, sow 1.5cm deep, 20cm rows", descriptionHi: "बीज हल्के कुचलें, 1.5 सेमी गहरे, 20 सेमी कतार में बोएं" },
          { type: "fertilizer", description: "Apply 40kg N, 30kg P/ha", descriptionHi: "40 किलो N, 30 किलो P/हे." },
        ],
      },
      {
        month: "November-December",
        monthHi: "नवंबर-दिसंबर",
        activities: [
          { type: "irrigation", description: "Light irrigation every 15-20 days", descriptionHi: "हर 15-20 दिन हल्की सिंचाई" },
        ],
      },
      {
        month: "December (for leaves)",
        monthHi: "दिसंबर (पत्तों के लिए)",
        activities: [
          { type: "harvest", description: "Cut leaves when 15cm tall", descriptionHi: "जब 15 सेमी ऊंचे हों तब पत्ते काटें" },
        ],
      },
      {
        month: "February-March (for seeds)",
        monthHi: "फरवरी-मार्च (बीज के लिए)",
        activities: [
          { type: "harvest", description: "Harvest when seeds turn brown", descriptionHi: "जब बीज भूरे हों तब कटाई करें" },
        ],
      },
    ],
  },
  {
    name: "Garlic",
    nameHi: "लहसुन",
    season: "Rabi",
    seasonHi: "रबी",
    duration: "130-150 days",
    durationHi: "130-150 दिन",
    calendar: [
      {
        month: "October-November",
        monthHi: "अक्टूबर-नवंबर",
        activities: [
          { type: "sowing", description: "Plant cloves 5cm deep, 15x7.5cm spacing", descriptionHi: "5 सेमी गहरे, 15x7.5 सेमी दूरी पर कलियां लगाएं" },
          { type: "fertilizer", description: "Apply 100kg N, 50kg P, 50kg K/ha", descriptionHi: "100 किलो N, 50 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "December-January",
        monthHi: "दिसंबर-जनवरी",
        activities: [
          { type: "irrigation", description: "Irrigate every 10-15 days", descriptionHi: "हर 10-15 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress with nitrogen", descriptionHi: "नाइट्रोजन की टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "February",
        monthHi: "फरवरी",
        activities: [
          { type: "irrigation", description: "Stop irrigation 15-20 days before harvest", descriptionHi: "कटाई से 15-20 दिन पहले सिंचाई बंद करें" },
          { type: "pesticide", description: "Monitor for purple blotch, thrips", descriptionHi: "पर्पल ब्लॉच, थ्रिप्स पर नजर रखें" },
        ],
      },
      {
        month: "March-April",
        monthHi: "मार्च-अप्रैल",
        activities: [
          { type: "harvest", description: "Harvest when tops fall over", descriptionHi: "जब ऊपरी भाग गिर जाए तब खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Ginger",
    nameHi: "अदरक",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "8-10 months",
    durationHi: "8-10 महीने",
    calendar: [
      {
        month: "April-May",
        monthHi: "अप्रैल-मई",
        activities: [
          { type: "sowing", description: "Plant rhizomes 5cm deep, 25x25cm spacing", descriptionHi: "5 सेमी गहरे, 25x25 सेमी दूरी पर गांठें लगाएं" },
          { type: "fertilizer", description: "Apply 75kg N, 50kg P, 50kg K/ha", descriptionHi: "75 किलो N, 50 किलो P, 50 किलो K/हे." },
        ],
      },
      {
        month: "June-July",
        monthHi: "जून-जुलाई",
        activities: [
          { type: "irrigation", description: "Irrigate if no rain", descriptionHi: "बारिश न हो तो सिंचाई करें" },
          { type: "fertilizer", description: "First earthing up and mulching", descriptionHi: "पहली मिट्टी चढ़ाना और मल्चिंग" },
        ],
      },
      {
        month: "August-September",
        monthHi: "अगस्त-सितंबर",
        activities: [
          { type: "fertilizer", description: "Second and third earthing up", descriptionHi: "दूसरी और तीसरी मिट्टी चढ़ाएं" },
          { type: "pesticide", description: "Monitor for soft rot, shoot borer", descriptionHi: "सॉफ्ट रॉट, शूट बोरर पर नजर रखें" },
        ],
      },
      {
        month: "December-February",
        monthHi: "दिसंबर-फरवरी",
        activities: [
          { type: "harvest", description: "Harvest when leaves turn yellow", descriptionHi: "जब पत्ते पीले हों तब खुदाई करें" },
        ],
      },
    ],
  },
  {
    name: "Turmeric (Haldi)",
    nameHi: "हल्दी",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "8-9 months",
    durationHi: "8-9 महीने",
    calendar: [
      {
        month: "May-June",
        monthHi: "मई-जून",
        activities: [
          { type: "sowing", description: "Plant rhizomes 7cm deep, 45x25cm spacing", descriptionHi: "7 सेमी गहरे, 45x25 सेमी दूरी पर गांठें लगाएं" },
          { type: "fertilizer", description: "Apply 60kg N, 50kg P, 120kg K/ha", descriptionHi: "60 किलो N, 50 किलो P, 120 किलो K/हे." },
        ],
      },
      {
        month: "July-August",
        monthHi: "जुलाई-अगस्त",
        activities: [
          { type: "irrigation", description: "Usually rain-fed, irrigate if dry", descriptionHi: "आमतौर पर बारिश पर निर्भर, सूखा हो तो सिंचाई" },
          { type: "fertilizer", description: "First and second earthing up", descriptionHi: "पहली और दूसरी मिट्टी चढ़ाएं" },
        ],
      },
      {
        month: "September-October",
        monthHi: "सितंबर-अक्टूबर",
        activities: [
          { type: "fertilizer", description: "Third earthing up", descriptionHi: "तीसरी मिट्टी चढ़ाएं" },
          { type: "pesticide", description: "Monitor for leaf spot, rhizome rot", descriptionHi: "लीफ स्पॉट, गांठ सड़न पर नजर रखें" },
        ],
      },
      {
        month: "January-February",
        monthHi: "जनवरी-फरवरी",
        activities: [
          { type: "harvest", description: "Harvest when leaves dry completely", descriptionHi: "जब पत्ते पूरी तरह सूख जाएं तब खुदाई करें" },
        ],
      },
    ],
  },
  // Cash Crops
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
    name: "Sunflower",
    nameHi: "सूरजमुखी",
    season: "Kharif/Rabi",
    seasonHi: "खरीफ/रबी",
    duration: "90-100 days",
    durationHi: "90-100 दिन",
    calendar: [
      {
        month: "June-July (Kharif) / Jan-Feb (Rabi)",
        monthHi: "जून-जुलाई (खरीफ) / जन-फर (रबी)",
        activities: [
          { type: "sowing", description: "Sow seeds 4-5cm deep, 60x30cm spacing", descriptionHi: "4-5 सेमी गहरे, 60x30 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 80kg N, 60kg P, 30kg K/ha", descriptionHi: "80 किलो N, 60 किलो P, 30 किलो K/हे." },
        ],
      },
      {
        month: "Vegetative stage",
        monthHi: "वानस्पतिक अवस्था",
        activities: [
          { type: "irrigation", description: "Irrigate every 10-15 days", descriptionHi: "हर 10-15 दिन सिंचाई करें" },
          { type: "fertilizer", description: "Top dress nitrogen at 30 days", descriptionHi: "30 दिन पर नाइट्रोजन की टॉप ड्रेसिंग" },
        ],
      },
      {
        month: "Flowering stage",
        monthHi: "फूल अवस्था",
        activities: [
          { type: "irrigation", description: "Critical irrigation at flowering", descriptionHi: "फूल आने पर महत्वपूर्ण सिंचाई" },
          { type: "pesticide", description: "Monitor for head rot, aphids", descriptionHi: "हेड रॉट, माहू पर नजर रखें" },
        ],
      },
      {
        month: "90-100 days after sowing",
        monthHi: "बुवाई के 90-100 दिन बाद",
        activities: [
          { type: "harvest", description: "Harvest when back of head turns brown", descriptionHi: "जब सिर का पीछे का भाग भूरा हो तब काटें" },
        ],
      },
    ],
  },
  {
    name: "Sesame (Til)",
    nameHi: "तिल",
    season: "Kharif",
    seasonHi: "खरीफ",
    duration: "80-95 days",
    durationHi: "80-95 दिन",
    calendar: [
      {
        month: "June-July",
        monthHi: "जून-जुलाई",
        activities: [
          { type: "sowing", description: "Sow seeds 2-3cm deep, 30x10cm spacing", descriptionHi: "2-3 सेमी गहरे, 30x10 सेमी दूरी पर बोएं" },
          { type: "fertilizer", description: "Apply 25kg N, 20kg P/ha", descriptionHi: "25 किलो N, 20 किलो P/हे." },
        ],
      },
      {
        month: "July-August",
        monthHi: "जुलाई-अगस्त",
        activities: [
          { type: "irrigation", description: "Usually rain-fed", descriptionHi: "आमतौर पर बारिश पर निर्भर" },
          { type: "pesticide", description: "Monitor for leaf webber, phyllody", descriptionHi: "लीफ वेबर, फाइलोडी पर नजर रखें" },
        ],
      },
      {
        month: "September-October",
        monthHi: "सितंबर-अक्टूबर",
        activities: [
          { type: "harvest", description: "Harvest when capsules turn yellow", descriptionHi: "जब कैप्सूल पीले हों तब काटें" },
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
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [aiCrop, setAiCrop] = useState<CropCalendarData | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const filteredCrops = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return cropsCalendarData.filter(
      (crop) =>
        crop.name.toLowerCase().includes(query) ||
        crop.nameHi.includes(searchQuery) ||
        crop.season.toLowerCase().includes(query) ||
        crop.seasonHi.includes(searchQuery)
    );
  }, [searchQuery]);

  const searchAICrop = useCallback(async (cropName: string) => {
    setIsLoadingAI(true);
    setAiCrop(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-crop-calendar", {
        body: { cropName, language },
      });
      if (error) throw error;
      if (data?.cropCalendar) {
        setAiCrop(data.cropCalendar);
        setSelectedCrop("__ai__");
      }
    } catch (err) {
      console.error("AI crop calendar error:", err);
      toast.error(isHindi ? "फसल की जानकारी नहीं मिल सकी" : "Could not fetch crop information");
    } finally {
      setIsLoadingAI(false);
    }
  }, [language, isHindi]);

  // Auto-search with AI when no local results found
  const [lastAISearch, setLastAISearch] = useState("");
  
  const debouncedSearch = useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (query: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (query.trim().length >= 2) {
          setLastAISearch(query);
          searchAICrop(query);
        }
      }, 800);
    };
  }, [searchAICrop]);

  // Trigger AI search when local results are empty
  useMemo(() => {
    if (searchQuery.trim().length >= 2 && filteredCrops.length === 0 && lastAISearch !== searchQuery && !isLoadingAI) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, filteredCrops.length, lastAISearch, isLoadingAI, debouncedSearch]);
  const currentCrop = selectedCrop === "__ai__"
    ? aiCrop
    : selectedCrop
      ? cropsCalendarData.find((c) => c.name === selectedCrop)
      : null;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <VoiceInput onResult={(text) => {
        setSearchQuery(text);
        setSelectedCrop(null);
        setAiCrop(null);
        setLastAISearch("");
      }} />

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
              {isHindi
                ? "महीने-वार खेती गतिविधियां"
                : "Month-wise Farming Activities"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {isHindi
                ? "अपनी फसल के लिए बुवाई, सिंचाई, खाद और कटाई का सही समय जानें"
                : "Know the right time for sowing, irrigation, fertilizer and harvesting for your crop"}
            </p>

            {/* Search Box */}
            <div className="max-w-md mx-auto flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={
                    isHindi
                      ? "फसल खोजें... (जैसे: टमाटर, आलू, चना)"
                      : "Search crops... (e.g. Tomato, Potato, Chana)"
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCrop(null);
                    setAiCrop(null);
                    setLastAISearch("");
                  }}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCrop(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
            </div>
          </div>

          {/* Search Results - Show when searching */}
          {searchQuery && (
            <div className="bg-muted/30 rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground text-center mb-4">
                {isLoadingAI
                  ? (isHindi ? "खोज रहे हैं..." : "Searching...")
                  : (() => {
                      const totalResults = filteredCrops.length + (aiCrop ? 1 : 0);
                      return isHindi
                        ? `${totalResults} फसलें मिलीं`
                        : `${totalResults} crops found`;
                    })()}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {filteredCrops.map((crop) => (
                  <Button
                    key={crop.name}
                    variant={selectedCrop === crop.name ? "default" : "outline"}
                    size="sm"
                    className="rounded-full border-primary/50 hover:bg-primary/10"
                    onClick={() => setSelectedCrop(crop.name)}
                  >
                    {isHindi ? crop.nameHi : crop.name}
                  </Button>
                ))}

                {aiCrop && (
                  <Button
                    variant={selectedCrop === "__ai__" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full border-primary/50 hover:bg-primary/10"
                    onClick={() => setSelectedCrop("__ai__")}
                  >
                    {isHindi ? aiCrop.nameHi : aiCrop.name}
                  </Button>
                )}
              </div>
            </div>
          )}


          {isLoadingAI && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground text-lg">
                {isHindi
                  ? `"${searchQuery}" की जानकारी AI से ला रहे हैं...`
                  : `Fetching "${searchQuery}" calendar with AI...`}
              </p>
            </div>
          )}

          {/* Selected Crop Calendar */}
          {currentCrop && (
            <div className="animate-fade-in">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <CardTitle className="text-2xl">
                      {isHindi ? currentCrop.nameHi : currentCrop.name}
                    </CardTitle>
                    <Badge variant="outline" className="bg-primary/10">
                      {isHindi ? currentCrop.seasonHi : currentCrop.season}
                    </Badge>
                    <Badge variant="outline">
                      {isHindi ? currentCrop.durationHi : currentCrop.duration}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-4">
                {currentCrop.calendar.map((monthData, index) => (
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
                                  {activity.type.charAt(0).toUpperCase() +
                                    activity.type.slice(1)}
                                </Badge>
                                <p className="text-sm">
                                  {isHindi
                                    ? activity.descriptionHi
                                    : activity.description}
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
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CropCalendar;
