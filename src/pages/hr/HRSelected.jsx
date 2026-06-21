import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { FileText, ArrowUpRight, Download } from 'lucide-react';
import { toast } from 'sonner';
import { dummyCandidates, dummyOfferLetters } from '@/lib/dummyData';

export default function HRSelected() {
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [offerLetters, setOfferLetters] = useState(dummyOfferLetters);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerForm, setOfferForm] = useState({ salary: '', joining_date: '' });

  const selected = candidates.filter(c => ['selected', 'offer_sent', 'hired'].includes(c.status));
  const getOffer = (candidateId) => offerLetters.find(o => o.candidate_id === candidateId);

  const handleGenerateOffer = (e) => {
    e.preventDefault();
    const newOffer = {
      id: 'o' + Date.now(),
      candidate_id: selectedCandidate.id,
      candidate_name: selectedCandidate.name,
      position: selectedCandidate.position,
      salary: offerForm.salary,
      joining_date: offerForm.joining_date,
      status: 'draft',
    };
    setOfferLetters(prev => [...prev, newOffer]);
    setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, status: 'offer_sent' } : c));
    toast.success('Offer letter generated');
    setShowOfferModal(false);
  };

  const downloadOfferLetter = (candidate, offer) => {
    const content = `OFFER LETTER\n${'='.repeat(50)}\n\nDate: ${new Date().toLocaleDateString()}\n\nDear ${candidate.name},\n\nWe are pleased to offer you the position of ${offer.position} at our organization.\n\nSalary / Package: ${offer.salary}\nExpected Joining Date: ${offer.joining_date}\nOffer Status: ${offer.status}\n\nPlease confirm your acceptance at your earliest convenience.\n\nWarm regards,\nHR Department`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Offer_Letter_${candidate.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Offer letter downloaded for ${candidate.name}`);
  };

  const markHired = (c) => {
    setCandidates(prev => prev.map(x => x.id === c.id ? { ...x, status: 'hired' } : x));
    toast.success('Status updated');
  };

  const openOfferModal = (candidate) => {
    setSelectedCandidate(candidate);
    setOfferForm({ salary: '', joining_date: '' });
    setShowOfferModal(true);
  };

  return (
    <div>
      <PageHeader title="Selected Candidates" subtitle={`${selected.length} candidates selected`} />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead>Recruiter</TableHead>
                <TableHead>Status</TableHead><TableHead>Offer Letter</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No selected candidates</TableCell></TableRow>
              ) : (
                selected.map((c) => {
                  const offer = getOffer(c.id);
                  return (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.position}</TableCell>
                      <TableCell>{c.assigned_recruiter_name || '—'}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>{offer ? <StatusBadge status={offer.status} /> : <span className="text-sm text-muted-foreground">Not generated</span>}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!offer && c.status === 'selected' && (
                            <Button variant="outline" size="sm" onClick={() => openOfferModal(c)} className="gap-1">
                              <FileText className="w-3 h-3" /> Generate Offer
                            </Button>
                          )}
                          {offer && (
                            <Button variant="outline" size="sm" onClick={() => downloadOfferLetter(c, offer)} className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                              <Download className="w-3 h-3" /> Download Offer
                            </Button>
                          )}
                          {c.status === 'offer_sent' && (
                            <Button variant="outline" size="sm" onClick={() => markHired(c)} className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <ArrowUpRight className="w-3 h-3" /> Mark Hired
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Generate Offer Letter</DialogTitle></DialogHeader>
          {selectedCandidate && (
            <form onSubmit={handleGenerateOffer} className="space-y-4 mt-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">{selectedCandidate.name}</p>
                <p className="text-xs text-muted-foreground">{selectedCandidate.position}</p>
              </div>
              <div className="space-y-2"><Label>Salary / Package</Label><Input value={offerForm.salary} onChange={(e) => setOfferForm({ ...offerForm, salary: e.target.value })} required placeholder="e.g. $85,000/yr" /></div>
              <div className="space-y-2"><Label>Expected Joining Date</Label><Input type="date" value={offerForm.joining_date} onChange={(e) => setOfferForm({ ...offerForm, joining_date: e.target.value })} required /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                <Button type="submit">Generate</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}