const OpenAI = require('openai');
require('dotenv').config();

async function testOpenAI() {
    console.log('--- Testing OpenAI Connectivity ---');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error('❌ Error: OPENAI_API_KEY is missing in .env file');
        process.exit(1);
    }

    console.log('Using API Key ending in: ...' + apiKey.slice(-4));

    const openai = new OpenAI({ apiKey: apiKey });

    try {
        console.log('Sending a simple request to GPT-3.5-Turbo...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say 'Success' if you can hear me." }],
            max_tokens: 10
        });

        console.log('✅ Response from AI:', completion.choices[0].message.content);
        console.log('--- Test Passed! ---');
    } catch (error) {
        console.error('❌ Error calling OpenAI:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testOpenAI();
