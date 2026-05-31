
import { SophistCharacter } from './types';

export const API_KEY_ERROR_MESSAGE = "API_KEY is not configured. Please ensure process.env.API_KEY is set.";

export const SOPHIST_CHARACTERS: SophistCharacter[] = [
  {
    id: 'artemisia',
    name: 'Artemisia',
    title: 'The Hunter',
    description: 'Embodies the first definition of a Sophist – the paid hunter of pedigreed young men. Rustic, practical, and direct.',
    philosophy: 'The pursuit and capture of knowledge (and affections) through skillful hunting and strategy. Values self-reliance and tangible results.',
    baseImagePrompt: 'Beautiful anime girl, Artemisia, rustic charm, vibrant long red hair, piercing green eyes, wearing a practical dark green leather hunting cloak and tunic, holding a intricately carved wooden longbow, quiver with arrows on her back. Determined yet inviting expression. Enchanted forest background with dappled sunlight. Ultra high quality fantasy anime art style, detailed, atmospheric.',
    accentColor: 'green-500',
  },
  {
    id: 'emporia',
    name: 'Emporia',
    title: 'The Merchant',
    description: 'Represents the second definition – a traveling merchant of knowledge. Sophisticated, eloquent, and business-savvy.',
    philosophy: 'Knowledge as a valuable commodity to be traded and acquired. Values eloquence, persuasion, and mutually beneficial exchanges.',
    baseImagePrompt: 'Elegant anime girl, Emporia, sophisticated merchant attire (flowing silk robes in deep blues and golds, ornate jewelry), intelligent lavender eyes, holding a decorative scroll tied with a ribbon. Confident and charismatic expression. Background of an opulent ancient library or a bustling, exotic marketplace stall filled with rare texts. Ultra high quality historical fantasy anime art style, detailed, rich textures.',
    accentColor: 'blue-500',
  },
  {
    id: 'reta',
    name: 'Reta',
    title: 'The Avant-Garde Retailer',
    description: 'Inspired by the third definition (local retailer), re-imagined as an avant-garde thinker engaging with time as value. Hipster aesthetic, philosophical.',
    philosophy: 'Time as the ultimate currency and the subjective experience of value. Challenges conventional notions of worth and meaning through an artistic and deconstructive lens.',
    baseImagePrompt: 'Chic avant-garde anime girl, Reta, asymmetrical silver bob haircut, sharp amethyst eyes, wearing layered deconstructed clothing in monochrome with a single neon pink accessory. Thoughtful, slightly enigmatic expression. Holding a vintage philosophy book. Background: A minimalist art gallery with a single, striking abstract sculpture depicting distorted clocks, or a surreal urban landscape with fragmented time motifs. Ultra high quality modern anime art style, stylish, conceptual.',
    accentColor: 'pink-500',
  },
  {
    id: 'eris',
    name: 'Eris',
    title: 'The Master Disputant',
    description: 'Based on the fourth definition – the eristic, a master of debate and intellectual combat. Sharp, competitive, and performs erudition brilliantly (Rin Tohsaka inspired).',
    philosophy: 'The art of argumentation (eristic) as the highest form of intellectual engagement. Values victory in debate, logical prowess, and dazzling rhetorical skill.',
    baseImagePrompt: 'Powerful anime girl, Eris, resembling Rin Tohsaka (long dark twintails, red and black academic-style outfit), piercing ruby eyes, confident and articulate posture, a slight, challenging smirk. Background: A grand debate hall or a university lecture theatre, possibly with magical glyphs of logic in the air. Ultra high quality action anime art style, dynamic, sharp details.',
    accentColor: 'red-600',
  },
  {
    id: 'kathara',
    name: 'Kathara',
    title: 'The Purifier of Souls',
    description: 'Embodies the fifth definition – the purifier who cleanses the soul of false opinions. Serene, methodical, and philosophically rigorous (Kant-inspired).',
    philosophy: 'The purification of understanding through rigorous critique and adherence to universal moral principles (Kantian ethics). Values clarity, consistency, and duty.',
    baseImagePrompt: 'Serene and composed anime girl, Kathara, long flowing white hair, calm sapphire blue eyes, wearing elegant, simple white and pale blue robes with clean lines. Gentle, wise expression. Holding a single, perfect white lily. Background: A tranquil, minimalist Zen garden or a library filled with ordered philosophical texts, light streaming through a window. Ultra high quality ethereal anime art style, peaceful, luminous.',
    accentColor: 'sky-400',
  },
  {
    id: 'phantasia',
    name: 'Phantasia',
    title: 'The Benevolent Illusionist',
    description: 'Represents the sixth definition (illusionist/imitator), but portrays illusion as a positive force to reveal deeper truths. Playful, enigmatic, and philosophically provocative (Zizek, Derrida, Baudrillard inspired).',
    philosophy: 'Illusion and spectacle (phantasmagoria) as tools to deconstruct perceived reality and reveal hidden desires or societal contradictions. Values playful subversion and the power of appearances.',
    baseImagePrompt: 'Mysterious and playful anime girl, Phantasia, multicolored iridescent hair that seems to shift, captivating heterochromatic eyes (one gold, one violet), wearing a theatrical, layered outfit with optical illusion patterns. Mischievous yet knowing smile. Surrounded by floating, semi-transparent playing cards or butterflies. Background: A surreal dreamscape, a hall of mirrors reflecting impossible scenes, or a stage with dramatic lighting. Ultra high quality fantasy anime art style, vibrant, whimsical.',
    accentColor: 'purple-500',
  },
  {
    id: 'doxa',
    name: 'Doxa',
    title: 'The Weaver of Contradictions',
    description: 'Based on the seventh definition – the producer of contradictions. Reflective, challenging, and sees truth in paradox (Hegel-inspired).',
    philosophy: 'The dialectical process and the synthesis of opposing ideas. Finds truth and understanding within contradictions and paradoxes, embracing complexity.',
    baseImagePrompt: 'Intriguing anime girl, Doxa, with contrasting features (e.g., half long black hair, half short white hair, or wearing one elegant glove and one punk-style fingerless glove), thoughtful, deep emerald eyes. Enigmatic expression, a subtle, knowing smile. Holding a Mobius strip or a yin-yang symbol. Background: An abstract space where geometric shapes morph and perspectives clash, or a library where books on opposing philosophies glow faintly. Ultra high quality conceptual anime art style, thought-provoking, balanced.',
    accentColor: 'yellow-400',
  },
];

export const INITIAL_AFFINITY = 0;
export const MAX_AFFINITY = 10;
export const ROMANCE_THRESHOLD = 7;

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
export const IMAGEN_IMAGE_MODEL = "imagen-3.0-generate-002";

    