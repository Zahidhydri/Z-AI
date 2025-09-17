import { GoogleGenAI, Chat } from "@google/genai";

// The Gemini API key is still needed for the prompt refiner
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        const token = import.meta.env.VITE_HUGGINGFACE_TOKEN;
        if (!token) {
            throw new Error("VITE_HUGGINGFACE_TOKEN is not set in your .env.local file.");
        }

        console.log("Using Hugging Face Token:", token.substring(0, 5) + "...");

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", 
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
        // Placeholder for video generation.
        // Integrating a free video generation model often requires more setup,
        // such as self-hosting an open-source model like Open-Sora.
        // For now, we'll simulate the process and return a placeholder video.

        setLoadingMessage(VIDEO_GENERATION_MESSAGES[0]);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work

        let messageIndex = 1;
        for (let i = 0; i < 5; i++) {
            setLoadingMessage(VIDEO_GENERATION_MESSAGES[messageIndex % VIDEO_GENERATION_MESSAGES.length]);
            messageIndex++;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate polling
        }


        // In a real implementation, you would poll your video generation service
        // and then download the video when it's ready.
        setLoadingMessage("Video generation is not yet implemented with a free API.");

        // Return a placeholder or throw an error
        throw new Error("Video generation with a free API is not yet implemented.");

    } catch (error) {
        console.error("Error generating video:", error);
        throw new Error("Failed to generate video. This feature is not yet fully implemented with a free API.");
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