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
  Archive,
  X,
  Copy,
  Save,
  Printer,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NoteContent {
  [key: string]: string;
}

interface Note {
  id: string;
  title: string;
  template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR';
  date: string;
  time: string;
  status: 'draft' | 'completed' | 'exported';
  patient: string;
  excerpt: string;
  content?: NoteContent;
  icd10Codes?: string[];
  starred?: boolean;
}

// Mock data with content
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
    content: {
      Subjective: 'Patient reports chest pain for 2 hours, denies shortness of breath, pain level 6/10.',
      Objective: 'Vital Signs: BP 128/84, HR 82, RR 18, O2 sat 98%, Temp 98.4°F. Physical Assessment: Alert and oriented x3, chest pain non-radiating, no acute distress.',
      Assessment: 'Patient presents with chest pain, likely musculoskeletal in nature. Vital signs stable, pain well-controlled with current medication regimen.',
      Plan: 'Continue current pain management with acetaminophen 650mg PO q6h PRN. Monitor for signs of complications. Patient education provided regarding warning signs to watch for.'
    },
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
    content: {
      Situation: 'Patient in room 302 with increased confusion and decreased oxygen saturation requiring immediate transfer to ICU.',
      Background: 'Patient admitted 2 days ago for pneumonia, has COPD history. Current medications include antibiotics and bronchodilators.',
      Assessment: 'Patient O2 sat dropping to 88% on room air, increased work of breathing, altered mental status, likely respiratory distress.',
      Recommendation: 'Recommend immediate ICU transfer, increase oxygen support, consider intubation readiness. Notified attending physician.'
    },
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
    content: {
      Problem: 'Stage 2 pressure ulcer on sacrum, 3cm x 2cm, with partial thickness skin loss.',
      Intervention: 'Wound assessment performed, cleansed with normal saline, applied hydrocolloid dressing, repositioned patient q2h, nutritional consult ordered.',
      Evaluation: 'Patient tolerated intervention well, no signs of infection, wound edges improving, will continue current treatment plan.'
    },
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
    excerpt: 'Data: Patient reports pain level 7/10...',
    content: {
      Data: 'Patient reports pain level 7/10 in right lower extremity, vital signs: BP 145/92, HR 95, RR 20, Temp 98.8°F.',
      Action: 'Administered morphine 4mg IV as ordered, patient positioned for comfort, ice pack applied to affected area.',
      Response: 'Pain level decreased to 3/10 within 20 minutes, patient reports improved comfort, no adverse reactions noted.'
    }
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
    content: {
      Subjective: 'Patient recovering well from surgery, reports mild incisional pain 4/10, denies nausea or dizziness.',
      Objective: 'VS: BP 118/72, HR 76, RR 16, O2 98% on RA. Incision clean, dry, intact with no signs of infection. Patient ambulatory with assistance.',
      Assessment: 'Post-operative day 1, progressing as expected, pain controlled, vital signs stable.',
      Plan: 'Continue pain management, advance diet as tolerated, increase ambulation, monitor for complications. Discharge planning initiated.'
    },
    icd10Codes: ['Z48.00', 'R52']
  }
];

interface NoteHistoryProps {
  onNavigate?: (screen: string) => void;
}

