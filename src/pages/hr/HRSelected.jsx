import React, { useState, useEffect } from 'react';
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
import api from "@/api/api";


export default function HRSelected() {
  const [candidates, setCandidates] = useState([]);
  const [offerLetters, setOfferLetters] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerForm, setOfferForm] = useState({ salary: '', joiningDate: '' });


  useEffect(() => {

    loadCandidates();

    loadOfferLetters();

}, []); 

console.log("Candidates:", candidates);
  const selected = candidates.filter(c =>
    ['SELECTED', 'OFFER_SENT', 'HIRED'].includes(c.status)
);


const getOffer = (candidateId) =>
    offerLetters.find(o => o.candidateId === candidateId);

const loadCandidates = async () => {
    try {

        const response = await api.get("/candidates");

        console.log("Candidates:", response.data);

        setCandidates(response.data);

    } catch (error) {

        console.error(error);

        toast.error("Failed to load candidates");

    }

};


const loadOfferLetters = async () => {

    console.log("Loading offer letters...");

    try {

        const response = await api.get("/offerletters");

        console.log("Offer Letters Response:", response.data);

        setOfferLetters(response.data);

    } catch (error) {

        console.error("Offer Letters Error:", error);

    }
};


const handleGenerateOffer = async (e) => {

    e.preventDefault();

    try {

        await api.post("/offerletters", {

            candidateId: selectedCandidate.id,

            position: selectedCandidate.position,

            salary: Number(offerForm.salary),

            joiningDate: offerForm.joiningDate,

            department: "Engineering",

            termsAndConditions:
                "Welcome to Conzura. Please review the attached offer letter."

        });

        toast.success("Offer Letter Generated Successfully");

        await loadCandidates();

        await loadOfferLetters();

        setShowOfferModal(false);

    }

    catch (error) {

        console.error(error);

        toast.error("Failed to generate offer letter");

    }

};

const downloadOfferLetter = (offer) => {

    window.open(
        `http://localhost:8080/api/offerletters/${offer.id}/download`,
        "_blank"
    );

};

 const markHired = async (offerId) => {
    try {

        await api.patch(`/offerletters/${offerId}/accept`);

        toast.success("Candidate marked as Hired");

        await loadCandidates();
        await loadOfferLetters();

    } catch (error) {

        console.error(error);

        toast.error("Failed to mark candidate as hired");

    }
};

  const openOfferModal = (candidate) => {
    setSelectedCandidate(candidate);
    setOfferForm({ salary: '', joiningDate: '' });
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
                   console.log(c.name, c.status);
                  const offer = getOffer(c.id);
                  return (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.position}</TableCell>
                      <TableCell>{c.recruiterName || '—'}</TableCell>
                      <TableCell>
    <StatusBadge status={c.status} />
</TableCell>
                      <TableCell>{offer ? <StatusBadge status={offer.status} /> : <span className="text-sm text-muted-foreground">Not generated</span>}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!offer && c.status === 'SELECTED' && (
                            <Button variant="outline" size="sm" onClick={() => openOfferModal(c)} className="gap-1">
                              <FileText className="w-3 h-3" /> Generate Offer
                            </Button>
                          )}
                          {offer && (
                            <Button variant="outline" size="sm" onClick={() => downloadOfferLetter(offer)} className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                              <Download className="w-3 h-3" /> Download Offer
                            </Button>
                          )}
                          {offer && offer.status === "SENT" && (
    <Button
        variant="outline"
        size="sm"
        onClick={() => markHired(offer.id)}
        className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
    >
        <ArrowUpRight className="w-3 h-3" />
        Mark Hired
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
              <div className="space-y-2"><Label>Expected Joining Date</Label><Input type="date" value={offerForm.joiningDate} onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })} required /></div>
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