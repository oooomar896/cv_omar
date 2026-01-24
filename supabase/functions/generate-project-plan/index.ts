import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // 1. CORS Handle
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
        if (!replicateToken) throw new Error('Missing REPLICATE_API_TOKEN');

        const replicate = new Replicate({
            auth: replicateToken,
        });

        // 2. Auth Check (Optional but recommended)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        // if (authError || !user) throw new Error('Unauthorized'); // Enable if strictly needed

        // 3. Parse Request
        const { type, description, specificAnswers, agent } = await req.json()

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
            max_tokens: 3000, // Generous limit for code generation
            temperature: 0.7
        };

        let output;
        try {
            output = await replicate.run("meta/meta-llama-3-70b-instruct", { input });
        } catch (e) {
            // Fallback to older model if alias fails or other error
            console.error("Replicate Llama 3 failed, trying fallback...", e);
            throw e;
        }

        // Replicate returns an array of strings
        const completionText = Array.isArray(output) ? output.join('') : output;

        // Clean up markdown code blocks if present (common in LLM output)
        const cleanJson = completionText.replace(/```json\n?|\n?```/g, '').trim();

        let projectPlan = {};
        try {
            projectPlan = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Parse Error", e);
            console.log("Raw Output:", cleanJson);
            throw new Error("Failed to parse AI response as JSON");
        }

        return new Response(
            JSON.stringify(projectPlan),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        )
    }
})
