
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

async function testModel(model) {
    return new Promise((resolve) => {
        const data = JSON.stringify({ inputs: "cat" });
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
            console.log(`${model}: ${res.statusCode}`);
            resolve(res.statusCode); // 200 is success, 503 is loading (also good sign), 404 is missing
        });
        req.on('error', () => resolve(0));
        req.write(data);
        req.end();
    });
}

async function run() {
    const models = [
        'damo-vilab/text-to-video-ms-1.7b',
        'ali-vilab/text-to-video-ms-1.7b',
        'ByteDance/AnimateDiff-Lightning',
        'modelscope/text-to-video-ms-1.7b',
        'cerspense/zeroscope_v2_576w',
        'multimodalart/zeroscope_v2_576w'
    ];

    for (const m of models) {
        await testModel(m);
    }
}

run();
