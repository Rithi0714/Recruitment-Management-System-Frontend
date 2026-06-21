import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Search, Video, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { dummyInterviews } from '@/lib/dummyData';

export default function AdminInterviews() {
  const [search, setSearch] = useState('');
  const interviews = dummyInterviews;

  const filtered = interviews.filter(i =>
    i.candidate_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="All Interviews" subtitle="Read-only view of all interviews" />
      <Card className="shadow-sm">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by candidate name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead>
                <TableHead>Recruiter</TableHead><TableHead>Type</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No interviews found</TableCell></TableRow>
              ) : (
                filtered.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.candidate_name}</TableCell>
                    <TableCell>{i.interview_date && format(new Date(i.interview_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{i.interview_time || '—'}</TableCell>
                    <TableCell>{i.recruiter_name || '—'}</TableCell>
                    <TableCell className="capitalize">{i.interview_type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {i.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span className="capitalize">{i.mode}</span>
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
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