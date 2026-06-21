import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Eye, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { dummyUsers, dummyCandidates } from '@/lib/dummyData';

export default function HRRecruiters() {
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [assignForm, setAssignForm] = useState({ candidate_id: '' });

  const [extraRecruiters, setExtraRecruiters] = useState([]);
  const [showAddRecruiterModal, setShowAddRecruiterModal] = useState(false);
  const [recruiterForm, setRecruiterForm] = useState({ full_name: '', email: '', department: '' });

  const baseRecruiters = dummyUsers.filter(u => u.role === 'recruiter');
  const recruiters = [...baseRecruiters, ...extraRecruiters];

  const handleAddRecruiter = (e) => {
    e.preventDefault();
    const newRec = { ...recruiterForm, id: 'recruiter-' + Date.now(), role: 'recruiter' };
    setExtraRecruiters(prev => [...prev, newRec]);
    toast.success('Recruiter added successfully');
    setRecruiterForm({ full_name: '', email: '', department: '' });
    setShowAddRecruiterModal(false);
  };

  const getAssignedCount = (recruiterId) =>
    candidates.filter(c => c.assigned_recruiter_id === recruiterId).length;

  const getAssignedCandidates = (recruiterId) =>
    candidates.filter(c => c.assigned_recruiter_id === recruiterId);

  const unassignedCandidates = candidates.filter(c => !c.assigned_recruiter_id);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedRecruiter || !assignForm.candidate_id) return;
    setCandidates(prev => prev.map(c =>
      c.id === assignForm.candidate_id
        ? { ...c, assigned_recruiter_id: selectedRecruiter.id, assigned_recruiter_name: selectedRecruiter.full_name }
        : c
    ));
    toast.success('Candidate assigned to recruiter');
    setShowAssignModal(false);
  };

  return (
    <div>
      <PageHeader title="Recruiters" subtitle={`${recruiters.length} recruiters in the system`}
        action={<Button onClick={() => setShowAddRecruiterModal(true)} className="gap-2"><Plus className="w-4 h-4" /> Add New Recruiter</Button>}
      />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead>
                <TableHead>Assigned Candidates</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruiters.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No recruiters found</TableCell></TableRow>
              ) : (
                recruiters.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.department || '—'}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono">{getAssignedCount(r.id)}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setSelectedRecruiter(r); setShowCandidatesModal(true); }}>
                          <Eye className="w-3 h-3" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setSelectedRecruiter(r); setAssignForm({ candidate_id: '' }); setShowAssignModal(true); }}>
                          <UserPlus className="w-3 h-3" /> Assign
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Recruiter Modal */}
      <Dialog open={showAddRecruiterModal} onOpenChange={setShowAddRecruiterModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Add New Recruiter</DialogTitle></DialogHeader>
          <form onSubmit={handleAddRecruiter} className="space-y-4 mt-2">
            <div className="space-y-2"><Label>Full Name *</Label><Input value={recruiterForm.full_name} onChange={(e) => setRecruiterForm({ ...recruiterForm, full_name: e.target.value })} required placeholder="e.g. John Doe" /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={recruiterForm.email} onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })} required placeholder="recruiter@company.com" /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={recruiterForm.department} onChange={(e) => setRecruiterForm({ ...recruiterForm, department: e.target.value })} placeholder="e.g. Talent Acquisition" /></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddRecruiterModal(false)}>Cancel</Button>
              <Button type="submit">Add Recruiter</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Assign Candidate to {selectedRecruiter?.full_name}</DialogTitle></DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select Candidate</Label>
              <Select value={assignForm.candidate_id} onValueChange={(v) => setAssignForm({ candidate_id: v })}>
                <SelectTrigger><SelectValue placeholder="Choose a candidate" /></SelectTrigger>
                <SelectContent>
                  {unassignedCandidates.length === 0 ? (
                    <SelectItem value="_none" disabled>No unassigned candidates</SelectItem>
                  ) : (
                    unassignedCandidates.map(c => (<SelectItem key={c.id} value={c.id}>{c.name} — {c.position}</SelectItem>))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button type="submit" disabled={!assignForm.candidate_id}>Assign</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{selectedRecruiter?.full_name}'s Candidates</DialogTitle></DialogHeader>
          <div className="mt-2">
            {selectedRecruiter && getAssignedCandidates(selectedRecruiter.id).length > 0 ? (
              <div className="space-y-2">
                {getAssignedCandidates(selectedRecruiter.id).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.position}</p></div>
                    <Badge variant="outline" className="capitalize">{c.status?.replace(/_/g, ' ')}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No candidates assigned</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}