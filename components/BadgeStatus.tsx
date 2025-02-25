import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield } from 'lucide-react';

type BadgeType = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE';

const getBadgeStyles = (badgeType: BadgeType) => {
  const styles = {
    PLATINUM: {
      background: 'bg-gradient-to-r from-slate-300 to-slate-100',
      text: 'text-gray-800',
      border: 'border-slate-400',
      icon: 'text-gray-700',
      glow: 'shadow-[0_0_15px_rgba(226,232,240,0.3)]'
    },
    GOLD: {
      background: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      text: 'text-yellow-950',
      border: 'border-yellow-600',
      icon: 'text-yellow-800',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
    },
    SILVER: {
      background: 'bg-gradient-to-r from-gray-400 to-gray-300',
      text: 'text-gray-800',
      border: 'border-gray-500',
      icon: 'text-gray-700',
      glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]'
    },
    BRONZE: {
      background: 'bg-gradient-to-r from-orange-700 to-orange-500',
      text: 'text-orange-100',
      border: 'border-orange-800',
      icon: 'text-orange-200',
      glow: 'shadow-[0_0_15px_rgba(194,65,12,0.3)]'
    },
    NONE: {
      background: 'bg-gray-700',
      text: 'text-gray-300',
      border: 'border-gray-600',
      icon: 'text-gray-400',
      glow: ''
    }
  };
  return styles[badgeType] || styles.NONE;
};

interface BadgeData {
  badge: BadgeType;
  currentDays: number;
  nextBadge?: BadgeType;
  daysToNextBadge?: number;
}

interface BadgeStatusProps {
  badgeData: BadgeData;
  isLoading: boolean;
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ badgeData, isLoading }) => {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!badgeData) return null;

  const { badge, currentDays, nextBadge, daysToNextBadge } = badgeData;
  const styles = getBadgeStyles(badge);

  // Calculate progress percentage
  const progressPercentage = nextBadge && daysToNextBadge
    ? (currentDays / (currentDays + daysToNextBadge)) * 100
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`relative group`}>
          <Badge 
            className={`
              ${styles.background} ${styles.text} ${styles.border} ${styles.glow}
              px-4 py-2 text-sm font-bold flex items-center gap-2
              rounded-lg border-2 transition-all duration-300
              hover:scale-105 cursor-pointer
            `}
          >
            <Shield 
              className={`h-5 w-5 ${styles.icon} drop-shadow-md`} 
              fill="currentColor" 
              fillOpacity={0.2}
            />
            <span className="tracking-wide">{badge}</span>
          </Badge>
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
        </div>
        <span className="text-sm text-gray-400 font-medium">
          {currentDays} active days
        </span>
      </div>
      
      {nextBadge && daysToNextBadge && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            {daysToNextBadge} more active days for {nextBadge} badge
          </div>
          <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercentage}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeStatus;