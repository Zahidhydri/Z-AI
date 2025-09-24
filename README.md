To prove I am giving you the raw code, here is the entire `README.md` file again, but this time it's inside a special block that prevents the chat from rendering it. **This is the code you can copy.**

```markdown
# 🎨 Z-AI Media Generator

Z-AI is a sleek and modern web application that leverages the power of generative AI to create stunning images from text prompts. Built with React, TypeScript, and Vite, it provides a seamless and interactive user experience for bringing your creative ideas to life.

---

## ✨ Features

* **📝 Text-to-Image Generation**: Utilizes the **Hugging Face Inference API** with the Stable Diffusion model to generate high-quality images.
* **🪄 Prompt Refinement**: Integrates the **Google Gemini API** to intelligently enhance and add detail to your simple prompts, unlocking more creative potential.
* **🖼️ Modern UI**: A clean, responsive, and user-friendly interface built with **Tailwind CSS**, featuring loading animations and clear error handling.
* **↔️ Image/Video Toggle**: A stylish toggle allows for future expansion into video generation. (Note: Video generation is currently a placeholder).
* **🔐 Secure API Key Handling**: All API keys are managed securely using environment variables.

---

## 🛠️ Tech Stack

* **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Generative AI APIs**:
    * **Image Generation**: [Hugging Face Inference API](https://huggingface.co/inference-api) (Stable Diffusion)
    * **Prompt Refinement**: [Google Gemini API](https://ai.google.dev/)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18 or later)
* npm / yarn / pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Zahidhydri/Z-AI.git](https://github.com/Zahidhydri/Z-AI.git)
    cd Z-AI
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a file named `.env.local` in the root of the project.
    * Add your API keys to this file. You will need a Hugging Face token for image generation and a Google Gemini API key for the prompt refiner.

    **File: `.env.local`**
    ```
    # Get this from your Hugging Face account settings
    VITE_HUGGINGFACE_TOKEN='YOUR_HUGGINGFACE_TOKEN_HERE'

    # Get this from Google AI Studio
    API_KEY='YOUR_GEMINI_API_KEY_HERE'
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or whatever port is shown in your terminal) to view the application in your browser.

---

## ⚙️ How It Works

The application is structured into several key components:

* `MediaGenerator.tsx`: The main component that manages the application's state, including the prompt, loading status, and results.
* `GeneratorForm.tsx`: The user interface for the input text area and the "Generate" / "Refine" buttons.
* `MediaDisplay.tsx`: Renders the generated image, loading indicators, or error messages.
* `services/Services.ts`: A dedicated module that handles all external API calls to Hugging Face and Google AI. This keeps the business logic separate from the UI components.


## Author

- Zahid hydri