export function NoteHistory({ onNavigate }: NoteHistoryProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editedContent, setEditedContent] = useState<NoteContent>({});

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

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
        return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // Handle view note
  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setViewModalOpen(true);
  };

  // Handle edit note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditedContent(note.content || {});
    setEditModalOpen(true);
  };

  // Handle save edited note
  const handleSaveEdit = () => {
    if (editingNote) {
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? { ...note, content: editedContent, status: 'completed' }
          : note
      ));
      setEditModalOpen(false);
      toast.success('Note updated successfully!');
    }
  };

  // Handle delete note
  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter(note => note.id !== noteToDelete));
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      toast.success('Note deleted successfully');
    }
  };

  // Handle toggle star
  const handleToggleStar = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
  };

  // Handle export note
  const handleExportNote = (note: Note) => {
    const formattedNote = formatNoteForExport(note);
    navigator.clipboard.writeText(formattedNote);
    toast.success('Note copied to clipboard!', {
      description: 'Ready to paste into your EHR'
    });
  };

  const formatNoteForExport = (note: Note) => {
    const timestamp = new Date(note.date + ' ' + note.time).toLocaleString();
    let formatted = `${note.template} NOTE - ${note.title}\n`;
    formatted += `Date: ${timestamp}\n`;
    formatted += `Patient: ${note.patient}\n\n`;

    if (note.content) {
      Object.entries(note.content).forEach(([section, content]) => {
        formatted += `${section.toUpperCase()}:\n${content}\n\n`;
      });
    }

    return formatted.trim();
  };

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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                Note History
              </h1>
              <p className="text-xs lg:text-sm text-slate-600">
                View and manage your clinical documentation
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2 lg:px-3 py-1 text-xs lg:text-sm">
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
              <Button
                onClick={() => onNavigate?.('home')}
                className="w-full h-9 text-sm bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
              >
                <FileText className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">New</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 lg:py-4 space-y-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {filteredNotes.length === 0 ? (
            <Card className="p-8 lg:p-12 text-center">
              <FileText className="h-12 w-12 lg:h-16 lg:w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No notes found</h3>
              <p className="text-sm text-slate-600 mb-4">
                {searchQuery || filterTemplate !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first note to get started'}
              </p>
              <Button
                onClick={() => onNavigate?.('home')}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className="p-3 lg:p-4 hover:shadow-lg transition-all bg-white/90 border-2 border-slate-200">
                <div className="flex items-start gap-3">
                  {/* Star Icon */}
                  <button
                    className="mt-1 flex-shrink-0"
                    onClick={() => handleToggleStar(note.id)}
                  >
                    <Star
                      className={`h-4 w-4 lg:h-5 lg:w-5 transition-colors ${
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                        onClick={() => handleViewNote(note)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                        onClick={() => handleExportNote(note)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-slate-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExportNote(note)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteNote(note.id)}
                          >
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

      {/* View Note Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              {selectedNote?.title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getTemplateColor(selectedNote?.template || '')}>
                {selectedNote?.template}
              </Badge>
              <Badge className={getStatusColor(selectedNote?.status || '')}>
                {selectedNote?.status}
              </Badge>
              <span className="text-sm text-slate-600">
                {selectedNote?.date} at {selectedNote?.time}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Patient Info */}
            <Card className="p-3 bg-slate-50 border-slate-200">
              <p className="text-sm font-medium text-slate-700">
                <User className="h-4 w-4 inline mr-2" />
                {selectedNote?.patient}
              </p>
            </Card>

            {/* Note Content */}
            {selectedNote?.content && Object.entries(selectedNote.content).map(([section, content]) => (
              <Card key={section} className="p-4 border-2 border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase">
                  {section}
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {content}
                </p>
              </Card>
            ))}

            {/* ICD-10 Codes */}
            {selectedNote?.icd10Codes && selectedNote.icd10Codes.length > 0 && (
              <Card className="p-3 bg-blue-50 border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-2">
                  <Tag className="h-4 w-4 inline mr-2" />
                  ICD-10 Codes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.icd10Codes.map((code, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 border-blue-300">
                      {code}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => selectedNote && handleEditNote(selectedNote)}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Note
            </Button>
            <Button
              onClick={() => selectedNote && handleExportNote(selectedNote)}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Note: {editingNote?.title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getTemplateColor(editingNote?.template || '')}>
                {editingNote?.template}
              </Badge>
              <span className="text-sm text-slate-600">
                Make changes to your note below
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editingNote?.content && Object.entries(editingNote.content).map(([section, content]) => (
              <div key={section} className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase">
                  {section}
                </label>
                <Textarea
                  value={editedContent[section] || content}
                  onChange={(e) => setEditedContent({
                    ...editedContent,
                    [section]: e.target.value
                  })}
                  className="min-h-[120px] text-sm"
                  placeholder={`Enter ${section.toLowerCase()} content...`}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Note
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone and will permanently remove the note from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
