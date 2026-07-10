import React, { useState } from 'react';
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
import { useEffect } from "react";
import api from "@/api/api";

export default function RecruiterInterviews() {
  const currentUser = { id: 'recruiter-1', full_name: 'Jane Smith', role: 'recruiter' };
  const [interviews, setInterviews] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
  fetchInterviews();
}, []);

 const myInterviews = interviews;

const fetchInterviews = async () => {
  try {
    const response = await api.get("/interviews/recruiter/6");

    setInterviews(response.data);

  } catch (error) {
    console.error(error);
    toast.error("Failed to load interviews");
  }
};

  const markComplete = (interview) => {
    setSelectedInterview(interview);
    setFeedback('');
    setShowFeedbackModal(true);
  };

 const submitFeedback = async () => {
  try {
    await api.patch(
      `/interviews/${selectedInterview.interviewId}/complete`,
      null,
      {
        params: {
          feedback: feedback
        }
      }
    );

    toast.success("Interview marked as completed");

    setShowFeedbackModal(false);

    // Reload interviews
    fetchInterviews();

  } catch (error) {
    console.error(error);
    toast.error("Failed to update interview");
  }
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
              {myInterviews.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No interviews assigned</TableCell></TableRow>
              ) : (
                myInterviews.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{i.candidateName}</TableCell>
                    <TableCell>{format(new Date(i.interviewDateTime), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(i.interviewDateTime), "hh:mm a")}</TableCell>
                    <TableCell className="capitalize">{i.interviewType}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {i.interviewMode?.toLowerCase() === "online" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span className="capitalize">{i.interviewMode}</span>
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {i.interviewMode?.toLowerCase() === "online" && i.meetingLink && (
                          <a href={i.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="gap-1 text-primary">
                              <ExternalLink className="w-3 h-3" /> Join
                            </Button>
                          </a>
                        )}
                        {i.status?.toLowerCase() === "scheduled" && (
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => markComplete(i)}>
                            <CheckCircle className="w-3 h-3" /> Mark Complete
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
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your observations and recommendation..." rows={5} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
                <Button onClick={submitFeedback}>Submit & Complete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}