import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Plus, Search, Pencil, Video, MapPin, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { dummyInterviews, dummyCandidates, dummyUsers } from '@/lib/dummyData';

export default function HRInterviews() {
  const [interviews, setInterviews] = useState(dummyInterviews);
  const candidates = dummyCandidates;
  const recruiters = dummyUsers.filter(u => u.role === 'recruiter');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [dlFrom, setDlFrom] = useState('');
  const [dlTo, setDlTo] = useState('');
  const [dlAll, setDlAll] = useState(false);

  const handleDownload = () => {
    const data = dlAll
      ? interviews
      : interviews.filter(i => {
          if (!i.interview_date) return false;
          const d = i.interview_date;
          return (!dlFrom || d >= dlFrom) && (!dlTo || d <= dlTo);
        });
    const headers = ['Candidate', 'Position', 'Recruiter', 'Date', 'Time', 'Type', 'Mode', 'Status', 'Notes'];
    const rows = data.map(i => [
      i.candidate_name, '', i.recruiter_name, i.interview_date, i.interview_time,
      i.interview_type, i.mode, i.status, i.notes || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'interviews.xls'; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${data.length} interview(s)`);
    setShowDownloadModal(false);
  };
  const [editingInterview, setEditingInterview] = useState(null);
  const [form, setForm] = useState({
    candidate_id: '', candidate_name: '', recruiter_id: '', recruiter_name: '',
    interview_date: '', interview_time: '', interview_type: 'hr', mode: 'online', meeting_link: '', notes: ''
  });

  const closeModal = () => {
    setShowModal(false); setEditingInterview(null);
    setForm({ candidate_id: '', candidate_name: '', recruiter_id: '', recruiter_name: '', interview_date: '', interview_time: '', interview_type: 'hr', mode: 'online', meeting_link: '', notes: '' });
  };

  const openEdit = (interview) => {
    setEditingInterview(interview);
    setForm({
      candidate_id: interview.candidate_id || '', candidate_name: interview.candidate_name || '',
      recruiter_id: interview.recruiter_id || '', recruiter_name: interview.recruiter_name || '',
      interview_date: interview.interview_date || '', interview_time: interview.interview_time || '',
      interview_type: interview.interview_type || 'hr', mode: interview.mode || 'online',
      meeting_link: interview.meeting_link || '', notes: interview.notes || '',
    });
    setShowModal(true);
  };

  const handleCandidateSelect = (candidateId) => {
    const cand = candidates.find(c => c.id === candidateId);
    setForm({ ...form, candidate_id: candidateId, candidate_name: cand?.name || '' });
  };

  const handleRecruiterSelect = (recruiterId) => {
    const rec = recruiters.find(r => r.id === recruiterId);
    setForm({ ...form, recruiter_id: recruiterId, recruiter_name: rec?.full_name || '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInterview) {
      setInterviews(prev => prev.map(i => i.id === editingInterview.id ? { ...i, ...form } : i));
      toast.success('Interview updated');
    } else {
      const newInterview = { ...form, id: 'i' + Date.now(), status: 'scheduled' };
      setInterviews(prev => [newInterview, ...prev]);
      toast.success('Interview scheduled');
    }
    closeModal();
  };

  const filtered = interviews.filter(i => {
    const matchSearch = !search || i.candidate_name?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || i.interview_date === dateFilter;
    return matchSearch && matchDate;
  });

  return (
    <div>
      <PageHeader title="Interviews" subtitle={`${interviews.length} total interviews`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setDlAll(false); setDlFrom(''); setDlTo(''); setShowDownloadModal(true); }} className="gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button onClick={() => setShowModal(true)} className="gap-2"><Plus className="w-4 h-4" /> Schedule Interview</Button>
          </div>
        } />

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border/50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by candidate name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead>
                <TableHead>Recruiter</TableHead><TableHead>Type</TableHead><TableHead>Mode</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No interviews found</TableCell></TableRow>
              ) : (
                filtered.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{i.candidate_name}</TableCell>
                    <TableCell>{i.interview_date && format(new Date(i.interview_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{i.interview_time || '—'}</TableCell>
                    <TableCell>{i.recruiter_name || '—'}</TableCell>
                    <TableCell className="capitalize">{i.interview_type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {i.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span className="capitalize">{i.mode}</span>
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(i)}><Pencil className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="font-heading">Download Interviews</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="dlAll" checked={dlAll} onChange={(e) => setDlAll(e.target.checked)} className="w-4 h-4" />
              <Label htmlFor="dlAll">Download all interviews</Label>
            </div>
            {!dlAll && (
              <div className="space-y-3">
                <div className="space-y-1"><Label>From Date</Label><Input type="date" value={dlFrom} onChange={(e) => setDlFrom(e.target.value)} /></div>
                <div className="space-y-1"><Label>To Date</Label><Input type="date" value={dlTo} onChange={(e) => setDlTo(e.target.value)} /></div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowDownloadModal(false)}>Cancel</Button>
              <Button onClick={handleDownload} className="gap-2"><Download className="w-4 h-4" /> Download Excel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{editingInterview ? 'Edit Interview' : 'Schedule an Interview'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select Candidate *</Label>
              <Select value={form.candidate_id} onValueChange={handleCandidateSelect}>
                <SelectTrigger><SelectValue placeholder="Choose candidate" /></SelectTrigger>
                <SelectContent>
                  {candidates.map(c => (<SelectItem key={c.id} value={c.id}>{c.name} — {c.position}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Recruiter *</Label>
              <Select value={form.recruiter_id} onValueChange={handleRecruiterSelect}>
                <SelectTrigger><SelectValue placeholder="Choose recruiter" /></SelectTrigger>
                <SelectContent>
                  {recruiters.map(r => (<SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Interview Type *</Label>
                <Select value={form.interview_type} onValueChange={(v) => setForm({ ...form, interview_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem><SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="managerial">Managerial</SelectItem><SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Mode *</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="offline">Offline</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.interview_date} onChange={(e) => setForm({ ...form, interview_date: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Time *</Label><Input type="time" value={form.interview_time} onChange={(e) => setForm({ ...form, interview_time: e.target.value })} required /></div>
            </div>
            {form.mode === 'online' && (
              <div className="space-y-2"><Label>Meeting Link</Label><Input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} placeholder="https://..." /></div>
            )}
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingInterview ? 'Update' : 'Schedule'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}