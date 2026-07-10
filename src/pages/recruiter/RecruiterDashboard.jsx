import React from 'react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

export default function RecruiterDashboard() {
const recruiterId = 6;

const [myCandidates, setMyCandidates] = useState([]);
const [myInterviews, setMyInterviews] = useState([]);

useEffect(() => {

    loadCandidates();
    loadInterviews();

}, []);
  
const loadCandidates = async () => {

    try {

        const res = await axios.get(
            `http://localhost:8080/api/recruiters/${recruiterId}/candidates`
        );

        setMyCandidates(res.data);

    } catch (err) {

        console.log(err);

    }

};

const loadInterviews = async () => {

    try {

        const res = await axios.get(
            `http://localhost:8080/api/interviews/recruiter/${recruiterId}`
        );

        setMyInterviews(res.data);
        console.log(res.data);
    } catch (err) {

        console.log(err);

    }

};

  const scheduledCount = myInterviews.filter(i => i.status === 'Scheduled').length;
  const completedCount = myInterviews.filter(i => i.status === 'Completed').length;

const today = format(new Date(), "yyyy-MM-dd");

const todaysInterviews = myInterviews.filter((i) => {

    const interviewDate = format(
        new Date(i.interviewDateTime),
        "yyyy-MM-dd"
    );

    return (
        interviewDate === today &&
        i.status === "Scheduled"
    );

});
  const recentCandidates = myCandidates.slice(0, 5);

  return (
    <div>
      <PageHeader
    title="Dashboard"
    subtitle="Welcome back, Recruiter"/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="My Candidates" value={myCandidates.length} icon={Users} color="primary" />
        <StatCard title="Scheduled Interviews" value={scheduledCount} icon={Calendar} color="warning" />
        <StatCard title="Interviews Completed" value={completedCount} icon={CheckCircle} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Today's Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysInterviews.length > 0 ? (
              <div className="space-y-3">
                {todaysInterviews.map(i => (
                  <div key={i.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
    <p className="text-sm font-medium">
        {i.candidateName}
    </p>

    <p className="text-xs text-muted-foreground">
        {format(new Date(i.interviewDateTime), "hh:mm a")}
        {" · "}
        {i.interviewType}
        {" · "}
        {i.interviewMode}
    </p>
</div>
                    <StatusBadge status={i.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No interviews today</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Recent Candidates Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCandidates.length > 0 ? (
              <div className="space-y-3">
                {recentCandidates.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.position}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No candidates assigned yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}