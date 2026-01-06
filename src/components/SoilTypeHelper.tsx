import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Camera, ClipboardList, Loader2, Upload, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SoilTypeHelperProps {
  onSoilTypeDetected: (soilType: string) => void;
}

interface QuizAnswer {
  texture: string;
  water: string;
  color: string;
}

const SoilTypeHelper = ({ onSoilTypeDetected }: SoilTypeHelperProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "image" | "quiz">("select");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>({
    texture: "",
    water: "",
    color: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!previewImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: {
          image: previewImage,
          prompt: "Analyze this soil image and identify the soil type. Respond with ONLY one of these exact words: clay, sandy, loamy, silt, peaty, or chalky. Just the single word, nothing else.",
        },
      });

      if (error) throw error;

      const detectedType = data?.result?.toLowerCase().trim();
      const validTypes = ["clay", "sandy", "loamy", "silt", "peaty", "chalky"];
      
      if (validTypes.includes(detectedType)) {
        onSoilTypeDetected(detectedType);
        toast.success(`${t('soilDetected')}: ${t(detectedType)}`);
        setOpen(false);
        resetState();
      } else {
        toast.error(t('soilDetectionFailed'));
      }
    } catch (error) {
      console.error("Soil analysis error:", error);
      toast.error(t('soilDetectionFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const quizQuestions = [
    {
      question: t('soilTextureQuestion'),
      options: [
        { label: t('textureSticky'), value: "sticky" },
        { label: t('textureGritty'), value: "gritty" },
        { label: t('textureSoft'), value: "soft" },
        { label: t('textureSpongy'), value: "spongy" },
      ],
      key: "texture" as keyof QuizAnswer,
    },
    {
      question: t('soilWaterQuestion'),
      options: [
        { label: t('waterPools'), value: "pools" },
        { label: t('waterDrains'), value: "drains" },
        { label: t('waterModerate'), value: "moderate" },
        { label: t('waterRetains'), value: "retains" },
      ],
      key: "water" as keyof QuizAnswer,
    },
    {
      question: t('soilColorQuestion'),
      options: [
        { label: t('colorReddish'), value: "reddish" },
        { label: t('colorLight'), value: "light" },
        { label: t('colorDark'), value: "dark" },
        { label: t('colorWhitish'), value: "whitish" },
      ],
      key: "color" as keyof QuizAnswer,
    },
  ];

  const determineSoilType = (answers: QuizAnswer): string => {
    // Simple logic to determine soil type based on answers
    if (answers.texture === "sticky" && answers.water === "pools") return "clay";
    if (answers.texture === "gritty" && answers.water === "drains") return "sandy";
    if (answers.texture === "soft" && answers.water === "moderate") return "loamy";
    if (answers.texture === "spongy" && answers.color === "dark") return "peaty";
    if (answers.color === "whitish") return "chalky";
    if (answers.water === "retains") return "silt";
    
    // Default to loamy if can't determine
    return "loamy";
  };

  const handleQuizAnswer = (value: string) => {
    const currentQuestion = quizQuestions[quizStep];
    const newAnswers = { ...quizAnswers, [currentQuestion.key]: value };
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete - determine soil type
      const soilType = determineSoilType(newAnswers);
      onSoilTypeDetected(soilType);
      toast.success(`${t('soilDetected')}: ${t(soilType)}`);
      setOpen(false);
      resetState();
    }
  };

  const resetState = () => {
    setMode("select");
    setPreviewImage(null);
    setQuizStep(0);
    setQuizAnswers({ texture: "", water: "", color: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          {t('dontKnowSoilType')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('detectSoilType')}</DialogTitle>
        </DialogHeader>

        {mode === "select" && (
          <div className="grid gap-4">
            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setMode("image")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{t('uploadSoilPhoto')}</h4>
                  <p className="text-sm text-muted-foreground">{t('uploadSoilPhotoDesc')}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setMode("quiz")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{t('answerQuestions')}</h4>
                  <p className="text-sm text-muted-foreground">{t('answerQuestionsDesc')}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {mode === "image" && (
          <div className="space-y-4">
            {!previewImage ? (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{t('clickToUploadSoil')}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Soil preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1"
              >
                {t('back')}
              </Button>
              <Button
                type="button"
                onClick={analyzeImage}
                disabled={!previewImage || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('analyzing')}
                  </>
                ) : (
                  t('analyzeSoil')
                )}
              </Button>
            </div>
          </div>
        )}

        {mode === "quiz" && (
          <div className="space-y-4">
            <div className="flex gap-1 mb-4">
              {quizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= quizStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <h4 className="font-medium text-center">
              {quizQuestions[quizStep].question}
            </h4>

            <div className="grid gap-2">
              {quizQuestions[quizStep].options.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleQuizAnswer(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (quizStep > 0) {
                  setQuizStep(quizStep - 1);
                } else {
                  setMode("select");
                }
              }}
              className="w-full"
            >
              {t('back')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SoilTypeHelper;
