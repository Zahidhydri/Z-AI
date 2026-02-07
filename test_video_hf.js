
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        if (!fs.existsSync(envPath)) { return {}; }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) { env[match[1].trim()] = match[2].trim(); }
        });
        return env;
    } catch (e) { return {}; }
}

const env = loadEnv();
const token = env['HUGGINGFACE_TOKEN'];

if (!token) {
    console.error("HUGGINGFACE_TOKEN not found");
    process.exit(1);
}

const data = JSON.stringify({ inputs: "A cute robot, 4k, high quality" });

const models = [
    'damo-vilab/text-to-video-ms-1.7b',
    'ali-vilab/text-to-video-ms-1.7b',
    'cerspense/zeroscope_v2_576w',
    'strangeman3107/animov-512x'
];

function testModel(model) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'router.huggingface.co',
            path: `/hf-inference/models/${model}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': data.length
            }
        };

        console.log(`Testing model: ${model}...`);
        const req = https.request(options, (res) => {
            let bodyParts = [];
            res.on('data', (chunk) => bodyParts.push(chunk));
            res.on('end', () => {
                const body = Buffer.concat(bodyParts);
                console.log(`STATUS: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log(`SUCCESS: ${model} works!`);
                    resolve(model);
                } else {
                    console.log(`FAILED: ${model}`);
                    console.log('Error:', body.toString().substring(0, 200));
                    resolve(null);
                }
            });
        });
        req.on('error', (e) => {
            console.error(`Request error for ${model}: ${e.message}`);
            resolve(null);
        });
        req.write(data);
        req.end();
    });
}

async function runTests() {
    for (const model of models) {
        const result = await testModel(model);
        if (result) {
            console.log(`\nFound working model: ${result}`);
            process.exit(0);
        }
    }
    console.log("\nNo working models found.");
    process.exit(1);
}

runTests();
