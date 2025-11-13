import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Grid, List, Star, Clock, TrendingUp, Zap,
  ChevronDown, X, CheckCircle, Heart, Sparkles, Award,
  Stethoscope, Pill, Droplets, Bandage, Shield, Activity,
  Baby, Users, ClipboardList, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  unifiedTemplateRegistry,
  UnifiedTemplate,
  TemplateCategory,
  getTemplateIcon,
  getTemplateColor,
  formatTemplateTime,
  getTemplateDifficultyColor
} from '@/lib/unifiedTemplates';

interface TemplateSelectorProps {
  onTemplateSelect: (template: UnifiedTemplate) => void;
  selectedTemplate?: string;
  userContext?: {
    unitType?: string;
    experience?: 'beginner' | 'intermediate' | 'advanced';
    timeAvailable?: number;
  };
  className?: string;
}

interface FilterState {
  category: TemplateCategory;
  unitType: string;
  difficulty: string;
  timeRange: string;
  searchQuery: string;
  showRecommendations: boolean;
  sortBy: 'name' | 'popularity' | 'recent' | 'rating' | 'time';
}

const categoryIcons: Record<TemplateCategory, React.ComponentType<any>> = {
  traditional: ClipboardList,
  'epic-emr': FileText,
  'unit-specific': Activity,
  smart: Sparkles,
  all: Grid
};

const categoryColors: Record<TemplateCategory, string> = {
  traditional: 'bg-purple-100 text-purple-800 border-purple-200',
  'epic-emr': 'bg-blue-100 text-blue-800 border-blue-200',
  'unit-specific': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  smart: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  all: 'bg-slate-100 text-slate-800 border-slate-200'
};

