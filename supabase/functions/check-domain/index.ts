import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Check Domain Function Invoked")

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { domain } = await req.json()

        if (!domain) {
            throw new Error('Domain name is required')
        }

        console.log(`Checking availability for: ${domain}`)

        // ---------------------------------------------------------
        // REAL NAMECHEAP INTEGRATION START
        // ---------------------------------------------------------

        // Credentials from Supabase Secrets
        // You must set these using: supabase secrets set NAMECHEAP_API_KEY=...
        const apiUser = Deno.env.get('NAMECHEAP_USER')
        const apiKey = Deno.env.get('NAMECHEAP_API_KEY')
        const clientIp = Deno.env.get('CLIENT_IP') || '1.1.1.1'

        if (apiUser && apiKey) {
            try {
                // Use Sandbox URL for testing (change to api.namecheap.com for production)
                const baseUrl = 'https://api.sandbox.namecheap.com/xml.response'

                const url = `${baseUrl}?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${apiUser}&Command=namecheap.domains.check&ClientIp=${clientIp}&DomainList=${domain}`

                console.log(`Calling Namecheap API: ${baseUrl}`)
                const response = await fetch(url)
                const text = await response.text()

                // IMPORTANT: Namecheap returns XML. In a robust production app, use an XML parser.
                // For now, we will log the output so you can verify it in Supabase dashboard.
                console.log("Namecheap Raw Response:", text.substring(0, 500))

                // Future Step: Parse XML 'Available="true/false"' attribute
            } catch (err) {
                console.error("Namecheap API Error:", err)
            }
        }

        // ---------------------------------------------------------
        // MOCK LOGIC FALLBACK
        // ---------------------------------------------------------

        const isTaken = domain.toLowerCase().startsWith('taken') || domain.toLowerCase().includes('google');

        const basePrice = 45; // SAR
        const premiumFactor = domain.length < 5 ? 5 : 1;
        const price = basePrice * premiumFactor;

        const mockResponse = {
            domain: domain,
            available: !isTaken,
            price: price,
            currency: 'SAR',
            premium: premiumFactor > 1,
            period: 1, // year
            checked_at: new Date().toISOString()
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
