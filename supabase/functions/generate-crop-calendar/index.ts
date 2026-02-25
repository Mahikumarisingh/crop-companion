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

    const langMap: Record<string, string> = {
      en: "English", hi: "Hindi", pa: "Punjabi", mr: "Marathi",
      ta: "Tamil", te: "Telugu", bn: "Bengali", gu: "Gujarati"
    };
    const targetLang = langMap[language] || "Hindi";

    const systemPrompt = `You are an expert Indian agricultural advisor. Generate a month-wise crop calendar for the given crop/fruit/vegetable.

Respond ENTIRELY in JSON format with this exact structure:
{
  "name": "Crop name in English",
  "nameHi": "Crop name in ${targetLang}",
  "season": "Kharif/Rabi/Zaid/Year-round",
  "seasonHi": "Season in ${targetLang}",
  "duration": "Duration in English (e.g. 90-120 days)",
  "durationHi": "Duration in ${targetLang}",
  "calendar": [
    {
      "month": "Month name in English",
      "monthHi": "Month name in ${targetLang}",
      "activities": [
        {
          "type": "sowing|irrigation|fertilizer|pesticide|harvest",
          "description": "Activity description in English",
          "descriptionHi": "Activity description in ${targetLang}"
        }
      ]
    }
  ]
}

IMPORTANT:
- Include ALL relevant months for the crop lifecycle (typically 3-8 months)
- Each month should have 1-3 activities
- Activity type MUST be one of: sowing, irrigation, fertilizer, pesticide, harvest
- Provide practical, India-specific farming advice
- Include both English and ${targetLang} text for ALL fields
- Return ONLY valid JSON, no other text`;

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
          { role: "user", content: `Generate complete month-wise crop calendar for: "${cropName}"` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI search failed" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const textResp = await response.text();
      console.error("Non-JSON response:", contentType, textResp.substring(0, 300));
      return new Response(JSON.stringify({ error: "AI returned non-JSON response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("Empty AI content. Full response:", JSON.stringify(data).substring(0, 500));
      return new Response(JSON.stringify({ error: "Empty AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let cropCalendar;
    try {
      // Try direct parse first
      cropCalendar = JSON.parse(content);
    } catch {
      try {
        // Try extracting JSON from markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          cropCalendar = JSON.parse(codeBlockMatch[1].trim());
        } else {
          // Try finding JSON object
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cropCalendar = JSON.parse(jsonMatch[0]);
          } else {
            console.error("No JSON found in content:", content.substring(0, 500));
            return new Response(JSON.stringify({ error: "Failed to parse response" }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", content.substring(0, 500));
        return new Response(JSON.stringify({ error: "Failed to parse response" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ cropCalendar }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
