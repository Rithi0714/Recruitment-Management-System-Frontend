import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Eye, Plus, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from "@/api/api";

export default function HRRecruiters() {
  const [candidates, setCandidates] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [assignForm, setAssignForm] = useState({ candidate_id: '' });

  const [recruiters, setRecruiters] = useState([]);
  const [showAddRecruiterModal, setShowAddRecruiterModal] = useState(false);
  const [recruiterForm, setRecruiterForm] = useState({ name: '', email: '', department: '' });

  const [searchTerm, setSearchTerm] = useState("");

  const [showEditRecruiterModal, setShowEditRecruiterModal] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState(null);

    useEffect(() => {
    loadRecruiters();
    loadCandidates();
  }, []);
  

  const loadRecruiters = async () => {
    try {
      const response = await api.get("/recruiters");
      setRecruiters(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recruiters");
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await api.get("/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.error(error);
    }
  };
   
  const openEditRecruiter = (recruiter) => {

  setEditingRecruiter(recruiter);

  setRecruiterForm({
    name: recruiter.name,
    email: recruiter.email,
    department: recruiter.department || ""
  });

  setShowEditRecruiterModal(true);
}; 

  const handleAddRecruiter = async (e) => {
  e.preventDefault();

  try {

    const recruiterData = {
      name: recruiterForm.name,
      email: recruiterForm.email,
      phone: "9963149645",
      department: recruiterForm.department,
      skills: ""
    };

    await api.post("/recruiters", recruiterData);

    toast.success("Recruiter added successfully");

    setRecruiterForm({
      name: "",
      email: "",
      department: ""
    });

    setShowAddRecruiterModal(false);

    loadRecruiters();

  } catch (error) {

    console.error(error);

    toast.error("Failed to add recruiter");
  }
};
 const [assignedCandidates, setAssignedCandidates] = useState([]);

const loadAssignedCandidates = async (recruiterId) => {

  try {

    const response = await api.get(
      `/recruiters/${recruiterId}/candidates`
    );

    setAssignedCandidates(response.data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load assigned candidates");
  }
};

 const unassignedCandidates = candidates.filter(c => !c.recruiterId);

const filteredRecruiters = recruiters.filter((r) =>
  r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (r.department || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

  const handleAssign = async (e) => {
  e.preventDefault();

  if (!selectedRecruiter || !assignForm.candidate_id) return;

  try {

    await api.post(
      `/recruiters/${selectedRecruiter.id}/assign/${assignForm.candidate_id}`
    );

    toast.success("Candidate assigned successfully");

    loadRecruiters();
    loadCandidates();

    setShowAssignModal(false);

  } catch (error) {

    console.error(error);

    toast.error("Assignment failed");
  }
};

const handleUnassign = async (candidateId) => {

  try {

    await api.put(
      `/recruiters/candidates/${candidateId}/unassign`
    );

    toast.success("Candidate unassigned successfully");

    await loadAssignedCandidates(selectedRecruiter.id);

    await loadRecruiters();

    await loadCandidates();

  } catch (error) {

    console.error(error);

    toast.error("Failed to unassign candidate");

  }

};

const handleUpdateRecruiter = async (e) => {

  e.preventDefault();

  try {

    await api.put(
      `/recruiters/${editingRecruiter.id}`,
      {
        name: recruiterForm.name,
        email: recruiterForm.email,
        phone: editingRecruiter.phone,
        department: recruiterForm.department,
        skills: editingRecruiter.skills || ""
      }
    );

    toast.success("Recruiter updated successfully");

    setShowEditRecruiterModal(false);

    loadRecruiters();

  } catch (error) {

    console.error(error);

    toast.error("Failed to update recruiter");

  }

};

const handleDeleteRecruiter = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this recruiter?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/recruiters/${id}`);

    toast.success("Recruiter deleted successfully");

    loadRecruiters();

  } catch (error) {

    console.error(error);

    toast.error("Failed to delete recruiter");

  }

};

  return (
    <div>
      <PageHeader title="Recruiters" subtitle={`${recruiters.length} recruiters in the system`}
        action={<Button onClick={() => setShowAddRecruiterModal(true)} className="gap-2"><Plus className="w-4 h-4" /> Add New Recruiter</Button>}
      />

      <Card className="shadow-sm">
        <div className="p-4 border-b">
          <Input
          placeholder="Search recruiter by name, email or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
         </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead>
                <TableHead>Assigned Candidates</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecruiters.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No recruiters found</TableCell></TableRow>
              ) : (
                filteredRecruiters.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.department || '—'}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono"> {r.assignedCandidatesCount} </Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={async () => { setSelectedRecruiter(r); await loadAssignedCandidates(r.id); setShowCandidatesModal(true); }}>
                           <Eye className="w-3 h-3" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => openEditRecruiter(r)} >
                        <Pencil className="w-3 h-3" />  Edit 
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700" onClick={() => handleDeleteRecruiter(r.id)} >
                        <Trash2 className="w-3 h-3" /> Delete
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
            <div className="space-y-2"><Label>Full Name *</Label><Input value={recruiterForm.name} onChange={(e) => setRecruiterForm({ ...recruiterForm, name: e.target.value })} required placeholder="e.g. John Doe" /></div>
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
          <DialogHeader><DialogTitle className="font-heading">Assign Candidate to {selectedRecruiter?.name}</DialogTitle></DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select Candidate</Label>
              <Select value={String(assignForm.candidate_id)} onValueChange={(v) => setAssignForm({ candidate_id: v})}
>
                <SelectTrigger><SelectValue placeholder="Choose a candidate" /></SelectTrigger>
                <SelectContent>
                  {unassignedCandidates.length === 0 ? (
                    <SelectItem value="_none" disabled>No unassigned candidates</SelectItem>
                  ) : (
                    unassignedCandidates.map(c => (<SelectItem key={c.id} value={String(c.id)} >{c.name} — {c.position}</SelectItem>))
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


   <Dialog
  open={showEditRecruiterModal}
  onOpenChange={setShowEditRecruiterModal}
>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Recruiter</DialogTitle>
    </DialogHeader>

    <form
  onSubmit={handleUpdateRecruiter}
  className="space-y-4 mt-2"
>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={recruiterForm.name}
          onChange={(e) =>
            setRecruiterForm({
              ...recruiterForm,
              name: e.target.value
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={recruiterForm.email}
          onChange={(e) =>
            setRecruiterForm({
              ...recruiterForm,
              email: e.target.value
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <Input
          value={recruiterForm.department}
          onChange={(e) =>
            setRecruiterForm({
              ...recruiterForm,
              department: e.target.value
            })
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowEditRecruiterModal(false)}
        >
          Cancel
        </Button>

        <Button type="submit">
          Update Recruiter
        </Button>

      </div>

    </form>

  </DialogContent>
</Dialog>

      <Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{selectedRecruiter?.name}'s Candidates</DialogTitle></DialogHeader>
          <div className="mt-2">
            {assignedCandidates.length > 0 ? (
              <div className="space-y-2">
                {assignedCandidates.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">

                  <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.position}</p>
                  </div>

                <div className="flex items-center gap-2">

                <Badge variant="outline" className="capitalize">
                {c.status?.replace(/_/g, " ")}
                </Badge>

               <Button size="sm" variant="destructive" onClick={() => handleUnassign(c.id)}>
               Unassign
               </Button>

                </div>

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