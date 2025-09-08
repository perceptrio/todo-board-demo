'use client';

import { useState } from 'react';
import { Ticket, BoardColumn } from '@/types/ticket';
import { TicketCard } from './TicketCard';
import { TicketModal } from './TicketModal';
import { SearchAndFilters } from './SearchAndFilters';
import { useTickets } from '@/hooks/useTickets';

export function Board() {
  const { 
    tickets, 
    allTickets,
    filters,
    stats,
    filterOptions,
    addTicket, 
    updateTicket, 
    deleteTicket, 
    removeLabel,
    updateFilters,
    clearFilters,
    exportBoard,
    importBoard,
    clearBoard
  } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const [aiBusy,setAiBusy]=useState(false);

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

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Ticket['status']) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    
    // Find the ticket and update its status
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== targetStatus) {
      updateTicket(ticketId, { ...ticket, status: targetStatus });
    }
    
    setDraggedOverColumn(null);
  };

  const summarize = async()=>{
    if(aiBusy) return; setAiBusy(true); try{
      const r = await fetch('/api/summarize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tickets: allTickets})});
      const j = await r.json();
      alert((j && (j.summary||j.error)) || 'nope');
    }catch(e:any){
      alert('fail');
    } finally{setAiBusy(false)}
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importBoard(file);
      alert('Board imported successfully!');
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <>
      <div className="p-4 sm:p-6 pb-20">
        <div className="mb-6">
          <SearchAndFilters
            filters={filters}
            filterOptions={filterOptions}
            stats={stats}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
          
          {/* Data Portability Controls */}
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 justify-end">
            <button
              onClick={exportBoard}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              📤 Export
            </button>
            
            <label className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors">
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={summarize}
              disabled={aiBusy}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
            >
              {aiBusy? 'Summarizing…' : '🧠 Summarize with AI'}
            </button>
            
            <button
              onClick={clearBoard}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div 
                className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border-2 transition-all duration-200 flex-1 ${
                  draggedOverColumn === column.id 
                    ? 'border-blue-400 bg-blue-50/70 scale-[1.02]' 
                    : 'border-gray-200/50 hover:border-gray-300/50'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className="p-4 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        {column.title}
                      </h2>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {column.tickets.length} tickets
                      </span>
                    </div>
                    {column.status === 'backlog' && (
                      <button
                        onClick={handleNewTicket}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        + New
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3 min-h-[300px] sm:min-h-[400px]">
                  {column.tickets.map((ticket) => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      onEdit={handleEditTicket}
                      onDelete={deleteTicket}
                      onRemoveLabel={removeLabel}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
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
