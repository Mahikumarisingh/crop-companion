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
    const { imageBase64, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const targetLanguage = languagePrompts[language] || "English";

    const systemPrompt = `You are an expert agricultural advisor who analyzes images of soil, weather conditions, and crops.
    
Your task is to:
1. Identify what's in the image (soil type, weather condition, crop, or landscape)
2. Analyze the soil condition if visible (type, moisture, health)
3. Analyze weather/climate indicators if visible
4. Recommend 3 best crops to grow based on your analysis

IMPORTANT: Respond ENTIRELY in ${targetLanguage} language. Every single word must be in ${targetLanguage}.

Respond in this JSON format:
{
  "imageType": "soil/weather/crop/landscape/unknown",
  "soilAnalysis": {
    "type": "clay/sandy/loamy/silt/etc",
    "condition": "description of soil condition",
    "moisture": "dry/moderate/wet",
    "healthScore": 1-10
  },
  "weatherAnalysis": {
    "climate": "tropical/subtropical/temperate/arid/semiarid",
    "conditions": "description of weather conditions",
    "suitability": "description of farming suitability"
  },
  "cropRecommendations": [
    {
      "name": "Crop name",
      "matchScore": 75-95,
      "reason": "Why this crop is recommended",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "waterNeeds": "low/medium/high",
      "growthPeriod": "X-Y months"
    }
  ],
  "overallSummary": "A brief summary of the analysis and recommendations"
}`;

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
            content: [
              {
                type: "text",
                text: `Analyze this image and provide crop recommendations. Respond entirely in ${targetLanguage}.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
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
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Extract JSON from the response
    let analysis;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return raw content if parsing fails
      analysis = { rawAnalysis: content };
    }

    return new Response(JSON.stringify({ analysis }), {
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
