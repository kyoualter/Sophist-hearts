
import React from 'react';
import { SophistCharacter } from '../types';

interface CharacterCardProps {
  character: SophistCharacter;
  onSelect: (character: SophistCharacter) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onSelect }) => {
  const hoverBgColor = `hover:bg-${character.accentColor.split('-')[0]}-700`;
  const borderColor = `border-${character.accentColor}`;
  const ringColor = `focus:ring-${character.accentColor}`;

  return (
    <button
      onClick={() => onSelect(character)}
      className={`w-full p-6 bg-slate-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 ${borderColor} ${hoverBgColor} focus:outline-none focus:ring-4 ${ringColor} text-left`}
    >
      <h3 className={`text-2xl font-bold text-${character.accentColor} mb-2`}>{character.name}</h3>
      <p className="text-slate-400 text-sm mb-3 italic">{character.title}</p>
      <p className="text-slate-300 text-base">{character.description}</p>
    </button>
  );
};

export default CharacterCard;
    