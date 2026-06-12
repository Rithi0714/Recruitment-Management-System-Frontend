import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { CheckCircle, Video, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function RecruiterInterviews() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedback, setFeedback] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
  }, []);

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => base44.entities.Interview.list('-created_date', 200),
    enabled: !!currentUser,
  });

  const myInterviews = interviews.filter(i => i.recruiter_id === currentUser?.id);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Interview.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast.success('Interview updated');
      setShowFeedbackModal(false);
    },
  });

  const markComplete = (interview) => {
    setSelectedInterview(interview);
    setFeedback('');
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!selectedInterview) return;
    updateMutation.mutate({
      id: selectedInterview.id,
      data: { status: 'completed', feedback },
    });
  };

  return (
    <div>
      <PageHeader title="My Interviews" subtitle={`${myInterviews.length} interviews assigned`} />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : myInterviews.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No interviews assigned</TableCell></TableRow>
              ) : (
                myInterviews.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{i.candidate_name}</TableCell>
                    <TableCell>{i.interview_date && format(new Date(i.interview_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{i.interview_time || '—'}</TableCell>
                    <TableCell className="capitalize">{i.interview_type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {i.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span className="capitalize">{i.mode}</span>
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {i.mode === 'online' && i.meeting_link && (
                          <a href={i.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="gap-1 text-primary">
                              <ExternalLink className="w-3 h-3" />
                              Join
                            </Button>
                          </a>
                        )}
                        {i.status === 'scheduled' && (
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => markComplete(i)}>
                            <CheckCircle className="w-3 h-3" />
                            Mark Complete
                          </Button>
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

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Submit Interview Feedback</DialogTitle>
          </DialogHeader>
          {selectedInterview && (
            <div className="mt-2 space-y-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">{selectedInterview.candidate_name}</p>
                <p className="text-xs text-muted-foreground">{selectedInterview.interview_type} interview · {selectedInterview.interview_date}</p>
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your observations and recommendation..."
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
                <Button onClick={submitFeedback} disabled={updateMutation.isPending}>
                  Submit & Complete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}