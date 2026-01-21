import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4.24.1"

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
        const openAiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAiKey) throw new Error('Missing OPENAI_API_KEY');

        const openai = new OpenAI({ apiKey: openAiKey });

        // 2. Auth Check (Optional but recommended)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        // if (authError || !user) throw new Error('Unauthorized'); // Enable if strictly needed

        // 3. Parse Request
        const { type, description, specificAnswers, agent } = await req.json()

        const systemPrompt = `
        You are an expert ${agent === 'creative' ? 'UI/UX Designer' : agent === 'business' ? 'Business Analyst' : 'Software Architect'}.
        Your goal is to transform a user's idea into a comprehensive technical project blueprint.
        
        Generate a JSON response for a ${type} project.
        Description: ${description}
        Specific Requirements: ${JSON.stringify(specificAnswers)}

        The response MUST be a JSON object with this EXACT structure:
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
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Faster for latency
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Please build the blueprint for: ${description}` }
            ],
            temperature: 0.7,
        });

        const projectPlan = JSON.parse(completion.choices[0].message.content || '{}');

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
