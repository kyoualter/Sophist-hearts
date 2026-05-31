
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SophistCharacter, SceneData, GeminiResponseJson } from '../types';
import { GEMINI_TEXT_MODEL, IMAGEN_IMAGE_MODEL } from '../constants';

let ai: GoogleGenAI | null = null;
let currentChat: Chat | null = null;

function getApiKey(): string | undefined {
  // In a real build environment, process.env.API_KEY would be substituted.
  // For local dev, you might use a .env file and a bundler like Vite.
  // This is a simplified check.
  return process.env.API_KEY;
}

export function initializeAi(): boolean {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("API_KEY is not available. Please set process.env.API_KEY.");
    return false;
  }
  ai = new GoogleGenAI({ apiKey });
  return true;
}

function parseGeminiResponse(responseText: string): GeminiResponseJson | null {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  try {
    return JSON.parse(jsonStr) as GeminiResponseJson;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Raw response:", responseText);
    // Try to salvage storyText if parsing fails but text exists
    if (responseText.includes('"storyText"')) {
        return {
            storyText: "Error: The story took an unexpected turn. Let's try something else.",
            choices: ["Try a different approach", "Reflect on what happened"],
            visualUpdatePrompt: "None",
            affinityChange: 0
        };
    }
    return null;
  }
}


export async function generateInitialScene(character: SophistCharacter): Promise<SceneData | null> {
  if (!ai) {
    console.error("AI not initialized.");
    return null;
  }

  currentChat = ai.chats.create({
    model: GEMINI_TEXT_MODEL,
    config: {
      responseMimeType: "application/json",
      systemInstruction: `You are a master storyteller for "Sophist Hearts", a romantic text adventure game. The player is trying to romance anime girl characters based on Plato's Sophists.
      The game is starting. The player has chosen to interact with ${character.name}, ${character.title}.
      Her personality: ${character.description}.
      Her core philosophy: ${character.philosophy}.
      Generate an engaging introductory scene where the player encounters ${character.name}. Describe the setting, her appearance (consistent with her base image prompt: ${character.baseImagePrompt}), and initial demeanor.
      The scene should lead to an interaction. Provide 2-3 distinct and engaging choices for the player's first interaction.
      Output a JSON object: { "storyText": "...", "choices": ["...", "..."], "visualUpdatePrompt": "Detailed visual description for Imagen, matching the scene and character. THIS IS NOT 'None' for the first scene.", "affinityChange": 0 }`
    },
  });

  try {
    const response: GenerateContentResponse = await currentChat.sendMessage({
        message: `Begin the story. Introduce me to ${character.name}.`
    });
    const parsed = parseGeminiResponse(response.text);
    if (!parsed) throw new Error("Failed to parse initial scene response.");
    return parsed;
  } catch (error) {
    console.error("Error generating initial scene:", error);
    return null;
  }
}

export async function generateNextScene(
  playerChoice: string,
  character: SophistCharacter,
  currentAffinity: number
): Promise<SceneData | null> {
  if (!ai || !currentChat) {
    console.error("AI or chat not initialized.");
    return null;
  }
  
  const romanceProgress = Math.round((currentAffinity / 7) * 100); // 7 is ROMANCE_THRESHOLD

  try {
     const response: GenerateContentResponse = await currentChat.sendMessage({
      message: `My choice was: "${playerChoice}".
      Continue the story with ${character.name}.
      Current romance progress with her is ${romanceProgress}%.
      Her personality: ${character.description}.
      Her core philosophy: ${character.philosophy}.
      The story should naturally flow. Describe her reaction and the evolving situation.
      Provide 2-3 distinct and engaging choices for the player.
      If the scene changes significantly visually (new location, dramatic expression), describe this in "visualUpdatePrompt". Otherwise, set "visualUpdatePrompt": "None".
      Suggest an "affinityChange": (integer: 1 for positive, -1 for negative, 0 for neutral) based on how this part of the story (resulting from player's *previous* choice) might affect affinity.
      Output a JSON object: { "storyText": "...", "choices": ["...", "..."], "visualUpdatePrompt": "...", "affinityChange": 0 }`
    });
    
    const parsed = parseGeminiResponse(response.text);
     if (!parsed) throw new Error("Failed to parse next scene response.");
    return parsed;
  } catch (error) {
    console.error("Error generating next scene:", error);
    return null;
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  if (!ai) {
    console.error("AI not initialized.");
    return null;
  }
  if (prompt === "None" || !prompt) return null;

  try {
    const response = await ai.models.generateImages({
      model: IMAGEN_IMAGE_MODEL,
      prompt: `${prompt}. Ensure the character matches their established appearance if mentioned. Ultra high quality anime art style, detailed, atmospheric.`,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
    