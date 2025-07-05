import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster, toast } from 'sonner';
import { Sparkle } from '@phosphor-icons/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { PetDisplay } from './components/PetDisplay';
import { ActivityLog } from './components/ActivityLog';
import { PetReaction } from './components/PetReaction';
import { OnboardingModal } from './components/OnboardingModal';
import { SimulationControls } from './components/SimulationControls';

import { PetState, ActivityLog as ActivityLogType, PetPersonality, ActivityType } from './lib/types';
import { createNewPet, createPetPersonality, updatePetState, getReactionForActivity, generateRandomActivity } from './lib/petUtils';

function App() {
  // Persistent state
  const [pet, setPet] = useKV<PetState | null>("git-pet", null);
  const [activityLogs, setActivityLogs] = useKV<ActivityLogType[]>("activity-logs", []);
  const [personality, setPersonality] = useKV<PetPersonality | null>("pet-personality", null);
  
  // UI state
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Handle onboarding completion
  const handleOnboardingComplete = (petName: string) => {
    const newPet = createNewPet(petName);
    setPet(newPet);
    
    const newPersonality = createPetPersonality(newPet.traits);
    setPersonality(newPersonality);
    
    toast.success(`${petName} is ready to grow with your code!`);
  };
  
  // Handle pet interaction
  const handlePetInteraction = () => {
    if (pet) {
      const phrases = [
        `${pet.name} seems to appreciate the attention!`,
        `${pet.name} nudges your cursor playfully.`,
        `${pet.name} looks at you expectantly, waiting for code.`,
        `${pet.name} spins around happily!`,
      ];
      
      setCurrentReaction(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };
  
  // Handle activity generation
  const handleActivityGenerated = (activityType: ActivityType) => {
    if (!pet || !personality) return;
    
    // Generate activity description based on type
    const descriptions: Record<ActivityType, string[]> = {
      commit: [
        "Added new feature implementation",
        "Fixed bug in authentication flow",
        "Refactored database queries for performance",
        "Updated documentation and comments"
      ],
      pr_open: [
        "Feature: User profile page",
        "Fix: Broken login on Safari",
        "Enhancement: Improved form validation",
        "Refactor: Reorganize component structure"
      ],
      pr_review: [
        "Reviewed authentication changes",
        "Approved UI updates PR",
        "Requested changes to error handling",
        "Left comments on code style"
      ],
      pr_merge: [
        "Merged feature branch into main",
        "Completed integration of payment system",
        "Finalized new UI components",
        "Deployed hotfix to production"
      ],
      issue_open: [
        "Bug: Users can't reset password",
        "Enhancement: Add dark mode support",
        "Performance: Slow loading on mobile devices",
        "Security: Update deprecated library"
      ],
      issue_close: [
        "Fixed: Password reset functionality",
        "Implemented: Dark mode support",
        "Optimized: Mobile performance",
        "Updated: All security vulnerabilities addressed"
      ],
      documentation: [
        "Updated API documentation",
        "Added JSDoc comments to core functions",
        "Created onboarding guide for new developers",
        "Documented database schema"
      ],
      broken_build: [
        "Build failed: Missing dependency",
        "Tests failing on CI pipeline",
        "Deployment failed due to environment variables",
        "Integration tests breaking on main branch"
      ],
      inactivity: [
        "No activity detected for several days",
        "Project seems to be on hold",
        "Waiting for feedback or next steps",
        "Development paused temporarily"
      ]
    };
    
    const randomDescription = descriptions[activityType][
      Math.floor(Math.random() * descriptions[activityType].length)
    ];
    
    // Create new activity log
    const newActivity: ActivityLogType = {
      type: activityType,
      timestamp: new Date().toISOString(),
      description: randomDescription
    };
    
    // Add to logs
    setActivityLogs(currentLogs => [newActivity, ...currentLogs].slice(0, 50));
    
    // Generate pet reaction
    const reaction = getReactionForActivity(pet, activityType, personality);
    setCurrentReaction(reaction);
    
    // Update pet state
    const updatedPet = updatePetState(pet, [newActivity], personality);
    setPet(updatedPet);
    
    // Show toast for significant activities
    if (['pr_merge', 'broken_build'].includes(activityType)) {
      const message = activityType === 'pr_merge'
        ? `${pet.name} is celebrating your merge!`
        : `${pet.name} looks concerned about the broken build.`;
        
      toast(message, {
        icon: activityType === 'pr_merge' ? '🎉' : '😟'
      });
    }
  };
  
  // Handle random activity generation
  const handleRandomActivity = () => {
    const randomActivity = generateRandomActivity();
    
    // Add to logs
    setActivityLogs(currentLogs => [randomActivity, ...currentLogs].slice(0, 50));
    
    // Update pet state if we have one
    if (pet && personality) {
      const reaction = getReactionForActivity(pet, randomActivity.type, personality);
      setCurrentReaction(reaction);
      
      const updatedPet = updatePetState(pet, [randomActivity], personality);
      setPet(updatedPet);
    }
  };
  
  // Reset all data (for development)
  const resetData = () => {
    setPet(null);
    setActivityLogs([]);
    setPersonality(null);
    toast.success('All data has been reset');
  };
  
  // Handle initial welcome message
  useEffect(() => {
    if (isInitialLoad && pet) {
      setCurrentReaction(`Welcome back! ${pet.name} has been waiting for you.`);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, pet]);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkle weight="fill" className="text-primary h-6 w-6" />
            <h1 className="text-xl font-bold">GitPet</h1>
          </div>
          
          {pet && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                {pet.streakDays} day streak
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetData}
                className="text-xs text-muted-foreground"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        {pet ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <PetDisplay pet={pet} onInteract={handlePetInteraction} />
                  <PetReaction message={currentReaction} />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>
                    Recent GitHub activity that affects your pet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityLog activities={activityLogs} petName={pet.name} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Simulation</CardTitle>
                  <CardDescription>
                    Generate activity to see how your pet reacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimulationControls
                    onActivityGenerated={handleActivityGenerated}
                    onRandomActivity={handleRandomActivity}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}
      </main>
      
      <footer className="border-t border-border py-4">
        <div className="container flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            GitPet: Visualizing GitHub activity as a virtual pet
          </p>
          <p className="text-xs text-muted-foreground">
            {pet ? `Pet Age: ${pet.totalActivities} activities` : ''}
          </p>
        </div>
      </footer>
      
      <Toaster position="top-center" />
    </div>
  );
}

export default App;