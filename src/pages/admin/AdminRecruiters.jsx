import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export default function AdminRecruiters() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => base44.entities.Candidate.list('-created_date', 500),
  });

  const recruiters = users.filter(u => u.role === 'recruiter');
  const getAssignedCount = (id) => candidates.filter(c => c.assigned_recruiter_id === id).length;

  return (
    <div>
      <PageHeader title="All Recruiters" subtitle="Read-only view of all recruiters" />

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
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : recruiters.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No recruiters found</TableCell></TableRow>
              ) : (
                recruiters.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.department || '—'}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono">{getAssignedCount(r.id)}</Badge></TableCell>
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