import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export default function AdminSelected() {
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => base44.entities.Candidate.list('-created_date', 500),
  });

  const selected = candidates.filter(c => ['selected', 'offer_sent', 'hired'].includes(c.status));

  return (
    <div>
      <PageHeader title="Selected Candidates" subtitle="Read-only view of selected candidates" />

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
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : selected.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No selected candidates</TableCell></TableRow>
              ) : (
                selected.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.position}</TableCell>
                    <TableCell>{c.assigned_recruiter_name || '—'}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
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