import Axios from "axios";
import { Project, Ticket, User } from '../utils/types'

Axios.defaults.baseURL = "http://localhost:8080/api/v1";
Axios.defaults.headers.post["Content-Type"] = "application/json";

class API{

  // User APIs

    async getUserById(userId: number): Promise<User>{
      const response = await Axios.get(`user/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
      console.log(response.data)
      return response.data;
    }

  // Project APIs

     // Method to fetch projects with typed response
     async getProjects(): Promise<Project[]> {
      try {
          const response = await Axios.get<Project[]>("project/assigned-projects", {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          });
          return response.data;  // Data is now typed as Project[]
      } catch (error) {
          console.error("Error fetching projects:", error);
          throw error;
      }
  }

  async getProjectById(projectId: number): Promise<Project>{
    const response = await Axios.get(`project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }


  async getProjectUsers(userIds: number[]): Promise<User[]> {
    const promises = userIds.map(userId => this.getUserById(userId));
    const users = await Promise.all(promises);
    return users;
  }

  async getTickets(): Promise<Ticket[]> {
    const reponse = await Axios.get(`ticket`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return reponse.data;
  }


  async getTicketById(ticketId: number): Promise<Ticket>{
    const reponse = await Axios.get(`ticket/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return reponse.data;
  }

  async getProjectTickets(ticketIds: number[]): Promise<Ticket[]>{
    const promises = ticketIds.map(ticketId => this.getTicketById(ticketId));
    const tickets = await Promise.all(promises);
    return tickets;
  }

  
}

const api = new API();
export default api;