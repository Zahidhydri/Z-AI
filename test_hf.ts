
import fs from 'fs';
import path from 'path';
import https from 'https';

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim();
            }
        });
        return env;
    } catch (e) {
        console.error("Error reading .env:", e);
        return {};
    }
}

const env = loadEnv();
const token = env['HUGGINGFACE_TOKEN'];

if (!token) {
    console.error("HUGGINGFACE_TOKEN not found in .env");
    process.exit(1);
}

console.log("Token found (starting with):", token.substring(0, 5));

const data = JSON.stringify({ inputs: "A cute robot parsing debugging logs" });

const options = {
    hostname: 'api-inference.huggingface.co',
    path: '/models/stabilityai/stable-diffusion-xl-base-1.0',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': data.length
    }
};

console.log("Sending request to HF API...");

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        // Don't print full binary data if it's an image, but HF inference usually errors in JSON or returns binary
        if (res.headers['content-type']?.includes('application/json') || res.statusCode !== 200) {
            body += chunk;
        } else {
            body = "[Binary Image Data]";
        }
    });
    res.on('end', () => {
        console.log('Response body:', body.substring(0, 200));
        if (res.statusCode === 200) {
            console.log("SUCCESS: Image generated successfully.");
        } else {
            console.error("FAILURE: API request failed.");
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
