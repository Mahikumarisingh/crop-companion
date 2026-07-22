import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const buildSystemPrompt = (state: string | null) => {
  const scope = state
    ? `Return the CURRENT and LATEST list of active government schemes for farmers in the Indian state of "${state}". Prioritize STATE government schemes (run by the state's agriculture / horticulture / cooperation departments) that are specific to ${state}. Skip central schemes unless they have a ${state}-specific top-up or component.`
    : `Return the CURRENT and LATEST list of active CENTRAL government schemes helping Indian farmers (agriculture, insurance, credit, subsidy, irrigation, marketing, welfare). Include recently launched or updated schemes as of today.`;

  return `You are an expert on Indian government schemes for farmers. ${scope} Return 8-12 schemes.

Respond ENTIRELY in valid JSON only, no markdown, no code fences. Structure:
{
  "schemes": [
    {
      "id": "kebab-case-id",
      "name": "Official English name",
      "nameHi": "Hindi name",
      "description": "1-2 line English description",
      "descriptionHi": "1-2 line Hindi description",
      "benefits": ["English benefit 1", "benefit 2", "benefit 3"],
      "benefitsHi": ["Hindi benefit 1", "benefit 2", "benefit 3"],
      "eligibility": "English eligibility",
      "eligibilityHi": "Hindi eligibility",
      "amount": "English amount e.g. ₹6,000/year",
      "amountHi": "Hindi amount",
      "link": "https://official-website.gov.in/",
      "category": "subsidy | insurance | loan | support",
      "iconName": "IndianRupee | Shield | Tractor | Droplets | Wheat | Users | Landmark"
    }
  ]
}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
      throw new Error("Missing env config");
    }

    let state: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body?.state && typeof body.state === "string") {
          state = body.state.trim();
        }
      } catch { /* no body */ }
    }
    const rowId = state ? `state:${state.toLowerCase()}` : "latest";

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: buildSystemPrompt(state) },
          {
            role: "user",
            content: `Today is ${new Date().toISOString().slice(0, 10)}. ${
              state
                ? `Give the latest active government schemes for farmers in ${state} in the specified JSON format.`
                : `Give the latest active central government schemes for Indian farmers in the specified JSON format.`
            }`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI gateway ${aiResp.status}: ${t}`);
    }

    const aiData = await aiResp.json();
    const content = aiData.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const schemes = parsed.schemes;
    if (!Array.isArray(schemes) || schemes.length === 0) {
      throw new Error("AI returned no schemes");
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error } = await supabase
      .from("government_schemes")
      .upsert({ id: rowId, data: { schemes, state }, updated_at: new Date().toISOString() });
    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, id: rowId, state, count: schemes.length, updated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("refresh-government-schemes error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
