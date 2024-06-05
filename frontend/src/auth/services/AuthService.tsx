import axios from 'axios';
import Axios from "axios";

Axios.defaults.headers.post["Content-Type"] = "application/json";

export type Authentication = {
  value : boolean;
}
const BASE_URL = 'http://localhost:8080/api/v1';

class T {
}

class AuthService {
  isAuthenticated = false;

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { token } = data;
      console.log('Token received:', token); // Debugging line
      localStorage.setItem('token', token);
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      this.isAuthenticated = false;
      return false;
    }
  }


  logout(){
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    return Promise.resolve();  // Ensure to return a promise
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }


  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return false;
    }

    return axios.get<{ isValid: boolean}>(`${BASE_URL}/auth/validateToken`, {
      params: {
        token: localStorage.getItem("token")
      }
    })
        .then(response => {
          const isValid: T = response.data;
          console.log(response)

          this.isAuthenticated = !isValid;
          return !isValid;
        })
        .catch(error => {
          console.error('Token validation error:', error);
          this.isAuthenticated = false;
          return false;
        });
  }
}


export const authService = new AuthService();