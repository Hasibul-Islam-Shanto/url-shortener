import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime } from '@/utils/formatDate';
import type { AnalyticsVisit } from '../types';

export function RecentVisitsTable({ visits }: { visits: AnalyticsVisit[] }) {
  if (visits.length === 0) {
    return <EmptyState title="No visits yet" description="Recent visits will appear here." />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Browser</TableHeaderCell>
          <TableHeaderCell>OS</TableHeaderCell>
          <TableHeaderCell>Device</TableHeaderCell>
          <TableHeaderCell>Referrer</TableHeaderCell>
          <TableHeaderCell>Visited at</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visits.map((visit) => (
          <TableRow key={visit._id}>
            <TableCell>{visit.browser}</TableCell>
            <TableCell>{visit.operatingSystem}</TableCell>
            <TableCell>{visit.device}</TableCell>
            <TableCell>{visit.referrer}</TableCell>
            <TableCell>{formatDateTime(visit.visitedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
