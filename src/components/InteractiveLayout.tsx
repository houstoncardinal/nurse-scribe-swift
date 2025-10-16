import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Grid3X3, 
  List, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Eye,
  EyeOff,
  Settings,
  Filter,
  Search,
  SortAsc,
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface InteractiveLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showDashboard?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  layoutMode?: 'grid' | 'list' | 'compact';
  onLayoutChange?: (mode: 'grid' | 'list' | 'compact') => void;
}

export function InteractiveLayout({
  children,
  title,
  subtitle,
  showDashboard = true,
  showFilters = true,
  showSearch = true,
  layoutMode = 'grid',
  onLayoutChange
}: InteractiveLayoutProps) {
  const [currentLayout, setCurrentLayout] = useState(layoutMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const layoutOptions = [
    { id: 'grid', icon: Grid3X3, label: 'Grid View', description: 'Card-based layout' },
    { id: 'list', icon: List, label: 'List View', description: 'Compact list format' },
    { id: 'compact', icon: LayoutDashboard, label: 'Compact View', description: 'Dense information display' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'recent', label: 'Recent' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'drafts', label: 'Drafts' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'priority', label: 'Priority' },
    { value: 'time', label: 'Time Created' }
  ];

  const quickStats = [
    {
      label: 'Total Items',
      value: '156',
      change: '+12',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: '142',
      change: '+8',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      label: 'In Progress',
      value: '14',
      change: '+4',
      trend: 'up',
      color: 'text-yellow-600'
    },
    {
      label: 'Efficiency',
      value: '94%',
      change: '+2%',
      trend: 'up',
      color: 'text-purple-600'
    }
  ];

  const handleLayoutChange = (mode: 'grid' | 'list' | 'compact') => {
    setCurrentLayout(mode);
    onLayoutChange?.(mode);
  };

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900' : ''
    }`}>
      {/* Interactive Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="p-4">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="hidden md:flex"
              >
                {showSidebar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          {showDashboard && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="p-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Interactive Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* Filters & Sort */}
            {showFilters && (
              <div className="flex gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={currentLayout === option.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleLayoutChange(option.id as any)}
                    className={`h-8 px-3 ${
                      currentLayout === option.id 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-sm' 
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Today's Schedule
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Activity
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">This Week</span>
                      <span className="font-semibold text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Accuracy</span>
                      <span className="font-semibold text-blue-600">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Time Saved</span>
                      <span className="font-semibold text-purple-600">5.2h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className={`transition-all duration-300 ${
              currentLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :
              currentLayout === 'list' ? 'space-y-2' :
              'space-y-1'
            }`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
