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
}

export const authService = new AuthService();
