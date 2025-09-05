'use client';

import { Ticket } from '@/types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
  onRemoveLabel?: (ticketId: string, label: string) => void;
}

export function TicketCard({ ticket, onEdit, onDelete, onRemoveLabel }: TicketCardProps) {
  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    if (diffDays <= 3) return 'due-soon';
    return 'normal';
  };

  const getDueDateColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600 bg-red-50';
      case 'due-today':
        return 'text-orange-600 bg-orange-50';
      case 'due-soon':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-500';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDoubleClick = () => {
    if (onEdit) {
      onEdit(ticket);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this ticket?')) {
      onDelete(ticket.id);
    }
  };

  const dueDateStatus = getDueDateStatus(ticket.dueDate);

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onDoubleClick={handleDoubleClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {ticket.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
              title="Delete ticket"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {ticket.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {ticket.labels.map((label, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
          >
            {label}
            {onRemoveLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLabel(ticket.id, label);
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                title="Remove label"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
            {getInitials(ticket.assignee)}
          </div>
          <span>{ticket.assignee}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{ticket.estimate}h</span>
          <span>•</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDueDateColor(dueDateStatus)}`}>
            {dueDateStatus === 'overdue' && 'Overdue'}
            {dueDateStatus === 'due-today' && 'Due Today'}
            {dueDateStatus === 'due-soon' && 'Due Soon'}
            {dueDateStatus === 'normal' && formatDate(ticket.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
