/**
 * FIXED API utilities for production deployment
 * Replace the existing src/lib/api.js with this version
 */

// Use environment variable for API base URL, fallback to Railway production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-production-f1d71.up.railway.app/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Applicant methods
  async getBanks() {
    return this.request('/applicants/banks');
  }

  async saveCredentials(credentials) {
    return this.request('/applicants/credentials', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/applicants/profile');
  }

  async updateProfile(profileData) {
    return this.request('/applicants/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Admin methods
  async getApplicants() {
    return this.request('/admin/applicants');
  }

  async getApplicantCredentials(applicantId) {
    return this.request(`/admin/applicants/${applicantId}/credentials`);
  }

  async getTickets() {
    return this.request('/admin/tickets');
  }

  async createTicket(ticketData) {
    return this.request('/admin/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(ticketId, updates) {
    return this.request(`/admin/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export instances - both named and default exports for compatibility
const apiClient = new ApiClient();
const api = apiClient;

// Export both ways to ensure compatibility with existing imports
export { apiClient };
export default api;

