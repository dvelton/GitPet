import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityType } from '../lib/types';
import { 
  GitCommit, 
  GitPullRequest, 
  Code, 
  GitMerge,
  Bug, 
  CheckCircle,
  BookOpen,
  WarningCircle,
  Clock
} from '@phosphor-icons/react';

interface SimulationControlsProps {
  onActivityGenerated: (type: ActivityType) => void;
  onRandomActivity: () => void;
}

export function SimulationControls({ 
  onActivityGenerated, 
  onRandomActivity 
}: SimulationControlsProps) {
  const [activeTab, setActiveTab] = useState('actions');
  
  return (
    <Tabs defaultValue="actions" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="simulate">Simulation</TabsTrigger>
        </TabsList>
        
        {activeTab === 'simulate' && (
          <Button variant="outline" onClick={onRandomActivity}>
            Random Activity
          </Button>
        )}
      </div>
      
      <TabsContent value="actions" className="mt-0">
        <div className="text-sm mb-4 text-muted-foreground">
          Click on an action to simulate GitHub activity:
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('commit')}
          >
            <GitCommit weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Commit</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('pr_open')}
          >
            <GitPullRequest weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Open PR</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('pr_review')}
          >
            <Code weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Review PR</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('pr_merge')}
          >
            <GitMerge weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Merge PR</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('issue_open')}
          >
            <Bug weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Open Issue</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('issue_close')}
          >
            <CheckCircle weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Close Issue</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('documentation')}
          >
            <BookOpen weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Docs</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('broken_build')}
          >
            <WarningCircle weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Break Build</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 px-2"
            onClick={() => onActivityGenerated('inactivity')}
          >
            <Clock weight="fill" className="mb-1 h-5 w-5" />
            <span className="text-xs">Inactivity</span>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="simulate" className="mt-0">
        <div className="text-sm mb-4 text-muted-foreground">
          In a real implementation, your pet would react automatically to your actual GitHub activity.
          This is just a simulation to demonstrate the concept.
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-1">How it would work</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Connect to GitHub with OAuth</li>
              <li>• Monitor activity via webhooks</li>
              <li>• React to real commits, PRs, reviews, etc.</li>
              <li>• Analyze code quality and build status</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}