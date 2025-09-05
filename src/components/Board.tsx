'use client';

import { Ticket, BoardColumn } from '@/types/ticket';
import { sampleTickets } from '@/data/sampleData';
import { TicketCard } from './TicketCard';

export function Board() {
  const columns: BoardColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      status: 'backlog',
      tickets: sampleTickets.filter(ticket => ticket.status === 'backlog'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      tickets: sampleTickets.filter(ticket => ticket.status === 'in-progress'),
    },
    {
      id: 'review',
      title: 'Review',
      status: 'review',
      tickets: sampleTickets.filter(ticket => ticket.status === 'review'),
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      tickets: sampleTickets.filter(ticket => ticket.status === 'done'),
    },
  ];

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-50">
      {columns.map((column) => (
        <div key={column.id} className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {column.title}
              </h2>
              <span className="text-sm text-gray-500">
                {column.tickets.length} tickets
              </span>
            </div>
            <div className="p-4 space-y-3 min-h-[400px]">
              {column.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
