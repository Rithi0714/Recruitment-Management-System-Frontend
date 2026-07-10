import { useState, useEffect } from "react";
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
import { Plus, Search, Pencil, Video, Trash2, MapPin, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from "@/api/api";

export default function HRInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [reportType, setReportType] = useState("daily");

const [reportDate, setReportDate] = useState("");

const [weekStartDate, setWeekStartDate] = useState("");

const [reportMonth, setReportMonth] = useState("");

const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [dlFrom, setDlFrom] = useState('');
  const [dlTo, setDlTo] = useState('');
  const [dlAll, setDlAll] = useState(false);
  const [assignedCandidates, setAssignedCandidates] = useState([]);

  const loadCandidates = async () => {

  try {

    const response = await api.get("/candidates");

    setCandidates(response.data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load candidates");

  }

};

const loadRecruiters = async () => {

  try {

    const response = await api.get("/recruiters");

    setRecruiters(response.data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load recruiters");

  }

};

const loadInterviews = async () => {

  try {

    const response = await api.get("/interviews");

    console.log(response.data);

    setInterviews(response.data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load interviews");

  }

};
const fetchAssignedCandidates = async (recruiterId) => {

  try {

    console.log("Recruiter:", recruiterId);

    const response = await api.get(
      `/recruiters/${recruiterId}/candidates`
    );

    setAssignedCandidates(response.data);

    console.log("Assigned Candidates:", response.data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load assigned candidates");

    setAssignedCandidates([]);
  }
};

useEffect(() => {

    loadCandidates();

    loadRecruiters();

    loadInterviews();

}, []);

  const handleDownload = () => {
    const data = dlAll
      ? interviews
      : interviews.filter(i => {
          if (!i.interviewDateTime) return false;
          const d = i.interviewDateTime;
          return (!dlFrom || d >= dlFrom) && (!dlTo || d <= dlTo);
        });
    const headers = ['Candidate', 'Position', 'Recruiter', 'Date', 'Time', 'Type', 'Mode', 'Status', 'Notes'];
    const rows = data.map(i => [
  i.candidateName,
  '',
  i.recruiterName,
  i.interviewDateTime?.split("T")[0],
  i.interviewDateTime?.split("T")[1]?.substring(0,5),
  i.interviewType,
  i.interviewMode,
  i.status,
  i.notes || ''
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
    interview_date: '', interview_time: '', interview_type: 'HR', mode: 'Online', meeting_link: '', notes: ''
  });

  const closeModal = () => {
    setShowModal(false); setEditingInterview(null);
    setForm({ candidate_id: '', candidate_name: '', recruiter_id: '', recruiter_name: '', interview_date: '', interview_time: '', interview_type: 'hr', mode: 'online', meeting_link: '', notes: '' });
  };

  const openEdit = (interview) => {
  setEditingInterview(interview);

  setForm({
    candidate_id: String(interview.candidateId),

    candidate_name: interview.candidateName,

    recruiter_id: String(interview.recruiterId),

    recruiter_name: interview.recruiterName,

    interview_date: interview.interviewDateTime.split("T")[0],

    interview_time: interview.interviewDateTime
      ? interview.interviewDateTime.split("T")[1].substring(0, 5)
      : "",

    interview_type: interview.interviewType || "hr",

    mode: interview.interviewMode || "online",

    meeting_link: interview.meetingLink || "",

    notes: interview.notes || ""
  });

  setShowModal(true);
};

  const handleCandidateSelect = (candidateId) => {
    const cand = candidates.find(
    c => String(c.id) === String(candidateId)
);
    setForm({ ...form, candidate_id: candidateId, candidate_name: cand?.name || '' });
  };

  const handleRecruiterSelect = (recruiterId) => {
  const recruiter = recruiters.find(
    (r) => String(r.id) === String(recruiterId)
  );

  setForm({
    ...form,
    recruiter_id: recruiterId,
    recruiter_name: recruiter?.name || "",
    candidate_id: "",
    candidate_name: ""
  });

  fetchAssignedCandidates(recruiterId);
};
 const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const payload = {

            candidateId: Number(form.candidate_id),

            recruiterId: Number(form.recruiter_id),

            interviewDateTime:
                `${form.interview_date}T${form.interview_time}`,

            interviewType: form.interview_type,

            interviewMode: form.mode,

            meetingLink: form.meeting_link,

            status: "Scheduled",

            notes: form.notes,

            feedback: ""
        };

        if (editingInterview) {

            await api.put(
                `/interviews/${editingInterview.interviewId}`,
                payload
            );

            toast.success("Interview updated");

        } else {

            await api.post("/interviews", payload);

            toast.success("Interview scheduled");
        }

        await loadInterviews();

        closeModal();

    } catch (error) {

        console.error(error);

        toast.error("Failed to save interview");
    }
};


const handleDelete = async (id) => {

  if (!window.confirm("Delete this interview?")) return;

  try {

    await api.delete(`/interviews/${id}`);

    toast.success("Interview deleted");

    loadInterviews();

  } catch (error) {

    console.error(error);

    toast.error("Delete failed");

  }

};
const downloadReport = async () => {

    try {

        let url = "";

        if (reportType === "daily") {

            url = `/interviews/export/daily?date=${reportDate}`;

        } else if (reportType === "weekly") {

            url = `/interviews/export/weekly?startDate=${weekStartDate}`;

        } else {

            url = `/interviews/export/monthly?month=${reportMonth}&year=${reportYear}`;

        }

        const response = await api.get(url, {
            responseType: "blob",
        });

        const blob = new Blob([
            response.data
        ]);

        const fileURL =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = fileURL;

        link.download = "Interview_Report.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        toast.success("Report downloaded successfully");

        setShowDownloadModal(false);

    } catch (error) {

        console.error(error);

        toast.error("Failed to download report");

    }

};

  const filtered = interviews.filter(i => {
const matchSearch =
    !search ||
    i.candidateName?.toLowerCase().includes(search.toLowerCase());

const matchDate =
    !dateFilter ||
    i.interviewDateTime?.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  console.log("Date Filter:", dateFilter);
console.log("Interviews:", interviews);

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
                <TableHead>Recruiter</TableHead><TableHead>Type</TableHead><TableHead>Mode</TableHead><TableHead>Meeting Link</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No interviews found</TableCell></TableRow>
              ) : (
                filtered.map((i) => (
                  <TableRow key={i.interviewId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{i.candidateName}</TableCell>
                    <TableCell>{i.interviewDateTime
  ? format(new Date(i.interviewDateTime), "MMM d, yyyy")
  : "—"}</TableCell>
                    <TableCell>{i.interviewDateTime
  ? i.interviewDateTime.split("T")[1].substring(0,5)
  : "—"}</TableCell>
                    <TableCell>{i.recruiterName || '—'}</TableCell>
                    <TableCell className="capitalize">{i.interviewType}</TableCell>
                    <TableCell>
  <div className="flex flex-col">
    <span className="inline-flex items-center gap-1 text-sm">
      {i.interviewMode?.toLowerCase() === "online" ? (
        <Video className="w-3 h-3" />
      ) : (
        <MapPin className="w-3 h-3" />
      )}

      <span className="capitalize">{i.interviewMode}</span>
    </span>
  </div>
</TableCell>
<TableCell>
  {i.meetingLink ? (
    <a
      href={i.meetingLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      Join Meeting
    </a>
  ) : (
    "-"
  )}
</TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className="text-right">
                     <div className="flex justify-end gap-2">

  <Button
      variant="ghost"
      size="icon"
      onClick={() => openEdit(i)}
  >
      <Pencil className="w-4 h-4" />
  </Button>

  <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDelete(i.interviewId)}
  >
      <Trash2 className="w-4 h-4 text-red-500" />
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

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="max-w-sm">
         <DialogHeader>
    <DialogTitle>Download Interview Report</DialogTitle>
</DialogHeader>

<div className="space-y-5 mt-3">

    <div className="space-y-3">

        <label className="flex items-center gap-2">
            <input
                type="radio"
                value="daily"
                checked={reportType === "daily"}
                onChange={() => setReportType("daily")}
            />
            Daily Report
        </label>

        <label className="flex items-center gap-2">
            <input
                type="radio"
                value="weekly"
                checked={reportType === "weekly"}
                onChange={() => setReportType("weekly")}
            />
            Weekly Report
        </label>

        <label className="flex items-center gap-2">
            <input
                type="radio"
                value="monthly"
                checked={reportType === "monthly"}
                onChange={() => setReportType("monthly")}
            />
            Monthly Report
        </label>

    </div>

    {reportType === "daily" && (

        <div className="space-y-2">

            <Label>Select Date</Label>

            <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
            />

        </div>

    )}

    {reportType === "weekly" && (

        <div className="space-y-2">

            <Label>Week Start Date</Label>

            <Input
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
            />

        </div>

    )}

    {reportType === "monthly" && (

        <div className="grid grid-cols-2 gap-3">

            <div>

                <Label>Month</Label>

                <Input
                    type="number"
                    min="1"
                    max="12"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                />

            </div>

            <div>

                <Label>Year</Label>

                <Input
                    type="number"
                    value={reportYear}
                    onChange={(e) => setReportYear(e.target.value)}
                />

            </div>

        </div>

    )}

    <Button
        className="w-full"
        onClick={downloadReport}
    >
        Download Report
    </Button>

</div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{editingInterview ? 'Edit Interview' : 'Schedule an Interview'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select Recruiter *</Label>
              <Select value={form.recruiter_id} onValueChange={handleRecruiterSelect}>
                <SelectTrigger><SelectValue placeholder="Choose recruiter" /></SelectTrigger>
                <SelectContent>
                  {recruiters.map(r => (<SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Candidate *</Label>
              <Select value={form.candidate_id} onValueChange={handleCandidateSelect}>
                <SelectTrigger><SelectValue placeholder="Choose candidate" /></SelectTrigger>
               <SelectContent> {assignedCandidates.map((c) => ( <SelectItem key={c.id} value={String(c.id)}> {c.name} - {c.position} </SelectItem>))}
               </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Interview Type *</Label>
                <Select value={form.interview_type} onValueChange={(v) => setForm({ ...form, interview_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Managerial">Managerial</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Mode *</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Online">Online</SelectItem>
<SelectItem value="Offline">Offline</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.interview_date} onChange={(e) => setForm({ ...form, interview_date: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Time *</Label><Input type="time" value={form.interview_time} onChange={(e) => setForm({ ...form, interview_time: e.target.value })} required /></div>
            </div>
            {form.mode?.toLowerCase() === "online" && (
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