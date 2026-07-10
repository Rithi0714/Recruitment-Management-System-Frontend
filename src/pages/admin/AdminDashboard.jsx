import React, { useMemo, useEffect, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Users,
  Calendar,
  Briefcase,
  UserCheck,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/api/api";
import { toast } from "sonner";

const STATUS_COLORS = {
  applied: "#3B82F6",
  "in review": "#F59E0B",
  shortlisted: "#8B5CF6",
  "interview scheduled": "#6366F1",
  "interview completed": "#06B6D4",
  selected: "#10B981",
  rejected: "#EF4444",
  "offer sent": "#A855F7",
  hired: "#22C55E",
};

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        candidateResponse,
        interviewResponse,
        recruiterResponse,
      ] = await Promise.all([
        api.get("/candidates"),
        api.get("/interviews"),
        api.get("/recruiters"),
      ]);

      setCandidates(candidateResponse.data);
      setInterviews(interviewResponse.data);
      setRecruiters(recruiterResponse.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {};

    candidates.forEach((candidate) => {
      const label = (candidate.status || "APPLIED")
        .replace(/_/g, " ")
        .toLowerCase();

      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [candidates]);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Read-only monitoring of all recruitment activity"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <StatCard
          title="Total Candidates"
          value={candidates.length}
          icon={Users}
          color="primary"
        />

        <StatCard
          title="Total Interviews"
          value={interviews.length}
          icon={Calendar}
          color="warning"
        />

        <StatCard
          title="Recruiters"
          value={recruiters.length}
          icon={Briefcase}
          color="violet"
        />

        <StatCard
          title="HR Users"
          value={1}
          icon={UserCheck}
          color="success"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Candidate Status Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            {statusCounts.length > 0 ? (
              <div className="space-y-2">
                {[...statusCounts]
                  .sort((a, b) => b.value - a.value)
                  .map((item) => {
                    const maxVal = Math.max(
                      ...statusCounts.map((d) => d.value),
                      1
                    );

                    const pct = Math.round(
                      (item.value / maxVal) * 100
                    );

                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-3"
                      >
                        <span className="w-32 text-sm capitalize text-muted-foreground truncate shrink-0">
                          {item.name}
                        </span>

                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                STATUS_COLORS[item.name] ||
                                "#6B7280",
                            }}
                          />
                        </div>

                        <span className="text-sm font-semibold w-6 text-right shrink-0">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                No data
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading">
              Recent Candidates
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">

              {candidates.slice(0, 8).map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {candidate.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {candidate.position} ·{" "}
                      {candidate.recruiterId || "Unassigned"}
                    </p>
                  </div>

                  <StatusBadge status={candidate.status} />
                </div>
              ))}

              {candidates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No candidates yet
                </p>
              )}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}