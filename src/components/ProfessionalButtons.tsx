import { ReactNode } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Edit, 
  Save, 
  Trash2, 
  Copy, 
  Share, 
  Eye, 
  EyeOff,
  Zap,
  Target,
  Shield,
  Star,
  Heart,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Settings,
  User,
  Bell,
  Home,
  Menu,
  MoreHorizontal,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Grid,
  List,
  Layout,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Database,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Volume2,
  VolumeX,
  Camera,
  Image,
  Video,
  Music,
  File,
  Folder,
  Archive,
  Bookmark,
  Tag,
  Flag,
  Pin,
  Map,
  Navigation,
  Compass,
  Globe,
  Link,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Reply,
  Forward,
  Archive as ArchiveIcon,
  Trash,
  Edit3,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  ListOrdered,
  Quote,
  Code,
  Terminal,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  HardDrive,
  Cpu,
  Memory,
  HardDrive as Storage,
  Wifi as Network,
  Bluetooth,
  Usb,
  Headphones,
  Speaker,
  Mic as Microphone,
  Video as VideoIcon,
  Camera as CameraIcon,
  Image as ImageIcon,
  Film,
  Music as MusicIcon,
  Radio,
  Tv,
  Gamepad2,
  Joystick,
  Keyboard,
  Mouse,
  MousePointer,
  Touchpad,
  Printer,
  Scanner,
  Fax,
  Copier,
  Shredder,
  Stapler,
  Pen,
  Pencil,
  Brush,
  Palette,
  Droplet,
  Sun,
  Moon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Gauge,
  Timer,
  Stopwatch,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarEdit,
  CalendarHeart,
  CalendarStar,
  CalendarUser,
  CalendarSearch,
  CalendarClock,
  CalendarEvent,
  CalendarTime,
  CalendarDate,
  CalendarToday,
  CalendarTomorrow,
  CalendarYesterday,
  CalendarWeek,
  CalendarMonth,
  CalendarYear,
  CalendarDecade,
  CalendarCentury,
  CalendarMillennium
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfessionalButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gradient?: boolean;
  glow?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  shake?: boolean;
  hover?: 'lift' | 'glow' | 'scale' | 'rotate' | 'none';
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function ProfessionalButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = 'lg',
  shadow = 'md',
  gradient = false,
  glow = false,
  pulse = false,
  bounce = false,
  shake = false,
  hover = 'lift',
  onClick,
  children,
  className = ''
}: ProfessionalButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg'
  };

  const variantClasses = {
    primary: gradient 
      ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white border-0'
      : 'bg-teal-600 hover:bg-teal-700 text-white border-0',
    secondary: gradient
      ? 'bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white border-0'
      : 'bg-slate-600 hover:bg-slate-700 text-white border-0',
    success: gradient
      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-0',
    warning: gradient
      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0'
      : 'bg-yellow-600 hover:bg-yellow-700 text-white border-0',
    error: gradient
      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0'
      : 'bg-red-600 hover:bg-red-700 text-white border-0',
    info: gradient
      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0'
      : 'bg-blue-600 hover:bg-blue-700 text-white border-0',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-0',
    outline: 'bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const hoverClasses = {
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-teal-500/25',
    scale: 'hover:scale-105',
    rotate: 'hover:rotate-3',
    none: ''
  };

  const animationClasses = [
    pulse ? 'animate-pulse' : '',
    bounce ? 'animate-bounce' : '',
    shake ? 'animate-shake' : '',
    glow ? 'shadow-lg shadow-teal-500/25' : ''
  ].filter(Boolean).join(' ');

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${roundedClasses[rounded]}
    ${shadowClasses[shadow]}
    ${hoverClasses[hover]}
    ${animationClasses}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    transition-all duration-200 ease-in-out
    font-semibold
    flex items-center justify-center gap-2
    ${className}
  `;

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : size === 'xl' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={iconSize}>
              {icon}
            </span>
          )}
          {icon && iconPosition === 'top' && (
            <div className="flex flex-col items-center gap-1">
              <span className={iconSize}>
                {icon}
              </span>
              <span>{children}</span>
            </div>
          )}
          {iconPosition !== 'top' && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className={iconSize}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// Specialized button components
export function PrimaryButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="secondary" />;
}

export function SuccessButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="success" />;
}

export function WarningButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="warning" />;
}

export function ErrorButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="error" />;
}

export function InfoButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="info" />;
}

export function GhostButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="ghost" />;
}

export function OutlineButton(props: Omit<ProfessionalButtonProps, 'variant'>) {
  return <ProfessionalButton {...props} variant="outline" />;
}

// Icon button variants
export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  ...props
}: Omit<ProfessionalButtonProps, 'children'> & { icon: ReactNode }) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-5 w-5';
  
  return (
    <ProfessionalButton
      {...props}
      variant={variant}
      size={size}
      className={`p-2 ${props.className || ''}`}
    >
      <span className={iconSize}>
        {icon}
      </span>
    </ProfessionalButton>
  );
}

// Action button group
export function ActionButtonGroup({ 
  actions, 
  orientation = 'horizontal' 
}: { 
  actions: Array<{
    label: string;
    icon: ReactNode;
    onClick: () => void;
    variant?: ProfessionalButtonProps['variant'];
    disabled?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-2`}>
      {actions.map((action, index) => (
        <ProfessionalButton
          key={index}
          variant={action.variant || 'outline'}
          icon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
          size="sm"
        >
          {action.label}
        </ProfessionalButton>
      ))}
    </div>
  );
}

// Floating action button
export function FloatingActionButton({
  icon,
  onClick,
  position = 'bottom-right',
  size = 'lg',
  ...props
}: Omit<ProfessionalButtonProps, 'children'> & {
  icon: ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <ProfessionalButton
      {...props}
      variant="primary"
      size={size}
      rounded="full"
      shadow="xl"
      glow
      hover="scale"
      className={`${positionClasses[position]} z-50 ${props.className || ''}`}
      onClick={onClick}
    >
      <span className="h-6 w-6">
        {icon}
      </span>
    </ProfessionalButton>
  );
}
