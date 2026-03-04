import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import VoiceInput from "@/components/VoiceInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  Plus, 
  Sprout, 
  MapPin, 
  Calendar,
  Trash2,
  Edit2,
  Save,
  X,
  Ruler,
  Droplets,
  StickyNote,
  LogIn
} from "lucide-react";

interface FarmData {
  id: string;
  name: string;
  location: string;
  size: string;
  crops: string[];
  notes: string;
  createdAt: Date;
}

const Dashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);
  
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    size: "",
    crops: "",
    notes: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        loadFarms();
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadFarms();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadFarms = () => {
    // Load farms from localStorage for now (can be migrated to Supabase later)
    const savedFarms = localStorage.getItem('user-farms');
    if (savedFarms) {
      setFarms(JSON.parse(savedFarms));
    }
  };

  const saveFarms = (updatedFarms: FarmData[]) => {
    localStorage.setItem('user-farms', JSON.stringify(updatedFarms));
    setFarms(updatedFarms);
  };

  const handleAddFarm = () => {
    if (!newFarm.name.trim()) {
      toast.error(isHindi ? "खेत का नाम दर्ज करें" : "Please enter farm name");
      return;
    }

    const farm: FarmData = {
      id: Date.now().toString(),
      name: newFarm.name,
      location: newFarm.location,
      size: newFarm.size,
      crops: newFarm.crops.split(',').map(c => c.trim()).filter(Boolean),
      notes: newFarm.notes,
      createdAt: new Date(),
    };

    const updatedFarms = [...farms, farm];
    saveFarms(updatedFarms);
    setNewFarm({ name: "", location: "", size: "", crops: "", notes: "" });
    setIsAddingFarm(false);
    toast.success(isHindi ? "खेत जोड़ा गया!" : "Farm added successfully!");
  };

  const handleDeleteFarm = (id: string) => {
    const updatedFarms = farms.filter(f => f.id !== id);
    saveFarms(updatedFarms);
    toast.success(isHindi ? "खेत हटाया गया" : "Farm deleted");
  };

  const handleUpdateFarm = (id: string, updates: Partial<FarmData>) => {
    const updatedFarms = farms.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    saveFarms(updatedFarms);
    setEditingFarmId(null);
    toast.success(isHindi ? "खेत अपडेट किया गया" : "Farm updated");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-md">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>
                  {isHindi ? "लॉगिन करें" : "Login Required"}
                </CardTitle>
                <CardDescription>
                  {isHindi 
                    ? "अपने खेत की जानकारी सेव करने के लिए लॉगिन करें"
                    : "Login to save and manage your farm information"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  {isHindi ? "लॉगिन / साइन अप" : "Login / Sign Up"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <VoiceInput onResult={(text) => toast.info(`🎤 "${text}"`, { duration: 4000 })} />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {isHindi ? "मेरा डैशबोर्ड" : "My Dashboard"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {isHindi ? "मेरे खेत" : "My Farms"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isHindi 
                  ? "अपने खेतों की जानकारी और नोट्स यहाँ सेव करें"
                  : "Save your farm information and notes here"
                }
              </p>
            </div>
            <Button onClick={() => setIsAddingFarm(true)} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              {isHindi ? "नया खेत जोड़ें" : "Add New Farm"}
            </Button>
          </div>

          <Tabs defaultValue="farms" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="farms">
                <Sprout className="w-4 h-4 mr-2" />
                {isHindi ? "मेरे खेत" : "My Farms"}
              </TabsTrigger>
              <TabsTrigger value="notes">
                <StickyNote className="w-4 h-4 mr-2" />
                {isHindi ? "नोट्स" : "Notes"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farms">
              {/* Add Farm Form */}
              {isAddingFarm && (
                <Card className="mb-6 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      {isHindi ? "नया खेत जोड़ें" : "Add New Farm"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>{isHindi ? "खेत का नाम *" : "Farm Name *"}</Label>
                        <Input
                          value={newFarm.name}
                          onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                          placeholder={isHindi ? "जैसे: पूर्वी खेत" : "e.g., East Field"}
                        />
                      </div>
                      <div>
                        <Label>{isHindi ? "स्थान" : "Location"}</Label>
                        <Input
                          value={newFarm.location}
                          onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                          placeholder={isHindi ? "गाँव/जिला" : "Village/District"}
                        />
                      </div>
                      <div>
                        <Label>{isHindi ? "खेत का आकार (एकड़)" : "Farm Size (acres)"}</Label>
                        <Input
                          value={newFarm.size}
                          onChange={(e) => setNewFarm({ ...newFarm, size: e.target.value })}
                          placeholder={isHindi ? "जैसे: 5 एकड़" : "e.g., 5 acres"}
                        />
                      </div>
                      <div>
                        <Label>{isHindi ? "फसलें (कॉमा से अलग करें)" : "Crops (comma separated)"}</Label>
                        <Input
                          value={newFarm.crops}
                          onChange={(e) => setNewFarm({ ...newFarm, crops: e.target.value })}
                          placeholder={isHindi ? "गेहूं, चावल, सरसों" : "Wheat, Rice, Mustard"}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>{isHindi ? "नोट्स" : "Notes"}</Label>
                        <Textarea
                          value={newFarm.notes}
                          onChange={(e) => setNewFarm({ ...newFarm, notes: e.target.value })}
                          placeholder={isHindi ? "कोई अतिरिक्त जानकारी..." : "Any additional information..."}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddFarm}>
                        <Save className="w-4 h-4 mr-2" />
                        {isHindi ? "सेव करें" : "Save"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingFarm(false)}>
                        <X className="w-4 h-4 mr-2" />
                        {isHindi ? "रद्द करें" : "Cancel"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Farm Cards */}
              {farms.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Sprout className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {isHindi ? "कोई खेत नहीं जोड़ा गया" : "No farms added yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isHindi 
                        ? "अपने खेतों की जानकारी ट्रैक करने के लिए पहला खेत जोड़ें"
                        : "Add your first farm to start tracking your farm information"
                      }
                    </p>
                    <Button onClick={() => setIsAddingFarm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isHindi ? "खेत जोड़ें" : "Add Farm"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {farms.map((farm) => (
                    <Card key={farm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{farm.name}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingFarmId(farm.id)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteFarm(farm.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {farm.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {farm.location}
                            </div>
                          )}
                          {farm.size && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Ruler className="w-4 h-4" />
                              {farm.size}
                            </div>
                          )}
                          {farm.crops.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {farm.crops.map((crop, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {farm.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {farm.notes}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <Calendar className="w-3 h-3" />
                            {new Date(farm.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>{isHindi ? "खेती के नोट्स" : "Farming Notes"}</CardTitle>
                  <CardDescription>
                    {isHindi 
                      ? "अपने खेती के अनुभव और टिप्स यहाँ लिखें"
                      : "Write your farming experiences and tips here"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={isHindi 
                      ? "अपने नोट्स यहाँ लिखें..."
                      : "Write your notes here..."
                    }
                    rows={10}
                    className="resize-none"
                  />
                  <Button className="mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    {isHindi ? "नोट्स सेव करें" : "Save Notes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
