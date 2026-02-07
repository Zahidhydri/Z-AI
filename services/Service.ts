import { GoogleGenAI, Chat } from "@google/genai";

// 1. Access the Gemini API key correctly using process.env
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set. Check your .env.local and vite.config.ts");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const VIDEO_GENERATION_MESSAGES = [
    "Warming up the video engine...",
    "Gathering creative digital particles...",
    "Directing the digital actors...",
    "Rendering the first few frames...",
    "This is taking a bit longer than usual, but good things come to those who wait!",
    "Polishing the pixels...",
    "Applying cinematic filters...",
    "Finalizing the masterpiece...",
];

/**
 * Creates and returns a new chat session instance.
 * @returns A Chat instance from the GoogleGenAI SDK.
 */
export const createChat = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and creative AI assistant named ZAI. Your responses should be formatted in markdown.',
        }
    });
    return chat;
};

/**
 * Generates an image using the Hugging Face Inference API with Stable Diffusion.
 * @param prompt The text prompt to generate the image from.
 * @returns A local URL for the generated image blob.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
        // 2. Access the Hugging Face token correctly using process.env
        const token = process.env.HUGGINGFACE_TOKEN;
        if (!token) {
            throw new Error("HUGGINGFACE_TOKEN is not set in your .env.local file.");
        }

        console.log("Using Hugging Face Token:", token.substring(0, 5) + "...");

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (response.status === 401) {
            console.error("Hugging Face API request failed with status 401 (Unauthorized).");
            throw new Error("Unauthorized: Invalid Hugging Face Token. Please check your .env.local file.");
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Hugging Face API error response:", errorText);
            throw new Error(`Hugging Face API returned status ${response.status}: ${errorText}`);
        }

        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error(`Failed to generate image. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    }
};


/**
 * Generates a video based on a text prompt.
 * @param prompt The text prompt to generate the video from.
 * @param setLoadingMessage A callback to update the loading message on the UI.
 * @returns A blob URL for the generated video.
 */
export const generateVideo = async (prompt: string, setLoadingMessage: (message: string) => void): Promise<string> => {
    try {
        setLoadingMessage("Checking video generation service availability...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Access the Hugging Face token correctly using process.env
        const token = process.env.HUGGINGFACE_TOKEN;
        if (!token) {
            throw new Error("HUGGINGFACE_TOKEN is not set in your .env.local file.");
        }

        setLoadingMessage("Sending request to video model...");

        // Using damo-vilab/text-to-video-ms-1.7b which is a common open model
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/damo-vilab/text-to-video-ms-1.7b",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (response.status === 404 || response.status === 503) {
            throw new Error("Free video generation service is currently unavailable or overloaded. Please try again later.");
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Hugging Face Video API error:", errorText);
            throw new Error(`Video generation failed: ${response.status} ${response.statusText}`);
        }

        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate video.");
    }
};


/**
 * Refines a user's prompt to be more descriptive for media generation.
 * @param prompt The user's initial prompt.
 * @returns A refined, more detailed prompt string.
 */
export const refinePrompt = async (prompt: string): Promise<string> => {
    try {
        const systemInstruction = "You are an expert prompt engineer for generative AI. Refine the following user prompt to make it more descriptive, vivid, and detailed for generating a high-quality image or video. Your response should be a single, continuous string of text that is the refined prompt itself, without any introductory phrases, explanations, or markdown formatting.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Refine this prompt: "${prompt}"`,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error refining prompt:", error);
        throw new Error("Failed to refine prompt.");
    }
};