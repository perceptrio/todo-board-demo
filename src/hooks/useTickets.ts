'use client';

import { useState, useEffect, useMemo } from 'react';
import { Ticket } from '@/types/ticket';
import { sampleTickets } from '@/data/sampleData';

export interface FilterOptions {
  search: string;
  assignee: string;
  priority: string;
  label: string;
  status: string;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    assignee: '',
    priority: '',
    label: '',
    status: '',
  });

  // Load tickets from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch (error) {
        console.error('Error loading tickets from localStorage:', error);
        setTickets(sampleTickets);
      }
    } else {
      setTickets(sampleTickets);
    }
  }, []);

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicket = (id: string, ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...ticketData, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const removeLabel = (ticketId: string, labelToRemove: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            labels: ticket.labels.filter(label => label !== labelToRemove),
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));
  };

  // Filter tickets based on current filters
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.labels.some(label => label.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Assignee filter
      if (filters.assignee && ticket.assignee !== filters.assignee) {
        return false;
      }

      // Priority filter
      if (filters.priority && ticket.priority !== filters.priority) {
        return false;
      }

      // Label filter
      if (filters.label && !ticket.labels.includes(filters.label)) {
        return false;
      }

      // Status filter
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [tickets, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tickets.length;
    const p0 = tickets.filter(ticket => ticket.priority === 'urgent').length;
    const dueSoon = tickets.filter(ticket => {
      const dueDate = new Date(ticket.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;

    return { total, p0, dueSoon };
  }, [tickets]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const assignees = [...new Set(tickets.map(ticket => ticket.assignee))];
    const priorities = [...new Set(tickets.map(ticket => ticket.priority))];
    const labels = [...new Set(tickets.flatMap(ticket => ticket.labels))];
    const statuses = [...new Set(tickets.map(ticket => ticket.status))];

    return { assignees, priorities, labels, statuses };
  }, [tickets]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      assignee: '',
      priority: '',
      label: '',
      status: '',
    });
  };

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    filters,
    stats,
    filterOptions,
    addTicket,
    updateTicket,
    deleteTicket,
    removeLabel,
    updateFilters,
    clearFilters,
  };
}
