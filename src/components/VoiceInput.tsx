import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface VoiceInputProps {
  onResult?: (text: string) => void;
}

const VoiceInput = ({ onResult }: VoiceInputProps) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const recognitionRef = useRef<any>(null);

  const langMap: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    pa: "pa-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN",
    bn: "bn-IN",
    gu: "gu-IN",
  };

  const getSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(
        language === "hi"
          ? "आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता"
          : "Your browser doesn't support voice input"
      );
      return null;
    }
    return new SpeechRecognition();
  }, [language]);

  const startListening = useCallback(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    recognition.lang = langMap[language] || "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      setTranscript(finalText || interimText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        toast.error(
          language === "hi"
            ? "माइक्रोफ़ोन की अनुमति दें"
            : "Please allow microphone access"
        );
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setShowPanel(true);
    setTranscript("");
  }, [getSpeechRecognition, language, langMap]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleClose = useCallback(() => {
    stopListening();
    setShowPanel(false);
    setTranscript("");
  }, [stopListening]);

  const handleSend = useCallback(() => {
    if (transcript.trim() && onResult) {
      onResult(transcript.trim());
    }
    handleClose();
  }, [transcript, onResult, handleClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const isHindi = language === "hi";

  return (
    <>
      {/* Floating Mic Button */}
      <button
        onClick={() => {
          if (showPanel) handleClose();
          else startListening();
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "hover:scale-110 active:scale-95",
          isListening
            ? "bg-destructive text-destructive-foreground animate-pulse"
            : "bg-primary text-primary-foreground hover:shadow-glow"
        )}
        aria-label="Voice input"
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Voice Panel */}
      {showPanel && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-xl animate-fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isListening ? "bg-destructive animate-pulse" : "bg-muted-foreground"
              )} />
              <span className="text-sm font-medium text-foreground">
                {isListening
                  ? (isHindi ? "सुन रहा है..." : "Listening...")
                  : (isHindi ? "बोलना बंद" : "Stopped")}
              </span>
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Visualization */}
          <div className="px-4 py-6 flex flex-col items-center gap-4">
            {isListening && (
              <div className="flex items-center gap-1 h-10">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 24 + 12}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.6s",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Transcript */}
            <div className="w-full min-h-[60px] max-h-32 overflow-y-auto">
              {transcript ? (
                <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  {isHindi ? "बोलिए... 🎤" : "Speak now... 🎤"}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            {isListening ? (
              <Button variant="destructive" size="sm" onClick={stopListening} className="flex-1">
                <MicOff className="w-4 h-4 mr-1" />
                {isHindi ? "रोकें" : "Stop"}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={startListening} className="flex-1">
                <Mic className="w-4 h-4 mr-1" />
                {isHindi ? "फिर से बोलें" : "Speak Again"}
              </Button>
            )}
            {transcript && (
              <Button variant="default" size="sm" onClick={handleSend} className="flex-1">
                {isHindi ? "भेजें" : "Send"}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceInput;
