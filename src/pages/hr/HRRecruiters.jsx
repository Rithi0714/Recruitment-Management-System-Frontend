import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Eye, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function HRRecruiters() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [assignForm, setAssignForm] = useState({ candidate_id: '' });
  const queryClient = useQueryClient();

  // Demo recruiters — replace with real User.list() once auth is set up
  const demoRecruiters = [
    { id: 'recruiter-1', full_name: 'Jane Smith', email: 'recruiter@demo.com', role: 'recruiter' },
  ];
  const users = demoRecruiters;
  const isLoading = false;

  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => base44.entities.Candidate.list('-created_date', 200),
  });

  const recruiters = users.filter(u => u.role === 'recruiter');

  const assignMutation = useMutation({
    mutationFn: ({ candidateId, recruiterId, recruiterName }) =>
      base44.entities.Candidate.update(candidateId, {
        assigned_recruiter_id: recruiterId,
        assigned_recruiter_name: recruiterName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate assigned to recruiter');
      setShowAssignModal(false);
    },
  });

  const getAssignedCount = (recruiterId) => {
    return candidates.filter(c => c.assigned_recruiter_id === recruiterId).length;
  };

  const getAssignedCandidates = (recruiterId) => {
    return candidates.filter(c => c.assigned_recruiter_id === recruiterId);
  };

  const unassignedCandidates = candidates.filter(c => !c.assigned_recruiter_id);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedRecruiter || !assignForm.candidate_id) return;
    assignMutation.mutate({
      candidateId: assignForm.candidate_id,
      recruiterId: selectedRecruiter.id,
      recruiterName: selectedRecruiter.full_name,
    });
  };

  return (
    <div>
      <PageHeader title="Recruiters" subtitle={`${recruiters.length} recruiters in the system`} />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Candidates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : recruiters.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No recruiters found. Invite users with the "recruiter" role.</TableCell></TableRow>
              ) : (
                recruiters.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.department || '—'}</TableCell>
                    <TableCell>{r.phone || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">{getAssignedCount(r.id)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => {
                          setSelectedRecruiter(r);
                          setShowCandidatesModal(true);
                        }}>
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => {
                          setSelectedRecruiter(r);
                          setAssignForm({ candidate_id: '' });
                          setShowAssignModal(true);
                        }}>
                          <UserPlus className="w-3 h-3" />
                          Assign
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

      {/* Assign Candidate Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Assign Candidate to {selectedRecruiter?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select Candidate</Label>
              <Select value={assignForm.candidate_id} onValueChange={(v) => setAssignForm({ candidate_id: v })}>
                <SelectTrigger><SelectValue placeholder="Choose a candidate" /></SelectTrigger>
                <SelectContent>
                  {unassignedCandidates.length === 0 ? (
                    <SelectItem value="_none" disabled>No unassigned candidates</SelectItem>
                  ) : (
                    unassignedCandidates.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} — {c.position}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button type="submit" disabled={assignMutation.isPending || !assignForm.candidate_id}>Assign</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Assigned Candidates Modal */}
      <Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedRecruiter?.full_name}'s Candidates</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {selectedRecruiter && getAssignedCandidates(selectedRecruiter.id).length > 0 ? (
              <div className="space-y-2">
                {getAssignedCandidates(selectedRecruiter.id).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.position}</p>
                    </div>
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