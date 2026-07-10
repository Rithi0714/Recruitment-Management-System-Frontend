import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  interview_scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
  interview_completed: "bg-cyan-50 text-cyan-700 border-cyan-200",
  selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  offer_sent: "bg-purple-50 text-purple-700 border-purple-200",
  hired: "bg-green-50 text-green-700 border-green-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  draft: "bg-gray-50 text-gray-700 border-gray-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  declined: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels = {
  applied: "Applied",
  in_review: "In Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  interview_completed: "Interview Completed",
  selected: "Selected",
  rejected: "Rejected",
  offer_sent: "Offer Sent",
  hired: "Hired",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

export default function StatusBadge({ status }) {
  const key = status ? status.toLowerCase() : "";

  console.log("StatusBadge:", status, key);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        statusStyles[key] || "bg-gray-50 text-gray-700"
      )}
    >
      {statusLabels[key] || status}
    </Badge>
  );
}