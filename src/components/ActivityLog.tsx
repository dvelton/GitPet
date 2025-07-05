import { formatDistance } from 'date-fns';
import { ActivityLog as ActivityLogType } from '../lib/types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Code,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  BookOpen,
  Bug,
  Clock
} from '@phosphor-icons/react';

interface ActivityLogProps {
  activities: ActivityLogType[];
  petName: string;
}

// Fallback function if date-fns has issues
const formatTimeAgo = (dateString: string): string => {
  try {
    return formatDistance(new Date(dateString), new Date(), { 
      addSuffix: true 
    });
  } catch (error) {
    // Simple fallback if date-fns fails
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    return `${Math.round(diffHr / 24)} days ago`;
  }
};

export function ActivityLog({ activities, petName }: ActivityLogProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground text-sm">
          No recent activities. {petName} is waiting for you to code!
        </p>
      </div>
    );
  }
  
  const getActivityIcon = (type: ActivityLogType['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit weight="fill" size={20} className="text-foreground" />;
      case 'pr_open':
        return <GitPullRequest weight="fill" size={20} className="text-primary" />;
      case 'pr_review':
        return <Code weight="fill" size={20} className="text-accent" />;
      case 'pr_merge':
        return <GitMerge weight="fill" size={20} className="text-secondary" />;
      case 'issue_open':
        return <Bug weight="fill" size={20} className="text-destructive" />;
      case 'issue_close':
        return <Bug weight="fill" size={20} className="text-accent" />;
      case 'documentation':
        return <BookOpen weight="fill" size={20} className="text-amber-500" />;
      case 'broken_build':
        return <GitBranch weight="fill" size={20} className="text-destructive" />;
      case 'inactivity':
        return <Clock weight="fill" size={20} className="text-muted-foreground" />;
      default:
        return <Code weight="fill" size={20} className="text-foreground" />;
    }
  };
  
  const getActivityName = (type: ActivityLogType['type']) => {
    switch (type) {
      case 'commit': return 'Commit';
      case 'pr_open': return 'PR Opened';
      case 'pr_review': return 'PR Review';
      case 'pr_merge': return 'PR Merged';
      case 'issue_open': return 'Issue Opened';
      case 'issue_close': return 'Issue Closed';
      case 'documentation': return 'Documentation';
      case 'broken_build': return 'Broken Build';
      case 'inactivity': return 'Inactivity';
      default: return 'Activity';
    }
  };
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 pr-3">
        {activities.map((activity, index) => (
          <Card key={index} className="p-3 flex items-start space-x-3">
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium truncate">
                  {getActivityName(activity.type)}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}