import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Calendar, UserCheck, UserX, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HRDashboard() {
  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => base44.entities.Candidate.list('-created_date', 100),
  });

  const { data: interviews = [] } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => base44.entities.Interview.list('-created_date', 100),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.ActivityLog.list('-created_date', 10),
  });

  const applied = candidates.length;
  const scheduled = interviews.filter(i => i.status === 'scheduled').length;
  const selected = candidates.filter(c => ['selected', 'offer_sent', 'hired'].includes(c.status)).length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;

  const upcomingInterviews = interviews
    .filter(i => i.status === 'scheduled' && i.interview_date >= format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => a.interview_date.localeCompare(b.interview_date))
    .slice(0, 5);

  // Chart data - interviews per month
  const monthlyData = React.useMemo(() => {
    const months = {};
    interviews.forEach(i => {
      if (i.interview_date) {
        const month = format(new Date(i.interview_date), 'MMM yyyy');
        months[month] = (months[month] || 0) + 1;
      }
    });
    return Object.entries(months).map(([month, count]) => ({ month, interviews: count })).slice(-6);
  }, [interviews]);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your recruitment pipeline" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Applied Candidates" value={applied} icon={Users} color="primary" />
        <StatCard title="Interviews Scheduled" value={scheduled} icon={Calendar} color="warning" />
        <StatCard title="Selected" value={selected} icon={UserCheck} color="success" />
        <StatCard title="Rejected" value={rejected} icon={UserX} color="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading">Interviews Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="interviews" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                No interview data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{interview.candidate_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {interview.interview_date && format(new Date(interview.interview_date), 'MMM d')} · {interview.interview_time}
                      </p>
                    </div>
                    <StatusBadge status={interview.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming interviews</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-heading">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{act.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {act.performed_by} · {act.created_date && format(new Date(act.created_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}