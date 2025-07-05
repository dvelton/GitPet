import { motion } from 'framer-motion';
import { PetState } from '../lib/types';
import { 
  Brain, 
  Code, 
  FlameSimple, 
  Heart, 
  Lightning, 
  Sparkle 
} from '@phosphor-icons/react';

interface PetDisplayProps {
  pet: PetState;
  onInteract: () => void;
}

export function PetDisplay({ pet, onInteract }: PetDisplayProps) {
  // Generate animation styles based on pet's state
  const getAnimationClass = () => {
    if (pet.mood === 'ecstatic' || pet.energy === 'supercharged') {
      return 'celebrate-animation';
    }
    
    if (pet.mood === 'happy' || pet.energy === 'energetic') {
      return 'pulse-animation';
    }
    
    return 'float-animation';
  };
  
  const getMoodEmoji = () => {
    switch (pet.mood) {
      case 'ecstatic': return '😍';
      case 'happy': return '😊';
      case 'content': return '🙂';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      case 'disappointed': return '😞';
      default: return '🙂';
    }
  };
  
  const getEnergyEmoji = () => {
    switch (pet.energy) {
      case 'supercharged': return '⚡';
      case 'energetic': return '✨';
      case 'normal': return '👍';
      case 'tired': return '😴';
      case 'exhausted': return '💤';
      default: return '👍';
    }
  };
  
  const getPetEmoji = () => {
    // Base pet by type
    const baseEmoji = {
      octocat: '🐙',
      fox: '🦊',
      blob: '👾',
    }[pet.type];
    
    // Growth stage modifies the display
    const growthModifier = {
      baby: '🥚',
      young: baseEmoji,
      adult: baseEmoji,
      senior: '👑' + baseEmoji,
    }[pet.growth];
    
    return growthModifier;
  };
  
  return (
    <motion.div 
      className="pet-container flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className={`text-9xl mb-4 ${getAnimationClass()}`} 
        onClick={onInteract}
      >
        {getPetEmoji()}
      </div>
      
      <div className="flex space-x-4 items-center justify-center">
        <div className="text-2xl" title="Mood">{getMoodEmoji()}</div>
        <div className="text-2xl" title="Energy">{getEnergyEmoji()}</div>
      </div>
      
      <motion.div
        className="text-xl font-semibold mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {pet.name}
      </motion.div>
      
      <div className="text-sm text-muted-foreground mt-2">
        {pet.traits.join(' · ')}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-sm">
            <Heart weight="fill" className="text-destructive" />
            <span>Happiness</span>
          </div>
          <div className="h-2 bg-muted rounded-full mt-1">
            <div 
              className="stat-bar bg-destructive" 
              style={{ width: `${pet.stats.happiness}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-sm">
            <Lightning weight="fill" className="text-amber-500" />
            <span>Energy</span>
          </div>
          <div className="h-2 bg-muted rounded-full mt-1">
            <div 
              className="stat-bar bg-amber-500" 
              style={{ width: `${pet.stats.energy}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-sm">
            <FlameSimple weight="fill" className="text-secondary" />
            <span>Growth</span>
          </div>
          <div className="h-2 bg-muted rounded-full mt-1">
            <div 
              className="stat-bar bg-secondary" 
              style={{ width: `${pet.stats.growth}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-sm">
            <Code weight="fill" className="text-accent" />
            <span>Consistency</span>
          </div>
          <div className="h-2 bg-muted rounded-full mt-1">
            <div 
              className="stat-bar bg-accent" 
              style={{ width: `${pet.stats.consistency}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}