import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, Globe, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "gu", label: "ગુજરાતી" },
];

const Auth = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if user is already logged in
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
        toast.success("Account created! You can now login.");
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
            Smart Farming<br />
            <span className="text-white/80">Starts Here</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Get AI-powered crop recommendations tailored to your soil, climate, and water conditions.
          </p>
          
          <div className="flex items-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-white/60">Crop Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="text-sm text-white/60">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="text-sm text-white/60">Farmers</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © {new Date().getFullYear()} CropWise AI
        </div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col"
      >
        {/* Language Selector */}
        <div className="flex justify-end p-6">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px] bg-muted/50 border-border/50">
              <Globe className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Join thousands of farmers using AI recommendations"}
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
                  <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
