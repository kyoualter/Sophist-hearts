
export interface SophistCharacter {
  id: string;
  name: string;
  title: string;
  description: string; // Short bio / Platonic definition link
  philosophy: string; // Core philosophical theme
  baseImagePrompt: string; // Base prompt for Imagen
  accentColor: string; // Tailwind color class for theming, e.g., 'pink-500'
}

export interface SceneData {
  storyText: string;
  choices: string[];
  visualUpdatePrompt: string; // Prompt for Imagen, or "None"
  affinityChange: number; 
}

export interface GeminiResponseJson {
  storyText: string;
  choices: string[];
  visualUpdatePrompt: string;
  affinityChange: number;
}

export type GameStatus = 'char_select' | 'loading_scene' | 'playing' | 'error';

    