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
import { Search, Video, MapPin } from "lucide-react";
import { format } from "date-fns";
import api from "@/api/api";
import { toast } from "sonner";

export default function AdminInterviews() {
  const [search, setSearch] = useState("");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadInterviews();
  }, []);

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

  const filtered = interviews.filter((i) =>
    i.candidateName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="All Interviews"
        subtitle="Read-only view of all interviews"
      />

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Search by candidate name..."
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
                <TableHead>Candidate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No interviews found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((i) => (
                  <TableRow key={i.interviewId}>
                    <TableCell className="font-medium">
                      {i.candidateName}
                    </TableCell>

                    <TableCell>
                      {i.interviewDateTime
                        ? format(
                            new Date(i.interviewDateTime),
                            "MMM d, yyyy"
                          )
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {i.interviewDateTime
                        ? format(
                            new Date(i.interviewDateTime),
                            "hh:mm a"
                          )
                        : "—"}
                    </TableCell>

                    <TableCell>{i.recruiterName || "—"}</TableCell>

                    <TableCell className="capitalize">
                      {i.interviewType}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {i.interviewMode?.toUpperCase() === "ONLINE" ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}

                        <span className="capitalize">
                          {i.interviewMode?.toLowerCase()}
                        </span>
                      </span>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={i.status} />
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