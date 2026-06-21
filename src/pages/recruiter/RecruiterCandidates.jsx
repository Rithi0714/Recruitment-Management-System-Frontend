import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { dummyCandidates } from '@/lib/dummyData';

export default function RecruiterCandidates() {
  const currentUser = { id: 'recruiter-1', full_name: 'Jane Smith', role: 'recruiter' };
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackAction, setFeedbackAction] = useState('');
  const [feedback, setFeedback] = useState('');

  const myCandidates = candidates.filter(c => c.assigned_recruiter_id === currentUser.id);

  const openFeedbackModal = (candidate, action) => {
    setSelectedCandidate(candidate);
    setFeedbackAction(action);
    setFeedback('');
    setShowFeedbackModal(true);
  };

  const submitDecision = () => {
    if (!selectedCandidate) return;
    setCandidates(prev => prev.map(c =>
      c.id === selectedCandidate.id ? { ...c, status: feedbackAction, feedback: feedback || c.feedback } : c
    ));
    toast.success('Candidate status updated');
    setShowFeedbackModal(false);
    setFeedback('');
  };

  return (
    <div>
      <PageHeader title="My Candidates" subtitle={`${myCandidates.length} candidates assigned to you`} />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCandidates.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No candidates assigned to you</TableCell></TableRow>
              ) : (
                myCandidates.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedCandidate(c); setShowDetailModal(true); }}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.position}</TableCell>
                    <TableCell>{c.phone || '—'}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {!['selected', 'rejected', 'hired'].includes(c.status) && (
                          <>
                            <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => openFeedbackModal(c, 'selected')}>
                              <Check className="w-4 h-4" /> Select
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => openFeedbackModal(c, 'rejected')}>
                              <X className="w-4 h-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Candidate Profile</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-medium">{selectedCandidate.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Position</p><p className="text-sm font-medium">{selectedCandidate.position}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selectedCandidate.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{selectedCandidate.phone || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={selectedCandidate.status} /></div>
                <div><p className="text-xs text-muted-foreground">Skills</p><p className="text-sm">{selectedCandidate.skills || '—'}</p></div>
              </div>
              {selectedCandidate.feedback && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                  <p className="text-sm">{selectedCandidate.feedback}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {feedbackAction === 'selected' ? 'Select' : 'Reject'} {selectedCandidate?.name}?
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label>Feedback Notes</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add your feedback..." rows={4} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
              <Button onClick={submitDecision} className={feedbackAction === 'selected' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}>
                {feedbackAction === 'selected' ? 'Confirm Select' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}