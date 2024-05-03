import Axios from "axios";
import { Project } from '../utils/types'

Axios.defaults.baseURL = "http://localhost:8080/api/v1";
Axios.defaults.headers.post["Content-Type"] = "application/json";

class API{

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
}

const api = new API();
export default api;