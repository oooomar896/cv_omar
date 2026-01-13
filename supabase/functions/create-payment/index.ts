import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
        // 2. Auth Check (Secure)
        const supabaseClient = createClient(
            // @ts-ignore
            Deno.env.get('SUPABASE_URL') ?? '',
            // @ts-ignore
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            throw new Error('Unauthorized: Invalid user token')
        }

        // 3. Parse Body
        const { amount, currency, description, project_id, payment_method } = await req.json()

        // 4. Validate Input
        if (!amount || amount <= 0) throw new Error('Invalid amount')

        console.log(`Processing payment for User: ${user.id}, Amount: ${amount}`)

        // 5. Moyasar Integration (Ready Structure)
        // const moyasarApiKey = Deno.env.get('MOYASAR_API_KEY')
        // const moyasarUrl = 'https://api.moyasar.com/v1/payments'

        // Mocking the Moyasar Response for now
        const mockMoyasarResponse = {
            id: "pay_" + Math.random().toString(36).substr(2, 9),
            status: "initiated",
            amount: amount,
            currency: currency || 'SAR',
            description: description,
            amount_format: `${amount} SAR`,
            fee: 0,
            fee_format: "0 SAR",
            refunded: 0,
            refunded_format: "0 SAR",
            captured: 0,
            captured_format: "0 SAR",
            invoice_id: null,
            ip: null,
            callback_url: "https://your-domain.com/payment/callback",
            created_at: new Date().toISOString(),
            source: {
                type: payment_method || "creditcard",
                company: "visa",
                name: "Moyasar Test",
                number: "XXXX-XXXX-XXXX-1111"
            }
        }

        // 6. Record Transaction in DB (Audit Log)
        /* 
        const { error: dbError } = await supabaseClient
            .from('financial_transactions')
            .insert({
                user_id: user.id,
                transaction_id: mockMoyasarResponse.id,
                amount: amount,
                status: 'pending'
            })
        */

        return new Response(
            JSON.stringify(mockMoyasarResponse),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        )

    } catch (error) {
        console.error("Payment Error:", error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        )
    }
})
