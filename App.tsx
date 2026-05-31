
import React, { useState, useEffect, useCallback } from 'react';
import { SophistCharacter, SceneData, GameStatus } from './types';
import { SOPHIST_CHARACTERS, INITIAL_AFFINITY, MAX_AFFINITY, ROMANCE_THRESHOLD, API_KEY_ERROR_MESSAGE, GEMINI_TEXT_MODEL } from './constants';
import { initializeAi, generateInitialScene, generateNextScene, generateImage } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import CharacterCard from './components/CharacterCard';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('char_select');
  const [currentCharacter, setCurrentCharacter] = useState<SophistCharacter | null>(null);
  const [currentSceneText, setCurrentSceneText] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('https://picsum.photos/600/800?grayscale&blur=2'); // Placeholder
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [affinity, setAffinity] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiKeyAvailable, setIsApiKeyAvailable] = useState<boolean>(false);
  const [dialogueKey, setDialogueKey] = useState<number>(0); // For unique keys for choices

  useEffect(() => {
    const aiInitialized = initializeAi();
    setIsApiKeyAvailable(aiInitialized);
    if (!aiInitialized) {
      setErrorMessage(API_KEY_ERROR_MESSAGE);
      setGameStatus('error');
    } else {
       // Initialize affinity for all characters
      const initialAffinities: Record<string, number> = {};
      SOPHIST_CHARACTERS.forEach(char => {
        initialAffinities[char.id] = INITIAL_AFFINITY;
      });
      setAffinity(initialAffinities);
    }
  }, []);

  const startNewGame = useCallback(async (character: SophistCharacter) => {
    if (!isApiKeyAvailable) return;
    setCurrentCharacter(character);
    setGameStatus('loading_scene');
    setErrorMessage(null);
    setCurrentSceneText('');
    setCurrentChoices([]);
    setCurrentImage(`https://picsum.photos/600/800?random=${character.id}`); // themed placeholder

    // Reset affinity for this character, or ensure it's at initial
    setAffinity(prev => ({...prev, [character.id]: INITIAL_AFFINITY}));

    const initialSceneData = await generateInitialScene(character);
    if (initialSceneData) {
      setCurrentSceneText(initialSceneData.storyText);
      setCurrentChoices(initialSceneData.choices);
      setDialogueKey(prev => prev + 1);

      if (initialSceneData.visualUpdatePrompt && initialSceneData.visualUpdatePrompt !== "None") {
        const newImage = await generateImage(initialSceneData.visualUpdatePrompt);
        if (newImage) setCurrentImage(newImage);
        else setCurrentImage(character.baseImagePrompt ? `https://picsum.photos/seed/${character.id}/600/800` : 'https://picsum.photos/600/800?grayscale'); // Fallback if image gen fails
      } else {
         // Fallback for initial scene if no prompt, use character default or generic
        const newImage = await generateImage(character.baseImagePrompt);
        if (newImage) setCurrentImage(newImage);
        else setCurrentImage(`https://picsum.photos/seed/${character.id}/600/800`);
      }
      setGameStatus('playing');
    } else {
      setErrorMessage(`Failed to start the story with ${character.name}. The stars may not be aligned.`);
      setGameStatus('error');
    }
  }, [isApiKeyAvailable]);

  const handleChoice = useCallback(async (choice: string) => {
    if (!currentCharacter || !isApiKeyAvailable) return;

    setGameStatus('loading_scene');
    const currentCharacterAffinity = affinity[currentCharacter.id] ?? INITIAL_AFFINITY;

    const nextSceneData = await generateNextScene(choice, currentCharacter, currentCharacterAffinity);

    if (nextSceneData) {
      setCurrentSceneText(nextSceneData.storyText);
      setCurrentChoices(nextSceneData.choices);
      setDialogueKey(prev => prev + 1);

      const newAffinity = Math.min(MAX_AFFINITY, Math.max(-MAX_AFFINITY, currentCharacterAffinity + nextSceneData.affinityChange));
      setAffinity(prev => ({ ...prev, [currentCharacter.id]: newAffinity }));
      
      if (newAffinity >= ROMANCE_THRESHOLD && !nextSceneData.storyText.toLowerCase().includes("congratulations")) {
         // Potentially trigger a romance ending or special dialogue branch if Gemini doesn't handle it
         // For now, let Gemini drive this.
      }

      if (nextSceneData.visualUpdatePrompt && nextSceneData.visualUpdatePrompt !== "None") {
        const newImage = await generateImage(nextSceneData.visualUpdatePrompt);
        if (newImage) setCurrentImage(newImage);
        // else keep current image
      }
      setGameStatus('playing');
    } else {
      setErrorMessage("An unexpected silence fell. Perhaps try a different path?");
      // Allow player to try again or go back
      setCurrentChoices(["Try to re-engage", "Return to character selection"]);
      setDialogueKey(prev => prev + 1);
      setGameStatus('playing'); // Or 'error' but with options
    }
  }, [currentCharacter, affinity, isApiKeyAvailable]);


  if (!isApiKeyAvailable && gameStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
        <div className="bg-red-800 border border-red-600 text-white p-8 rounded-lg shadow-xl max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Configuration Error</h1>
          <p className="text-lg">{errorMessage}</p>
          <p className="mt-4 text-sm">Please ensure the API key is correctly configured for the application to run.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (gameStatus) {
      case 'char_select':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-5xl font-bold text-center mb-4 text-pink-400 tracking-wider" style={{fontFamily: "'Brush Script MT', cursive"}}>Sophist Hearts</h1>
            <p className="text-xl text-center text-slate-300 mb-10">Choose your philosophical romance...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SOPHIST_CHARACTERS.map(char => (
                <CharacterCard key={char.id} character={char} onSelect={startNewGame} />
              ))}
            </div>
          </div>
        );
      case 'loading_scene':
        return <LoadingSpinner />;
      case 'playing':
        if (!currentCharacter) return <p>Error: Character not found.</p>;
        const charAffinity = affinity[currentCharacter.id] ?? INITIAL_AFFINITY;
        const affinityPercentage = (charAffinity / MAX_AFFINITY) * 100;

        return (
          <div className="flex flex-col lg:flex-row h-screen max-h-screen overflow-hidden">
            {/* Image Panel */}
            <div className="lg:w-2/5 xl:w-1/3 bg-slate-800 flex-shrink-0 relative">
              <img 
                src={currentImage} 
                alt={currentCharacter.name} 
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className={`absolute top-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg shadow-lg border-l-4 border-${currentCharacter.accentColor}`}>
                <h2 className={`text-3xl font-bold text-${currentCharacter.accentColor}`}>{currentCharacter.name}</h2>
                <p className="text-slate-300 italic">{currentCharacter.title}</p>
                <div className="mt-2">
                  <p className="text-sm text-slate-400">Affinity: {charAffinity} / {MAX_AFFINITY}</p>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
                    <div 
                      className={`bg-${currentCharacter.accentColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${Math.max(0, Math.min(100, affinityPercentage))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text and Choices Panel */}
            <div className="lg:w-3/5 xl:w-2/3 flex flex-col p-6 md:p-8 bg-slate-900 overflow-y-auto">
              <div className="prose prose-lg prose-invert max-w-none mb-8 flex-grow custom-scrollbar" dangerouslySetInnerHTML={{ __html: currentSceneText.replace(/\n/g, '<br />') }}></div>
              
              <div className="mt-auto pt-6 border-t border-slate-700">
                <h3 className="text-xl font-semibold mb-4 text-slate-300">Your move:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentChoices.map((choice, index) => (
                    <button
                      key={`${dialogueKey}-${index}`}
                      onClick={() => {
                        if (choice === "Return to character selection") {
                           setGameStatus('char_select');
                           setCurrentCharacter(null);
                        } else {
                           handleChoice(choice);
                        }
                      }}
                      className={`w-full p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
                                  bg-slate-700 hover:bg-${currentCharacter.accentColor.split('-')[0]}-600 text-slate-100 
                                  focus:outline-none focus:ring-2 focus:ring-${currentCharacter.accentColor.split('-')[0]}-500 focus:ring-opacity-75
                                  transform hover:scale-105 text-left`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                 {gameStatus === 'playing' && currentCharacter && (
                    <button
                        onClick={() => {
                            setGameStatus('char_select');
                            setCurrentCharacter(null); // Clear current character
                        }}
                        className="mt-6 w-full sm:w-auto p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out
                                   bg-slate-600 hover:bg-slate-500 text-slate-200 
                                   focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        Back to Character Selection
                    </button>
                )}
              </div>
            </div>
          </div>
        );
       case 'error':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md">
              <h1 className="text-3xl font-bold text-red-500 mb-4">An Error Occurred</h1>
              <p className="text-slate-300 mb-6">{errorMessage || "Something went wrong."}</p>
              <button
                onClick={() => {
                  setGameStatus('char_select');
                  setErrorMessage(null);
                }}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Return to Character Selection
              </button>
            </div>
          </div>
        );
      default:
        return <p>Unknown game state.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {renderContent()}
    </div>
  );
};

export default App;

    