const fs = require('fs');
const https = require('https');

async function testReplicate() {
    console.log('🔍 Reading .env file...');
    try {
        const env = fs.readFileSync('.env', 'utf8');
        // Match REPLICATE_API_TOKEN or replicate
        const match = env.match(/REPLICATE_API_TOKEN=(.+)/) || env.match(/replicate=(.+)/);

        if (!match || !match[1]) {
            console.error('❌ Could not find REPLICATE_API_TOKEN in .env');
            return;
        }

        const apiKey = match[1].trim();
        console.log('🔑 Key found (ends in: ...' + apiKey.slice(-5) + ')');

        const options = {
            hostname: 'api.replicate.com',
            port: 443,
            path: '/v1/models/meta/meta-llama-3-70b-instruct',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        };

        console.log('🚀 Checking Replicate API access...');

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (d) => { responseBody += d; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(responseBody);
                    console.log('\n✅ REPLICATE CONNECTION SUCCESSFUL!');
                    console.log('📦 Model Access Confirmed:', json.owner + '/' + json.name);
                } else {
                    console.error(`\n❌ TEST FAILED (Status ${res.statusCode})`);
                    console.error('Response:', responseBody);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error);
        });

        req.end();

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testReplicate();
