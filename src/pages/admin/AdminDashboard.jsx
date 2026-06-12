import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Calendar, UserCheck, UserX, Briefcase, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['hsl(225,73%,57%)', 'hsl(38,92%,50%)', 'hsl(152,69%,40%)', 'hsl(0,84%,60%)', 'hsl(280,65%,60%)', 'hsl(160,60%,45%)'];

export default function AdminDashboard() {
  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => base44.entities.Candidate.list('-created_date', 500),
  });

  const { data: interviews = [] } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => base44.entities.Interview.list('-created_date', 500),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const recruiters = users.filter(u => u.role === 'recruiter');
  const hrUsers = users.filter(u => u.role === 'hr');

  const statusCounts = React.useMemo(() => {
    const counts = {};
    candidates.forEach(c => {
      const label = (c.status || 'applied').replace(/_/g, ' ');
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [candidates]);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Read-only monitoring of all recruitment activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Candidates" value={candidates.length} icon={Users} color="primary" />
        <StatCard title="Total Interviews" value={interviews.length} icon={Calendar} color="warning" />
        <StatCard title="Recruiters" value={recruiters.length} icon={Briefcase} color="violet" />
        <StatCard title="HR Users" value={hrUsers.length} icon={UserCheck} color="success" />
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
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusCounts} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusCounts.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidates.slice(0, 8).map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.position} · {c.assigned_recruiter_name || 'Unassigned'}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
              {candidates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No candidates yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}