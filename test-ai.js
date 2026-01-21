const fs = require('fs');
const https = require('https');

async function testConnectivity() {
    console.log('🔍 Reading .env file...');
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/OPENAI_API_KEY=(.+)/);

        if (!match || !match[1]) {
            console.error('❌ Could not find OPENAI_API_KEY in .env');
            return;
        }

        const apiKey = match[1].trim();
        console.log('🔑 Key found (ends in: ...' + apiKey.slice(-5) + ')');

        const data = JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say 'The AI is ready!'" }],
            max_tokens: 20
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': data.length
            }
        };

        console.log('🚀 Sending request to OpenAI...');

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (d) => { responseBody += d; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(responseBody);
                    console.log('\n✅ TEST SUCCESSFUL!');
                    console.log('🤖 AI Response:', json.choices[0].message.content);
                } else {
                    console.error(`\n❌ TEST FAILED (Status ${res.statusCode})`);
                    console.error('Response:', responseBody);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error);
        });

        req.write(data);
        req.end();

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testConnectivity();
