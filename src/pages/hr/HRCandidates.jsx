import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Plus, Search, Pencil, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { dummyCandidates } from '@/lib/dummyData';

const emptyCandidate = { name: '', email: '', phone: '', position: '', source: 'linkedin', skills: '', status: 'applied', resume_url: null };

export default function HRCandidates() {
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [form, setForm] = useState(emptyCandidate);
  const [deleteId, setDeleteId] = useState(null);

  const closeModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    setForm(emptyCandidate);
  };

  const openEdit = (candidate) => {
    setEditingCandidate(candidate);
    setForm({
      name: candidate.name || '', email: candidate.email || '', phone: candidate.phone || '',
      position: candidate.position || '', source: candidate.source || 'linkedin',
      skills: candidate.skills || '', status: candidate.status || 'applied', resume_url: candidate.resume_url || null,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCandidate) {
      setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? { ...c, ...form } : c));
      toast.success('Candidate updated');
    } else {
      const newCandidate = { ...form, id: 'c' + Date.now(), assigned_recruiter_id: null, assigned_recruiter_name: null, feedback: null, resume_url: null };
      setCandidates(prev => [newCandidate, ...prev]);
      toast.success('Candidate added successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    setCandidates(prev => prev.filter(c => c.id !== deleteId));
    toast.success('Candidate deleted');
    setDeleteId(null);
  };

  const filtered = candidates.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Applied Candidates"
        subtitle={`${candidates.length} total candidates`}
        action={<Button onClick={() => { setForm(emptyCandidate); setShowModal(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add New Candidate</Button>}
      />

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No candidates found</TableCell></TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.phone || '—'}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.position}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>{c.resume_url ? <a href={c.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80"><Download className="w-4 h-4" /></a> : '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Position *</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem><SelectItem value="indeed">Indeed</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem><SelectItem value="website">Website</SelectItem>
                    <SelectItem value="job_fair">Job Fair</SelectItem><SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Skills</Label><Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" /></div>
            <div className="space-y-2">
              <Label>Resume (PDF / DOC)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setForm({ ...form, resume_url: url });
                    toast.success(`Resume "${file.name}" attached`);
                  }
                }}
              />
              {form.resume_url && (
                <p className="text-xs text-emerald-600">✓ Resume attached</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingCandidate ? 'Update' : 'Add Candidate'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Candidate?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}