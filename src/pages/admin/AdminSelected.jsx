import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import api from "@/api/api";
import { toast } from "sonner";

export default function AdminSelected() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

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

  const selected = candidates.filter((candidate) =>
    ["SELECTED", "OFFER_SENT", "HIRED"].includes(candidate.status)
  );

  return (
    <div>
      <PageHeader
        title="Selected Candidates"
        subtitle="Read-only view of selected candidates"
      />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selected.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No selected candidates
                  </TableCell>
                </TableRow>
              ) : (
                selected.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>

                    <TableCell>
                      {candidate.position}
                    </TableCell>

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