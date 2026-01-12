import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropName, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!cropName || cropName.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Invalid crop name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const languagePrompts: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      pa: "Punjabi",
      mr: "Marathi",
      ta: "Tamil",
      te: "Telugu",
      bn: "Bengali",
      gu: "Gujarati"
    };

    const targetLanguage = languagePrompts[language] || "Hindi";

    const systemPrompt = `You are an expert Indian agricultural advisor with deep knowledge of farming, pesticides, fertilizers, diseases, and mandi prices in India.

Your task is to provide comprehensive information about the crop/fruit/vegetable that the user searches for.

IMPORTANT: Respond ENTIRELY in ${targetLanguage} language. Every single word must be in ${targetLanguage}.

Provide information in this exact JSON format:
{
  "cropName": "Name of the crop in ${targetLanguage}",
  "cropNameEnglish": "Name in English",
  "category": "grain/vegetable/fruit/spice/pulse/oilseed",
  "pesticides": [
    {
      "name": "Pesticide name",
      "target": "Target pests/insects",
      "dosage": "Dosage per litre water",
      "timing": "When to apply",
      "safety": "Safety precautions"
    }
  ],
  "fertilizers": [
    {
      "name": "Fertilizer name",
      "nutrients": "Main nutrients (NPK ratio if applicable)",
      "application": "How to apply",
      "timing": "When to apply"
    }
  ],
  "diseases": [
    {
      "name": "Disease name",
      "symptoms": "Symptoms to identify",
      "treatment": "How to treat",
      "prevention": "Prevention methods"
    }
  ],
  "mandiPrices": [
    {
      "market": "Mandi/Market name (use real Indian mandis like Azadpur, Vashi, etc.)",
      "price": 2500,
      "unit": "per quintal",
      "trend": "up/down/stable",
      "change": "+5%" or "-3%" or "0%"
    }
  ],
  "generalInfo": {
    "season": "Best growing season",
    "climate": "Suitable climate",
    "waterNeeds": "Water requirements",
    "soilType": "Best soil type",
    "growthPeriod": "Growth period in days/months"
  }
}

IMPORTANT NOTES:
- Provide 2-3 pesticides commonly used in India
- Provide 2-3 fertilizers commonly used in India  
- Provide 2-3 common diseases
- Provide 3-4 mandi prices from major Indian markets with realistic 2024-2025 prices
- All prices should be realistic current market rates in Indian Rupees
- Include both chemical names and common trade names where applicable`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Provide complete farming information for: "${cropName}". Include pesticides, fertilizers, diseases, and current mandi prices in India. Respond entirely in ${targetLanguage}.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI search failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let cropInfo;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cropInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      cropInfo = { error: "Failed to parse crop information" };
    }

    return new Response(JSON.stringify({ cropInfo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
