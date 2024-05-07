import axios from 'axios';

export type Authentication = {
  value : boolean;
}
const BASE_URL = 'http://localhost:8080/api/v1';

class AuthService {
  isAuthenticated = false;

  async login(email: string, password: string): Promise<boolean> {
    return axios.post<{ token: string }>(`${BASE_URL}/auth/authenticate`, { email, password })
      .then(response => {
        const { token } = response.data;
        localStorage.setItem('token', token);
        this.isAuthenticated = true;
        return true;  // Return true on successful login
      })
      .catch(error => {
        console.error('Login error:', error);
        this.isAuthenticated = false;
        return false;  // Return false on login failure
      });
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
      let isValid: boolean = response.data;
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
