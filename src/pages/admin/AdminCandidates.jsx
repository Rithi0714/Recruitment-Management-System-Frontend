import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import api from "@/api/api";
import { toast } from "sonner";

export default function AdminCandidates() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await api.get("/candidates");

      console.log(response.data);

      setCandidates(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load candidates");
    }
  };

  const filtered = candidates.filter(
    (candidate) =>
      candidate.name?.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="All Candidates"
        subtitle="Read-only view of all candidates in the system"
      />

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>

                    <TableCell>{candidate.email}</TableCell>

                    <TableCell>{candidate.position}</TableCell>

                    <TableCell>
                      {candidate.recruiterName || "—"}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={candidate.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}