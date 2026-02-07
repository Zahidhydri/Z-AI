
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser to avoid deps
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            console.error(".env file not found at", envPath);
            return {};
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const env = {};
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
    hostname: 'router.huggingface.co',
    path: '/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
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
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    // res.setEncoding('utf8'); // Binary data might be returned
    res.on('data', (chunk) => {
        // Simple check for JSON vs binary
        if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
            body += chunk;
        } else {
            body = "[Binary Image Data]";
        }
    });
    res.on('end', () => {
        if (body !== "[Binary Image Data]") {
            console.log('Response body:', body.substring(0, 500));
        } else {
            console.log('Response body: [Binary Image Data received]');
        }

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
