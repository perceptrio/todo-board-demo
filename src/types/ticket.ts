export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  labels: string[];
  dueDate: string;
  estimate: number; // in hours
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  status: Ticket['status'];
  tickets: Ticket[];
}
