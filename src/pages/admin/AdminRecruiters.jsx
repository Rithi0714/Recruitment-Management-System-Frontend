import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
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

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadRecruiters();
    loadCandidates();
  }, []);

  const loadRecruiters = async () => {
    try {
      const response = await api.get("/recruiters");
      console.log("Recruiters:", response.data);
      setRecruiters(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recruiters");
    }
  };

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

  const getAssignedCount = (recruiterId) => {
    return candidates.filter(
      (candidate) => candidate.recruiterId === recruiterId
    ).length;
  };

  return (
    <div>
      <PageHeader
        title="All Recruiters"
        subtitle="Read-only view of all recruiters"
      />

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Candidates</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recruiters.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No recruiters found
                  </TableCell>
                </TableRow>
              ) : (
                recruiters.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.name}
                    </TableCell>

                    <TableCell>{r.email}</TableCell>

                    <TableCell>
                      {r.department || "—"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono"
                      >
                        {getAssignedCount(r.id)}
                      </Badge>
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