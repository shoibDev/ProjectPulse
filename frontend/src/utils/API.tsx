import Axios from "axios";
import {Project, Ticket, User} from '../utils/types'

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


    async getAllUsersExceptCurrent(): Promise<User[]>{
      const response = await Axios.get(`user/exclude-current`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.data;
  }

  // Project APIs


  async createProject(project: Project): Promise<Project> {
    const response = await Axios.post<Project>("project/create-project", {
      title: project.title,
      description: project.description
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  }
  
  

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

  // Method to update a project
async updateProject(projectId: number, project: any): Promise<Project> {
  const response = await Axios.put(`project/${projectId}/update-project`, project, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
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
    return await Promise.all(promises);
  }

  async addTeamMember(projectId: number | undefined, userId: number){
    await Axios.put(`project/${projectId}/user/${userId}`, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
  }

  async removeTeamMember(projectId: number, userId: number){
    await Axios.delete(`project/${projectId}/user/${userId}`, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
  }

  async removeAllTeamMembers(projectId: number){
    await Axios.delete(`project/${projectId}/users`, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
  }

  async deleteProject(projectId: number | undefined){
    await Axios.delete(`project/${projectId}/delete`, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
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