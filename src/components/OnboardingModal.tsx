import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingModalProps {
  onComplete: (petName: string) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [petName, setPetName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petName.trim().length >= 1) {
      onComplete(petName.trim());
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to GitPet!</CardTitle>
            <CardDescription>
              Your new digital pet thrives on your GitHub activity. What would you like to name your pet?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} id="pet-name-form">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="pet-name"
                    placeholder="Enter a name for your pet"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="text-center"
                    autoFocus
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-center mt-6">
              <div className="text-7xl animate-bounce">
                {/* Random pet emoji */}
                {['🐙', '🦊', '👾'][Math.floor(Math.random() * 3)]}
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="text-center">
                Your pet will respond to your GitHub activity:
              </p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-accent">•</span> Commits make it happy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> PR reviews give it energy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">•</span> Merges make it celebrate
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span> Broken builds make it sad
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              form="pet-name-form" 
              type="submit" 
              className="w-full"
              disabled={petName.trim().length < 1}
            >
              Create your GitPet
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}