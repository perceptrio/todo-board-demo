'use client';

import { useState, useEffect } from 'react';
import { Ticket } from '@/types/ticket';
import { sampleTickets } from '@/data/sampleData';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

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

  return {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket,
  };
}
