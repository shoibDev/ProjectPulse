import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

class AuthService {
  isAuthenticated = false;
  userRole = null;

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
      const { token, role } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      this.isAuthenticated = true;
      this.userRole = role;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticated = false;
    this.userRole = null;
    return Promise.resolve();
  }

  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const response = await axios.get(`${BASE_URL}/auth/validateToken`, {
        params: { token }
      });
      const isValid = response.data.isValid;

      this.isAuthenticated = isValid;
      if (!isValid) {
        this.logout();  // Ensure the user is logged out if the token is invalid
      }
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      this.isAuthenticated = false;
      return false;
    }
  }
}

export const authService = new AuthService();
