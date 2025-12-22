import { FormData } from "@/components/CropForm";
import { CropRecommendation } from "@/components/CropCard";

// Mock AI recommendation engine - simulates intelligent crop matching
export const generateRecommendations = (formData: FormData): CropRecommendation[] => {
  const { soilType, climate, waterAvailability, season } = formData;

  // Comprehensive crop database with conditions
  const cropDatabase: CropRecommendation[] = [
    {
      name: "Rice",
      scientificName: "Oryza sativa",
      matchScore: 0,
      waterNeeds: "High",
      sunlight: "Full Sun",
      growthPeriod: "4-5 months",
      yieldPotential: "High",
      description: "A staple grain crop that thrives in waterlogged conditions. Ideal for tropical and subtropical climates with abundant water.",
      tips: [
        "Maintain standing water of 2-5 cm during vegetative growth",
        "Apply nitrogen fertilizer in split doses",
        "Monitor for blast disease during humid conditions",
      ],
    },
    {
      name: "Wheat",
      scientificName: "Triticum aestivum",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "4-5 months",
      yieldPotential: "High",
      description: "A cool-season cereal grain that performs well in temperate climates with moderate water availability.",
      tips: [
        "Plant when soil temperature is between 10-15°C",
        "Ensure good drainage to prevent root rot",
        "Apply phosphorus at sowing for strong root development",
      ],
    },
    {
      name: "Corn (Maize)",
      scientificName: "Zea mays",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "3-4 months",
      yieldPotential: "High",
      description: "A versatile crop suited for warm climates with moderate to good water supply. Excellent for various soil types.",
      tips: [
        "Plant when soil temperature reaches 16°C",
        "Space plants 20-30 cm apart in rows",
        "Critical irrigation during tasseling and silking stages",
      ],
    },
    {
      name: "Soybean",
      scientificName: "Glycine max",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "3-5 months",
      yieldPotential: "Medium",
      description: "A nitrogen-fixing legume that enriches soil. Thrives in warm conditions with well-drained loamy soil.",
      tips: [
        "Inoculate seeds with rhizobium for nitrogen fixation",
        "Avoid waterlogging during flowering",
        "Rotate with cereals for best soil health",
      ],
    },
    {
      name: "Cotton",
      scientificName: "Gossypium hirsutum",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "5-6 months",
      yieldPotential: "High",
      description: "A fiber crop that thrives in warm, semi-arid conditions. Tolerates various soil types but prefers deep, well-drained soil.",
      tips: [
        "Requires frost-free growing period of 180+ days",
        "Monitor for bollworm and whitefly",
        "Apply potassium for fiber quality improvement",
      ],
    },
    {
      name: "Millet",
      scientificName: "Pennisetum glaucum",
      matchScore: 0,
      waterNeeds: "Low",
      sunlight: "Full Sun",
      growthPeriod: "2-3 months",
      yieldPotential: "Medium",
      description: "A drought-tolerant grain ideal for arid regions with limited water. Grows well in sandy and poor soils.",
      tips: [
        "Highly drought tolerant once established",
        "Minimal fertilizer requirements",
        "Can serve as emergency fodder crop",
      ],
    },
    {
      name: "Potatoes",
      scientificName: "Solanum tuberosum",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "3-4 months",
      yieldPotential: "High",
      description: "A tuber crop that excels in cool temperate climates with loose, well-drained loamy soil.",
      tips: [
        "Hill soil around plants as they grow",
        "Keep tubers covered to prevent greening",
        "Rotate to prevent soil-borne diseases",
      ],
    },
    {
      name: "Tomatoes",
      scientificName: "Solanum lycopersicum",
      matchScore: 0,
      waterNeeds: "Medium",
      sunlight: "Full Sun",
      growthPeriod: "2-3 months",
      yieldPotential: "High",
      description: "A warm-season vegetable requiring consistent water and nutrients. Best in loamy, well-drained soil.",
      tips: [
        "Stake or cage plants for better air circulation",
        "Mulch to maintain soil moisture",
        "Prune suckers for larger fruits",
      ],
    },
    {
      name: "Sorghum",
      scientificName: "Sorghum bicolor",
      matchScore: 0,
      waterNeeds: "Low",
      sunlight: "Full Sun",
      growthPeriod: "3-4 months",
      yieldPotential: "Medium",
      description: "A drought-resistant cereal perfect for hot, dry climates. Versatile crop for grain, fodder, and biofuel.",
      tips: [
        "Deep root system enables drought survival",
        "Can ratoon for second harvest",
        "Control bird damage near maturity",
      ],
    },
    {
      name: "Sugarcane",
      scientificName: "Saccharum officinarum",
      matchScore: 0,
      waterNeeds: "High",
      sunlight: "Full Sun",
      growthPeriod: "12-18 months",
      yieldPotential: "High",
      description: "A tropical grass crop requiring abundant water and sunshine. Thrives in deep, fertile soil with good drainage.",
      tips: [
        "Requires 150-200 cm annual rainfall or irrigation",
        "Harvest when sugar content peaks",
        "Ratoon crops reduce planting costs",
      ],
    },
  ];

  // Calculate match scores based on conditions
  const scoredCrops = cropDatabase.map((crop) => {
    let score = 50; // Base score

    // Soil compatibility
    if (soilType === "loamy") score += 15;
    else if (soilType === "clay" && ["Rice", "Sugarcane"].includes(crop.name)) score += 12;
    else if (soilType === "sandy" && ["Millet", "Sorghum"].includes(crop.name)) score += 15;
    else if (soilType === "silt") score += 10;

    // Climate compatibility
    if (climate === "tropical" && ["Rice", "Sugarcane", "Soybean", "Cotton"].includes(crop.name)) score += 20;
    if (climate === "subtropical" && ["Corn (Maize)", "Cotton", "Soybean"].includes(crop.name)) score += 18;
    if (climate === "temperate" && ["Wheat", "Potatoes", "Tomatoes"].includes(crop.name)) score += 20;
    if (climate === "arid" && ["Millet", "Sorghum", "Cotton"].includes(crop.name)) score += 25;
    if (climate === "mediterranean" && ["Wheat", "Tomatoes"].includes(crop.name)) score += 18;

    // Water availability
    if (waterAvailability === "abundant" && crop.waterNeeds === "High") score += 15;
    if (waterAvailability === "moderate" && crop.waterNeeds === "Medium") score += 15;
    if (waterAvailability === "limited" && crop.waterNeeds === "Low") score += 20;
    if (waterAvailability === "rainfed" && crop.waterNeeds === "Low") score += 18;

    // Season compatibility
    if (season === "summer" && ["Rice", "Corn (Maize)", "Cotton", "Sorghum"].includes(crop.name)) score += 10;
    if (season === "winter" && ["Wheat", "Potatoes"].includes(crop.name)) score += 15;
    if (season === "spring" && ["Tomatoes", "Corn (Maize)", "Soybean"].includes(crop.name)) score += 12;
    if (season === "monsoon" && ["Rice", "Sugarcane"].includes(crop.name)) score += 15;

    // Normalize score to max 98
    score = Math.min(98, Math.max(45, score));

    return { ...crop, matchScore: score };
  });

  // Sort by match score and return top 3
  return scoredCrops
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
};
