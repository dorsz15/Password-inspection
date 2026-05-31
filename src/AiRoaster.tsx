import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const roastPassword = async (score: number, patterns: string[]) => {
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

  const prompt = `
    You are a sarcastic, ruthless, and slightly tsundere AI assistant. 
    Analyze this password, which received a score of ${score}/4 (where 0 is garbage, 4 is god-tier).
    Detected patterns in the password: ${patterns.join(', ')}.

    - If the score is 0 or 1: Be absolutely brutal. Use a "yo mama" joke or mock their intelligence. Treat them like an amateur.
    - If the score is 2: Be disappointed and sarcastic. Point out why they are lazy.
    - If the score is 3 or 4: Act like a tsundere. Say something like "It's not like I'm impressed or anything, b-baka... but your password is actually decent."

    Keep the response to exactly one punchy, hilarious sentence. Use slang, be edgy, and don't be polite.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("BŁĄD API:", error);
    return "Hmph... my brain is currently lagging, just like your security.";
  }
};

export const checkAvailableModels = async () => {
  try {
    // Używamy genAI bezpośrednio
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("DOSTĘPNE MODELE:", data.models.map((m: any) => m.name));
  } catch (error) {
    console.error("Nie udało się pobrać listy modeli:", error);
  }
};

(window as any).checkAvailableModels = checkAvailableModels;