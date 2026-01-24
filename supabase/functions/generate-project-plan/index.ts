import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    // 1. CORS Handle to avoid 405/401 on preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("🚀 Function invoked: generate-project-plan");

        // Verify Environment Variables
        const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

        if (!replicateToken) {
            console.error("❌ Missing REPLICATE_API_TOKEN");
            throw new Error('Server Config Error: Missing Replicate Token');
        }

        const replicate = new Replicate({
            auth: replicateToken,
        });

        // 2. Parse Request Body
        let body;
        try {
            body = await req.json();
        } catch (e) {
            throw new Error('Invalid JSON body');
        }

        const { type, description, specificAnswers, agent } = body;

        console.log(`📝 Converting request for ${type}: ${description?.substring(0, 50)}...`);

        const systemPrompt = `
        You are an expert ${agent === 'creative' ? 'UI/UX Designer' : agent === 'business' ? 'Business Analyst' : 'Software Architect'}.
        Your goal is to transform a user's idea into a comprehensive technical project blueprint.
        
        Generate a JSON response for a ${type} project.
        Description: ${description}
        Specific Requirements: ${JSON.stringify(specificAnswers)}

        The response MUST be a raw JSON object with this EXACT structure and nothing else. Do not verify, do not explain, just output JSON:
        {
          "projectName": "string",
          "summary": "string in Arabic",
          "features": ["feature 1", "feature 2"...],
          "techStack": ["React", "Supabase"...],
          "analysis": {
             "marketPotential": "عالي/متوسط/منخفض",
             "competition": "عالي/متوسط/منخفض",
             "suggestedStack": "string",
             "businessValue": "string description"
          },
          "phases": [
             { "name": "Phase Name", "duration": "Time" }
          ],
          "files": {
             "src/index.js": "code content...",
             "README.md": "documentation..."
          }
        }
        
        Ensure "files" contains a flat object where keys are file paths and values are stringified code.
        Create a robust starter kit code structure based on ${type}.
        All user-facing text and descriptions must be in Arabic.
        IMPORTANT: Return ONLY the JSON object. No markdown formatting, no backticks.
        `;

        const input = {
            top_k: 50,
            top_p: 0.9,
            prompt: `Please build the blueprint for: ${description}`,
            system_prompt: systemPrompt,
            max_tokens: 3000,
            temperature: 0.7
        };

        console.log("🤖 Sending to Replicate (Llama 3)...");

        let output;
        try {
            output = await replicate.run("meta/meta-llama-3-70b-instruct", { input });
        } catch (e) {
            console.error("❌ Replicate Error:", e);
            throw new Error(`AI Model Error: ${e.message}`);
        }

        const completionText = Array.isArray(output) ? output.join('') : output;
        const cleanJson = completionText.replace(/```json\n?|\n?```/g, '').trim();

        let projectPlan = {};
        try {
            projectPlan = JSON.parse(cleanJson);
        } catch (e) {
            console.error("❌ JSON Parse Error. Raw Output:", cleanJson);
            throw new Error("Failed to parse AI response as JSON");
        }

        console.log("✅ Success! Plan generated.");

        return new Response(
            JSON.stringify(projectPlan),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        )

    } catch (error) {
        console.error("🔥 Fatal Handler Error:", error.message);

        // Return 200 with error object so client doesn't generic-fail
        return new Response(
            JSON.stringify({
                error: error.message,
                details: "Check Supabase Function Logs for more info"
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200 // Intentionally 200 to pass through client network checks
            }
        )
    }
})
