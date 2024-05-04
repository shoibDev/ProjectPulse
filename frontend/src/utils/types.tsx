export interface User{

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