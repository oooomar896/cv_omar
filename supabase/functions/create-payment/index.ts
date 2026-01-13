import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Create Payment Function Invoked")

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Get the user from the authorization header (simulated validation for now or use Supabase client)
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        // 2. Parse request body
        const { amount, currency, description, metadata } = await req.json()

        // 🚧 TODO: Integrate with Moyasar API here
        // const payment = await moyasar.payments.create({ ... })

        // For now, we simulate a successful payment initiation
        console.log(`Processing payment: ${amount} ${currency} for ${description}`)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockResponse = {
            id: "pay_" + Math.random().toString(36).substr(2, 9),
            status: "initiated",
            amount: amount,
            currency: currency || 'SAR',
            description: description,
            // In a real scenario, this would be the Moyasar payment URL
            transaction_url: `https://api.moyasar.com/v1/payments/pay_test_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        }

        return new Response(
            JSON.stringify(mockResponse),
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
