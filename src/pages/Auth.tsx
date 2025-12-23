import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
];

const translations: Record<string, {
  welcomeBack: string;
  createAccount: string;
  enterCredentials: string;
  joinFarmers: string;
  fullName: string;
  enterName: string;
  email: string;
  enterEmail: string;
  password: string;
  enterPassword: string;
  signIn: string;
  createAccountBtn: string;
  noAccount: string;
  haveAccount: string;
  signUp: string;
  smartFarming: string;
  startsHere: string;
  getAIPowered: string;
  cropTypes: string;
  accuracy: string;
  farmers: string;
  selectLanguage: string;
  choosePreferred: string;
  continue: string;
}> = {
  en: {
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    enterCredentials: "Enter your credentials to access your account",
    joinFarmers: "Join thousands of farmers using AI recommendations",
    fullName: "Full Name",
    enterName: "Enter your name",
    email: "Email",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    signIn: "Sign In",
    createAccountBtn: "Create Account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    signUp: "Sign up",
    smartFarming: "Smart Farming",
    startsHere: "Starts Here",
    getAIPowered: "Get AI-powered crop recommendations tailored to your soil, climate, and water conditions.",
    cropTypes: "Crop Types",
    accuracy: "Accuracy",
    farmers: "Farmers",
    selectLanguage: "Select Language",
    choosePreferred: "Choose your preferred language to continue",
    continue: "Continue",
  },
  hi: {
    welcomeBack: "वापस स्वागत है",
    createAccount: "खाता बनाएं",
    enterCredentials: "अपना खाता एक्सेस करने के लिए अपना विवरण दर्ज करें",
    joinFarmers: "हजारों किसानों से जुड़ें जो AI सिफारिशों का उपयोग कर रहे हैं",
    fullName: "पूरा नाम",
    enterName: "अपना नाम दर्ज करें",
    email: "ईमेल",
    enterEmail: "अपना ईमेल दर्ज करें",
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    signIn: "साइन इन करें",
    createAccountBtn: "खाता बनाएं",
    noAccount: "खाता नहीं है?",
    haveAccount: "पहले से खाता है?",
    signUp: "साइन अप करें",
    smartFarming: "स्मार्ट खेती",
    startsHere: "यहाँ से शुरू होती है",
    getAIPowered: "अपनी मिट्टी, जलवायु और पानी की स्थितियों के अनुसार AI-संचालित फसल सिफारिशें प्राप्त करें।",
    cropTypes: "फसल प्रकार",
    accuracy: "सटीकता",
    farmers: "किसान",
    selectLanguage: "भाषा चुनें",
    choosePreferred: "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
    continue: "जारी रखें",
  },
  pa: {
    welcomeBack: "ਵਾਪਸ ਸੁਆਗਤ ਹੈ",
    createAccount: "ਖਾਤਾ ਬਣਾਓ",
    enterCredentials: "ਆਪਣੇ ਖਾਤੇ ਤੱਕ ਪਹੁੰਚ ਲਈ ਆਪਣੇ ਵੇਰਵੇ ਦਾਖਲ ਕਰੋ",
    joinFarmers: "AI ਸਿਫ਼ਾਰਸ਼ਾਂ ਦੀ ਵਰਤੋਂ ਕਰਨ ਵਾਲੇ ਹਜ਼ਾਰਾਂ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ",
    fullName: "ਪੂਰਾ ਨਾਮ",
    enterName: "ਆਪਣਾ ਨਾਮ ਦਾਖਲ ਕਰੋ",
    email: "ਈਮੇਲ",
    enterEmail: "ਆਪਣੀ ਈਮੇਲ ਦਾਖਲ ਕਰੋ",
    password: "ਪਾਸਵਰਡ",
    enterPassword: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ",
    signIn: "ਸਾਈਨ ਇਨ ਕਰੋ",
    createAccountBtn: "ਖਾਤਾ ਬਣਾਓ",
    noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    haveAccount: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
    signUp: "ਸਾਈਨ ਅਪ ਕਰੋ",
    smartFarming: "ਸਮਾਰਟ ਖੇਤੀ",
    startsHere: "ਇੱਥੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ",
    getAIPowered: "ਆਪਣੀ ਮਿੱਟੀ, ਜਲਵਾਯੂ ਅਤੇ ਪਾਣੀ ਦੀਆਂ ਸਥਿਤੀਆਂ ਅਨੁਸਾਰ AI-ਸੰਚਾਲਿਤ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
    cropTypes: "ਫ਼ਸਲ ਕਿਸਮਾਂ",
    accuracy: "ਸ਼ੁੱਧਤਾ",
    farmers: "ਕਿਸਾਨ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    choosePreferred: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
  },
  mr: {
    welcomeBack: "परत स्वागत आहे",
    createAccount: "खाते तयार करा",
    enterCredentials: "तुमच्या खात्यात प्रवेश करण्यासाठी तपशील प्रविष्ट करा",
    joinFarmers: "AI शिफारसी वापरणाऱ्या हजारो शेतकऱ्यांसोबत सामील व्हा",
    fullName: "पूर्ण नाव",
    enterName: "तुमचे नाव प्रविष्ट करा",
    email: "ईमेल",
    enterEmail: "तुमचा ईमेल प्रविष्ट करा",
    password: "पासवर्ड",
    enterPassword: "तुमचा पासवर्ड प्रविष्ट करा",
    signIn: "साइन इन करा",
    createAccountBtn: "खाते तयार करा",
    noAccount: "खाते नाही?",
    haveAccount: "आधीच खाते आहे?",
    signUp: "साइन अप करा",
    smartFarming: "स्मार्ट शेती",
    startsHere: "येथून सुरू होते",
    getAIPowered: "तुमच्या मातीच्या, हवामानाच्या आणि पाण्याच्या परिस्थितीनुसार AI-संचालित पीक शिफारसी मिळवा।",
    cropTypes: "पीक प्रकार",
    accuracy: "अचूकता",
    farmers: "शेतकरी",
    selectLanguage: "भाषा निवडा",
    choosePreferred: "सुरू ठेवण्यासाठी तुमची पसंतीची भाषा निवडा",
    continue: "सुरू ठेवा",
  },
  ta: {
    welcomeBack: "மீண்டும் வரவேற்கிறோம்",
    createAccount: "கணக்கை உருவாக்கு",
    enterCredentials: "உங்கள் கணக்கை அணுக உங்கள் விவரங்களை உள்ளிடவும்",
    joinFarmers: "AI பரிந்துரைகளைப் பயன்படுத்தும் ஆயிரக்கணக்கான விவசாயிகளுடன் இணையுங்கள்",
    fullName: "முழு பெயர்",
    enterName: "உங்கள் பெயரை உள்ளிடவும்",
    email: "மின்னஞ்சல்",
    enterEmail: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    password: "கடவுச்சொல்",
    enterPassword: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    signIn: "உள்நுழைக",
    createAccountBtn: "கணக்கை உருவாக்கு",
    noAccount: "கணக்கு இல்லையா?",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    signUp: "பதிவு செய்க",
    smartFarming: "ஸ்மார்ட் விவசாயம்",
    startsHere: "இங்கே தொடங்குகிறது",
    getAIPowered: "உங்கள் மண், காலநிலை மற்றும் நீர் நிலைமைகளுக்கு ஏற்ப AI-இயக்கப்படும் பயிர் பரிந்துரைகளைப் பெறுங்கள்.",
    cropTypes: "பயிர் வகைகள்",
    accuracy: "துல்லியம்",
    farmers: "விவசாயிகள்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    choosePreferred: "தொடர உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    continue: "தொடரவும்",
  },
  te: {
    welcomeBack: "తిరిగి స్వాగతం",
    createAccount: "ఖాతాను సృష్టించండి",
    enterCredentials: "మీ ఖాతాను యాక్సెస్ చేయడానికి మీ వివరాలను నమోదు చేయండి",
    joinFarmers: "AI సిఫార్సులను ఉపయోగిస్తున్న వేలాది రైతులతో చేరండి",
    fullName: "పూర్తి పేరు",
    enterName: "మీ పేరు నమోదు చేయండి",
    email: "ఇమెయిల్",
    enterEmail: "మీ ఇమెయిల్ నమోదు చేయండి",
    password: "పాస్‌వర్డ్",
    enterPassword: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    signIn: "సైన్ ఇన్ చేయండి",
    createAccountBtn: "ఖాతాను సృష్టించండి",
    noAccount: "ఖాతా లేదా?",
    haveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signUp: "సైన్ అప్ చేయండి",
    smartFarming: "స్మార్ట్ వ్యవసాయం",
    startsHere: "ఇక్కడ ప్రారంభమవుతుంది",
    getAIPowered: "మీ నేల, వాతావరణం మరియు నీటి పరిస్థితులకు అనుగుణంగా AI-ఆధారిత పంట సిఫార్సులను పొందండి.",
    cropTypes: "పంట రకాలు",
    accuracy: "ఖచ్చితత్వం",
    farmers: "రైతులు",
    selectLanguage: "భాషను ఎంచుకోండి",
    choosePreferred: "కొనసాగించడానికి మీకు ఇష్టమైన భాషను ఎంచుకోండి",
    continue: "కొనసాగించు",
  },
  bn: {
    welcomeBack: "স্বাগতম",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    enterCredentials: "আপনার অ্যাকাউন্ট অ্যাক্সেস করতে আপনার বিবরণ লিখুন",
    joinFarmers: "AI সুপারিশ ব্যবহার করে হাজার হাজার কৃষকের সাথে যোগ দিন",
    fullName: "পুরো নাম",
    enterName: "আপনার নাম লিখুন",
    email: "ইমেইল",
    enterEmail: "আপনার ইমেইল লিখুন",
    password: "পাসওয়ার্ড",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন",
    signIn: "সাইন ইন করুন",
    createAccountBtn: "অ্যাকাউন্ট তৈরি করুন",
    noAccount: "অ্যাকাউন্ট নেই?",
    haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    signUp: "সাইন আপ করুন",
    smartFarming: "স্মার্ট চাষ",
    startsHere: "এখানে শুরু হয়",
    getAIPowered: "আপনার মাটি, জলবায়ু এবং জলের অবস্থা অনুযায়ী AI-চালিত ফসল সুপারিশ পান।",
    cropTypes: "ফসলের ধরন",
    accuracy: "নির্ভুলতা",
    farmers: "কৃষক",
    selectLanguage: "ভাষা নির্বাচন করুন",
    choosePreferred: "চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন",
    continue: "চালিয়ে যান",
  },
  gu: {
    welcomeBack: "પાછા સ્વાગત છે",
    createAccount: "એકાઉન્ટ બનાવો",
    enterCredentials: "તમારા એકાઉન્ટને ઍક્સેસ કરવા માટે તમારી વિગતો દાખલ કરો",
    joinFarmers: "AI ભલામણોનો ઉપયોગ કરતા હજારો ખેડૂતો સાથે જોડાઓ",
    fullName: "પૂરું નામ",
    enterName: "તમારું નામ દાખલ કરો",
    email: "ઈમેઈલ",
    enterEmail: "તમારો ઈમેઈલ દાખલ કરો",
    password: "પાસવર્ડ",
    enterPassword: "તમારો પાસવર્ડ દાખલ કરો",
    signIn: "સાઇન ઇન કરો",
    createAccountBtn: "એકાઉન્ટ બનાવો",
    noAccount: "એકાઉન્ટ નથી?",
    haveAccount: "પહેલેથી એકાઉન્ટ છે?",
    signUp: "સાઇન અપ કરો",
    smartFarming: "સ્માર્ટ ખેતી",
    startsHere: "અહીંથી શરૂ થાય છે",
    getAIPowered: "તમારી જમીન, આબોહવા અને પાણીની સ્થિતિ અનુસાર AI-સંચાલિત પાક ભલામણો મેળવો.",
    cropTypes: "પાક પ્રકાર",
    accuracy: "ચોકસાઈ",
    farmers: "ખેડૂતો",
    selectLanguage: "ભાષા પસંદ કરો",
    choosePreferred: "ચાલુ રાખવા માટે તમારી પસંદગીની ભાષા પસંદ કરો",
    continue: "ચાલુ રાખો",
  },
};

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"language" | "auth">("language");
  const [language, setLanguage] = useState("en");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const t = translations[language];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login successful!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: name,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created!");
        navigate("/");
      }
    } catch (error: any) {
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please login instead.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Panel - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-hero p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full" />
          <div className="absolute bottom-40 right-20 w-60 h-60 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-white/20 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CropWise AI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            {t.smartFarming}<br />
            <span className="text-white/80">{t.startsHere}</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            {t.getAIPowered}
          </p>
          
          <div className="flex items-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-white/60">{t.cropTypes}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="text-sm text-white/60">{t.accuracy}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="text-sm text-white/60">{t.farmers}</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © {new Date().getFullYear()} CropWise AI
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col"
      >
        <AnimatePresence mode="wait">
          {step === "language" ? (
            <motion.div
              key="language"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center px-6 py-12"
            >
              <div className="w-full max-w-md space-y-8">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-bold">CropWise AI</span>
                </div>

                {/* Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground">
                    {translations.en.selectLanguage}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {translations.en.choosePreferred}
                  </p>
                </div>

                {/* Language Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        language === lang.code
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {language === lang.code && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="text-lg font-semibold text-foreground">
                        {lang.nativeLabel}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lang.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => setStep("auth")}
                  className="w-full h-12 bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold text-base group"
                >
                  {translations[language].continue}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Back Button */}
              <div className="p-6">
                <button
                  onClick={() => setStep("language")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">{translations.en.selectLanguage}</span>
                </button>
              </div>

              {/* Form Container */}
              <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                  {/* Mobile Logo */}
                  <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold">CropWise AI</span>
                  </div>

                  {/* Header */}
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-foreground">
                      {isLogin ? t.welcomeBack : t.createAccount}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {isLogin ? t.enterCredentials : t.joinFarmers}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="name" className="text-foreground font-medium">{t.fullName}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder={t.enterName}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                            required={!isLogin}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">{t.email}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t.enterEmail}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-medium">{t.password}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={t.enterPassword}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold text-base group"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {isLogin ? t.signIn : t.createAccountBtn}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Toggle */}
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      {isLogin ? t.noAccount : t.haveAccount}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-primary font-semibold hover:underline"
                      >
                        {isLogin ? t.signUp : t.signIn}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
