import { ROASTS } from './components/Roasts';

export const getRandomRoast = (score: number): string => {
  const safeScore = Math.min(Math.max(score, 0), 4);
  const options = ROASTS[safeScore];
  
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};