import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  MoreVertical,
  Star,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Note {
  id: string;
  title: string;
  template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR';
  date: string;
  time: string;
  status: 'draft' | 'completed' | 'exported';
  patient: string;
  excerpt: string;
  icd10Codes?: string[];
  starred?: boolean;
}

// Mock data
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Morning Assessment - Patient A',
    template: 'SOAP',
    date: '2025-01-16',
    time: '09:30 AM',
    status: 'completed',
    patient: 'Patient A (MRN: 12345)',
    excerpt: 'Patient reports chest pain, vital signs stable...',
    icd10Codes: ['R07.9', 'I10'],
    starred: true
  },
  {
    id: '2',
    title: 'Patient Transfer - Patient B',
    template: 'SBAR',
    date: '2025-01-16',
    time: '11:45 AM',
    status: 'exported',
    patient: 'Patient B (MRN: 67890)',
    excerpt: 'Situation: Patient requires transfer to ICU...',
    icd10Codes: ['J96.00', 'R06.03']
  },
  {
    id: '3',
    title: 'Wound Care Documentation',
    template: 'PIE',
    date: '2025-01-15',
    time: '02:15 PM',
    status: 'completed',
    patient: 'Patient C (MRN: 11223)',
    excerpt: 'Problem: Stage 2 pressure ulcer on sacrum...',
    icd10Codes: ['L89.152'],
    starred: true
  },
  {
    id: '4',
    title: 'Medication Administration',
    template: 'DAR',
    date: '2025-01-15',
    time: '04:30 PM',
    status: 'draft',
    patient: 'Patient D (MRN: 44556)',
    excerpt: 'Data: Patient reports pain level 7/10...'
  },
  {
    id: '5',
    title: 'Post-Op Assessment',
    template: 'SOAP',
    date: '2025-01-14',
    time: '10:00 AM',
    status: 'completed',
    patient: 'Patient E (MRN: 78901)',
    excerpt: 'Subjective: Patient recovering well from surgery...',
    icd10Codes: ['Z48.00', 'R52']
  }
];

export function NoteHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [notes] = useState<Note[]>(mockNotes);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate = filterTemplate === 'all' || note.template === filterTemplate;
      const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
      return matchesSearch && matchesTemplate && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'exported':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'SOAP':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SBAR':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'PIE':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DAR':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Note History
            </h1>
            <p className="text-xs lg:text-sm text-slate-600">
              View and manage your clinical documentation
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-2 lg:px-3 py-1 text-xs lg:text-sm">
            {filteredNotes.length} Notes
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
          {/* Search */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search notes, patients, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>

          {/* Template Filter */}
          <div className="lg:col-span-2">
            <Select value={filterTemplate} onValueChange={setFilterTemplate}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="SOAP">SOAP</SelectItem>
                <SelectItem value="SBAR">SBAR</SelectItem>
                <SelectItem value="PIE">PIE</SelectItem>
                <SelectItem value="DAR">DAR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="exported">Exported</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New Note Button */}
          <div className="lg:col-span-1">
            <Button className="w-full h-9 text-sm bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              <FileText className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">New</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 lg:py-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <Card className="p-8 lg:p-12 text-center">
            <FileText className="h-12 w-12 lg:h-16 lg:w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No notes found</h3>
            <p className="text-sm text-slate-600 mb-4">
              {searchQuery || filterTemplate !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Create your first note to get started'}
            </p>
            <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Create New Note
            </Button>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="p-3 lg:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Star Icon */}
                <button className="mt-1 flex-shrink-0">
                  <Star
                    className={`h-4 w-4 lg:h-5 lg:w-5 ${
                      note.starred
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 hover:text-yellow-400'
                    }`}
                  />
                </button>

                {/* Note Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm lg:text-base font-semibold text-slate-900 truncate mb-1">
                        {note.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{note.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{note.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{note.patient}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={`${getTemplateColor(note.template)} text-xs px-2 py-0.5`}>
                        {note.template}
                      </Badge>
                      <Badge className={`${getStatusColor(note.status)} text-xs px-2 py-0.5`}>
                        {note.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs lg:text-sm text-slate-600 mb-2 line-clamp-2">
                    {note.excerpt}
                  </p>

                  {/* ICD-10 Codes */}
                  {note.icd10Codes && note.icd10Codes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <Tag className="h-3 w-3 text-blue-600" />
                      {note.icd10Codes.map((code, index) => (
                        <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1.5 py-0">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
