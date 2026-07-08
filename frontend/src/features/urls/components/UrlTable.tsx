import { Table, TableHead, TableBody, TableRow, TableHeaderCell } from '@/components/ui/Table';
import { UrlRow } from './UrlRow';
import type { Url } from '../types';

export function UrlTable({ urls }: { urls: Url[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Original URL</TableHeaderCell>
          <TableHeaderCell>Short URL</TableHeaderCell>
          <TableHeaderCell>Clicks</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Created</TableHeaderCell>
          <TableHeaderCell>Expires</TableHeaderCell>
          <TableHeaderCell>
            <span className="sr-only">Actions</span>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {urls.map((url) => (
          <UrlRow key={url._id} url={url} />
        ))}
      </TableBody>
    </Table>
  );
}
