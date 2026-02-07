
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        const env = {};
        const envPath = path.resolve(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
            for (const line of lines) {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) env[match[1].trim()] = match[2].trim();
            }
        }
        return env;
    } catch (e) { return {}; }
}

const env = loadEnv();
const token = env['HUGGINGFACE_TOKEN'];

if (!token) { console.error("No token"); process.exit(1); }

async function testModel(model, input) {
    return new Promise((resolve) => {
        const data = JSON.stringify({ inputs: input });
        const options = {
            hostname: 'router.huggingface.co',
            path: `/hf-inference/models/${model}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                console.log(`\nModel: ${model}`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response Preview: ${body.substring(0, 150)}`);
                resolve(res.statusCode === 200);
            });
        });
        req.on('error', e => {
            console.error(`Error: ${e.message}`);
            resolve(false);
        });
        req.write(data);
        req.end();
    });
}

async function run() {
    // 1. Verify Script Logic with SDXL (Known Good)
    console.log("--- Verifying Script Logic with SDXL ---");
    await testModel('stabilityai/stable-diffusion-xl-base-1.0', 'cat');

    // 2. Test Video Models
    console.log("\n--- Testing Video Models ---");
    const videoModels = [
        'damo-vilab/text-to-video-ms-1.7b',
        'ali-vilab/text-to-video-ms-1.7b',
        'cerspense/zeroscope_v2_576w',
        'polygraph-ai/text-to-video-ms-1.7b'
    ];

    for (const model of videoModels) {
        await testModel(model, 'astronaut riding a horse');
    }
}

run();
