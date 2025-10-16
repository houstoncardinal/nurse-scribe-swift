import { ReactNode } from 'react';
import { 
  Star, 
  Zap, 
  Target, 
  Shield, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Heart,
  Crown,
  Gem,
  Sparkles,
  Rocket,
  Lightbulb,
  Flame,
  Thunder,
  Diamond,
  Medal,
  Trophy,
  Badge as BadgeIcon,
  Pin,
  Flag,
  Bookmark,
  Tag,
  Label,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Shield as ShieldIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  Sparkles as SparklesIcon,
  Rocket as RocketIcon,
  Lightbulb as LightbulbIcon,
  Flame as FlameIcon,
  Thunder as ThunderIcon,
  Diamond as DiamondIcon,
  Medal as MedalIcon,
  Trophy as TrophyIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfessionalHeadlineProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'muted' | 'accent';
  gradient?: boolean;
  centered?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo' | 'gray';
  };
  subtitle?: string;
  description?: string;
  highlight?: boolean;
  glow?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

export function ProfessionalHeadline({
  variant = 'h1',
  size = '2xl',
  weight = 'bold',
  color = 'primary',
  gradient = false,
  centered = false,
  icon,
  iconPosition = 'left',
  badge,
  subtitle,
  description,
  highlight = false,
  glow = false,
  pulse = false,
  children,
  className = ''
}: ProfessionalHeadlineProps) {
  const Component = variant;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };

  const colorClasses = {
    primary: gradient 
      ? 'bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent'
      : 'text-teal-600 dark:text-teal-400',
    secondary: gradient
      ? 'bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent'
      : 'text-slate-600 dark:text-slate-400',
    success: gradient
      ? 'bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent'
      : 'text-emerald-600 dark:text-emerald-400',
    warning: gradient
      ? 'bg-gradient-to-r from-yellow-600 to-orange-700 bg-clip-text text-transparent'
      : 'text-yellow-600 dark:text-yellow-400',
    error: gradient
      ? 'bg-gradient-to-r from-red-600 to-pink-700 bg-clip-text text-transparent'
      : 'text-red-600 dark:text-red-400',
    info: gradient
      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent'
      : 'text-blue-600 dark:text-blue-400',
    muted: 'text-slate-500 dark:text-slate-400',
    accent: gradient
      ? 'bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent'
      : 'text-purple-600 dark:text-purple-400'
  };

  const badgeColorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800',
    green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800',
    red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800',
    purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800',
    pink: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-800',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800',
    gray: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800'
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    ${centered ? 'text-center' : ''}
    ${highlight ? 'bg-yellow-100 dark:bg-yellow-950/20 px-2 py-1 rounded-md' : ''}
    ${glow ? 'drop-shadow-lg' : ''}
    ${pulse ? 'animate-pulse' : ''}
    transition-all duration-300 ease-in-out
    ${className}
  `;

  const iconSize = size === 'xs' ? 'h-3 w-3' : 
                   size === 'sm' ? 'h-4 w-4' : 
                   size === 'md' ? 'h-5 w-5' : 
                   size === 'lg' ? 'h-6 w-6' : 
                   size === 'xl' ? 'h-7 w-7' : 
                   size === '2xl' ? 'h-8 w-8' : 
                   size === '3xl' ? 'h-9 w-9' : 
                   size === '4xl' ? 'h-10 w-10' : 
                   size === '5xl' ? 'h-12 w-12' : 
                   'h-14 w-14';

  if (iconPosition === 'top' || iconPosition === 'bottom') {
    return (
      <div className={`${centered ? 'text-center' : ''} space-y-2`}>
        {badge && (
          <div className="flex justify-center">
            <Badge className={badgeColorClasses[badge.color || 'blue']}>
              {badge.text}
            </Badge>
          </div>
        )}
        
        {iconPosition === 'top' && icon && (
          <div className="flex justify-center">
            <span className={iconSize}>
              {icon}
            </span>
          </div>
        )}
        
        <Component className={baseClasses}>
          {children}
        </Component>
        
        {iconPosition === 'bottom' && icon && (
          <div className="flex justify-center">
            <span className={iconSize}>
              {icon}
            </span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`${centered ? 'text-center' : ''} space-y-2`}>
      {badge && (
        <div className="flex justify-center">
          <Badge className={badgeColorClasses[badge.color || 'blue']}>
            {badge.text}
          </Badge>
        </div>
      )}
      
      <div className={`flex items-center ${centered ? 'justify-center' : ''} gap-3`}>
        {iconPosition === 'left' && icon && (
          <span className={iconSize}>
            {icon}
          </span>
        )}
        
        <Component className={baseClasses}>
          {children}
        </Component>
        
        {iconPosition === 'right' && icon && (
          <span className={iconSize}>
            {icon}
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
      
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

// Specialized headline components
export function HeroHeadline(props: Omit<ProfessionalHeadlineProps, 'size' | 'weight'>) {
  return <ProfessionalHeadline {...props} size="5xl" weight="black" centered />;
}

export function SectionHeadline(props: Omit<ProfessionalHeadlineProps, 'size' | 'weight'>) {
  return <ProfessionalHeadline {...props} size="3xl" weight="bold" />;
}

export function SubsectionHeadline(props: Omit<ProfessionalHeadlineProps, 'size' | 'weight'>) {
  return <ProfessionalHeadline {...props} size="2xl" weight="semibold" />;
}

export function CardHeadline(props: Omit<ProfessionalHeadlineProps, 'size' | 'weight'>) {
  return <ProfessionalHeadline {...props} size="xl" weight="semibold" />;
}

export function FeatureHeadline(props: Omit<ProfessionalHeadlineProps, 'size' | 'weight' | 'gradient'>) {
  return <ProfessionalHeadline {...props} size="lg" weight="semibold" gradient />;
}

// Status headlines
export function SuccessHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="success" 
      icon={<CheckCircle />}
    />
  );
}

export function WarningHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="warning" 
      icon={<AlertCircle />}
    />
  );
}

export function ErrorHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="error" 
      icon={<AlertCircle />}
    />
  );
}

export function InfoHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="info" 
      icon={<Info />}
    />
  );
}

// Achievement headlines
export function AchievementHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon' | 'gradient'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="accent" 
      icon={<Award />}
      gradient
      glow
    />
  );
}

export function MilestoneHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon' | 'gradient'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="primary" 
      icon={<Target />}
      gradient
      pulse
    />
  );
}

export function PremiumHeadline(props: Omit<ProfessionalHeadlineProps, 'color' | 'icon' | 'gradient'>) {
  return (
    <ProfessionalHeadline 
      {...props} 
      color="accent" 
      icon={<Crown />}
      gradient
      glow
    />
  );
}
