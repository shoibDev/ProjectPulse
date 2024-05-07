export interface User{
  id: number;
  firstName: string; 
  lastName: string;
  email: string;
  phoneNumber: string;
  projectIds: number[];
  ticketIds: number[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  dateCreated: string;
  lastUpdated: string;
  userIds: number[];
  ticketIds: number[];
}

export interface Ticket{
  id: number;
  creator: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  assignedUserId: number;
  projectId: number;
}