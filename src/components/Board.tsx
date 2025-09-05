'use client';

import { useState } from 'react';
import { Ticket, BoardColumn } from '@/types/ticket';
import { TicketCard } from './TicketCard';
import { TicketModal } from './TicketModal';
import { useTickets } from '@/hooks/useTickets';

export function Board() {
  const { tickets, addTicket, updateTicket, deleteTicket } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const columns: BoardColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      status: 'backlog',
      tickets: tickets.filter(ticket => ticket.status === 'backlog'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      tickets: tickets.filter(ticket => ticket.status === 'in-progress'),
    },
    {
      id: 'review',
      title: 'Review',
      status: 'review',
      tickets: tickets.filter(ticket => ticket.status === 'review'),
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      tickets: tickets.filter(ticket => ticket.status === 'done'),
    },
  ];

  const handleNewTicket = () => {
    setEditingTicket(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (modalMode === 'create') {
      addTicket(ticketData);
    } else if (editingTicket) {
      updateTicket(editingTicket.id, ticketData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  return (
    <>
      <div className="flex gap-6 p-6 min-h-screen bg-gray-50">
        {columns.map((column) => (
          <div key={column.id} className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {column.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {column.tickets.length} tickets
                    </span>
                  </div>
                  {column.status === 'backlog' && (
                    <button
                      onClick={handleNewTicket}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      + New Ticket
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3 min-h-[400px]">
                {column.tickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onEdit={handleEditTicket}
                    onDelete={deleteTicket}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTicket}
        ticket={editingTicket}
        mode={modalMode}
      />
    </>
  );
}