export function TemplateSelector({
  onTemplateSelect,
  selectedTemplate,
  userContext,
  className
}: TemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    unitType: 'all',
    difficulty: 'all',
    timeRange: 'all',
    searchQuery: '',
    showRecommendations: true,
    sortBy: 'popularity'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get all templates and recommendations
  const allTemplates = unifiedTemplateRegistry.getAllTemplates();
  const recommendations = useMemo(() => {
    if (!userContext || !filters.showRecommendations) return [];
    return unifiedTemplateRegistry.getRecommendedTemplates(userContext);
  }, [userContext, filters.showRecommendations]);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let templates = [...allTemplates];

    // Apply category filter
    if (filters.category !== 'all') {
      templates = templates.filter(t => t.category === filters.category);
    }

    // Apply unit type filter
    if (filters.unitType !== 'all') {
      templates = templates.filter(t =>
        t.unitTypes?.some(unit => unit.toLowerCase() === filters.unitType.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      templates = templates.filter(t => t.difficulty === filters.difficulty);
    }

    // Apply time range filter
    if (filters.timeRange !== 'all') {
      const [min, max] = filters.timeRange.split('-').map(Number);
      templates = templates.filter(t => {
        if (!t.estimatedTime) return false;
        if (max) return t.estimatedTime >= min && t.estimatedTime <= max;
        return t.estimatedTime >= min;
      });
    }

    // Apply search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.displayName.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort templates
    templates.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.displayName.localeCompare(b.displayName);
        case 'popularity':
          return (b.usageStats?.totalUses || 0) - (a.usageStats?.totalUses || 0);
        case 'recent':
          const aTime = a.usageStats?.lastUsed?.getTime() || 0;
          const bTime = b.usageStats?.lastUsed?.getTime() || 0;
          return bTime - aTime;
        case 'rating':
          return (b.usageStats?.userRating || 0) - (a.usageStats?.userRating || 0);
        case 'time':
          return (a.estimatedTime || 999) - (b.estimatedTime || 999);
        default:
          return 0;
      }
    });

    return templates;
  }, [allTemplates, filters]);

  // Get category stats
  const categoryStats = unifiedTemplateRegistry.getCategoryStats();

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      unitType: 'all',
      difficulty: 'all',
      timeRange: 'all',
      searchQuery: '',
      showRecommendations: true,
      sortBy: 'popularity'
    });
  };

  const TemplateCard = ({ template, isRecommended = false }: { template: UnifiedTemplate; isRecommended?: boolean }) => {
    const IconComponent = categoryIcons[template.category];
    const isSelected = selectedTemplate === template.id;

    return (
      <Card
        className={cn(
          "template-card group relative cursor-pointer border-2 hover:bg-transparent hover:shadow-none hover:scale-100 hover:border-slate-200",
          isSelected
            ? "border-teal-500 shadow-teal-200"
            : "border-slate-200",
          isRecommended && "ring-2 ring-amber-400 ring-opacity-50"
        )}
        onClick={() => onTemplateSelect(template)}
      >
        {isRecommended && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-amber-500 text-white text-xs px-2 py-1">
              <Award className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-md",
                getTemplateColor(template)
              )}>
                <span className="text-sm">{getTemplateIcon(template)}</span>
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800">
                  {template.displayName}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", categoryColors[template.category])}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {template.category.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            {template.usageStats && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {template.usageStats.userRating.toFixed(1)}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-4 pb-3">
          <CardDescription className="text-sm text-slate-600 mb-2 line-clamp-2">
            {template.description}
          </CardDescription>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-3">
              {template.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTemplateTime(template.estimatedTime)}
                </div>
              )}
              {template.difficulty && (
                <Badge variant="outline" className={cn("text-xs px-2 py-0", getTemplateDifficultyColor(template.difficulty))}>
                  {template.difficulty}
                </Badge>
              )}
            </div>
            {template.usageStats && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {template.usageStats.totalUses}
              </div>
            )}
          </div>

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs px-2 py-0 bg-slate-50">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0 bg-slate-50">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {template.shortcuts && template.shortcuts.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <Zap className="h-3 w-3" />
              {template.shortcuts.length} shortcuts available
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header with Search and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Choose a Template</h2>
          <p className="text-slate-600">
            Select from {allTemplates.length} professional templates across all categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="hidden lg:flex"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-teal-50 border-teal-300")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(filters.category !== 'all' || filters.unitType !== 'all' || filters.difficulty !== 'all') && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs bg-teal-500 text-white">
                !
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search templates by name, description, or tags..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="pl-10 h-12 text-base border-2 border-slate-200 focus:border-teal-400"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('searchQuery', '')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 border-2 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters & Sorting</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories ({allTemplates.length})</SelectItem>
                    <SelectItem value="traditional">Traditional ({categoryStats.traditional})</SelectItem>
                    <SelectItem value="epic-emr">Epic EMR ({categoryStats['epic-emr']})</SelectItem>
                    <SelectItem value="unit-specific">Unit-Specific ({categoryStats['unit-specific']})</SelectItem>
                    <SelectItem value="smart">Smart ({categoryStats.smart})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unit Type Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Unit Type</label>
                <Select value={filters.unitType} onValueChange={(value) => handleFilterChange('unitType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <SelectItem value="Med-Surg">Med-Surg</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="NICU">NICU</SelectItem>
                    <SelectItem value="Mother-Baby">Mother-Baby</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Difficulty</label>
                <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="recent">Recently Used</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="time">Quickest</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Range and Recommendations */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Time Range</label>
                  <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="0-5">Under 5m</SelectItem>
                      <SelectItem value="5-10">5-10m</SelectItem>
                      <SelectItem value="10-999">10m+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="recommendations"
                  checked={filters.showRecommendations}
                  onCheckedChange={(checked) => handleFilterChange('showRecommendations', checked)}
                />
                <label htmlFor="recommendations" className="text-sm text-slate-700">
                  Show recommendations
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && filters.showRecommendations && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800">Recommended for You</h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {recommendations.length} suggestions
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map(rec => {
              const template = unifiedTemplateRegistry.getTemplateById(rec.templateId);
              if (!template) return null;

              return (
                <TemplateCard
                  key={rec.templateId}
                  template={template}
                  isRecommended={true}
                />
              );
            })}
          </div>

          <Separator className="my-8" />
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            Showing {filteredTemplates.length} of {allTemplates.length} templates
          </span>
          {filters.searchQuery && (
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              "{filters.searchQuery}"
            </Badge>
          )}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No templates found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Templates Grid/List */}
      {filteredTemplates.length > 0 && (
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
        )}>
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
