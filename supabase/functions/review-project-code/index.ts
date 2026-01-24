import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
        if (!replicateToken) throw new Error('Missing REPLICATE_API_TOKEN');

        const replicate = new Replicate({
            auth: replicateToken,
        });

        const { projectData } = await req.json();

        // Prepare a summary of the project to keep tokens low
        const projectContext = {
            name: projectData.projectName,
            description: projectData.description,
            techStack: projectData.techStack,
            features: projectData.features,
            fileCount: Object.keys(projectData.files || {}).length
        };

        const systemPrompt = `
        You are a Senior QA Engineer and Code Auditor. 
        Your job is to review the architecture and planned features of a software project.

        Analyze the provided project context and generate a QA report in JSON format.
        
        The JSON MUST follow this EXACT structure:
        {
            "score": 95, 
            "checks": [
                { "id": 1, "title": "Arabic Title", "status": "pass" or "warning", "msg": "Arabic description" }
            ],
            "summary": "Arabic summary of the review"
        }

        Include 4 specific checks:
        1. Architecture (Clean Architecture compliance)
        2. Tech Stack Suitability
        3. Feature Completeness (matches description)
        4. Scalability & Security

        Output ONLY valid JSON.
        `;

        const input = {
            top_k: 50,
            top_p: 0.9,
            prompt: `Review this project: ${JSON.stringify(projectContext)}`,
            system_prompt: systemPrompt,
            max_tokens: 1000,
            temperature: 0.5
        };

        let output;
        try {
            output = await replicate.run("meta/meta-llama-3-70b-instruct", { input });
        } catch (e) {
            console.error("Replicate failed", e);
            throw e;
        }

        const completionText = Array.isArray(output) ? output.join('') : output;
        const cleanJson = completionText.replace(/```json\n?|\n?```/g, '').trim();
        const review = JSON.parse(cleanJson);

        return new Response(
            JSON.stringify(review),
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
