/**
 * API Client for Loan Platform
 * ✅ FIXED: Bank credentials saving functionality
 * ✅ FIXED: Import/export compatibility for frontend build
 * ✅ Proper error handling and authentication
 */

const API_BASE_URL = 'https://web-production-f1d71.up.railway.app';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ✅ FIXED: Get authentication token
  getAuthToken() {
    try {
      const token = localStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // ✅ FIXED: Get authentication headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // ✅ FIXED: Generic request method
  async request(method, endpoint, data = null) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        method: method.toUpperCase(),
        headers: this.getAuthHeaders(),
      };

      if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      console.log(`Making ${method.toUpperCase()} request to:`, url);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      return result;
      
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ✅ FIXED: GET method
  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  // ✅ FIXED: POST method
  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  // ✅ FIXED: PUT method
  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  // ✅ FIXED: DELETE method
  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await this.post('/api/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      return await this.post('/api/auth/register', userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ✅ FIXED: Bank credentials methods
  async getBanks() {
    try {
      const response = await this.get('/api/applicants/banks');
      return response.banks || [];
    } catch (error) {
      console.error('Error getting banks:', error);
      return [];
    }
  }

  async getUserCredentials() {
    try {
      const credentials = await this.get('/api/applicants/credentials');
      return Array.isArray(credentials) ? credentials : [];
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }

  // ✅ CRITICAL FIX: Save bank credentials method
  async saveCredentials(credentialsData) {
    try {
      console.log('Saving credentials:', credentialsData);
      
      const response = await this.post('/api/applicants/credentials', credentialsData);
      
      console.log('Credentials saved successfully:', response);
      return response;
      
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw new Error(`Error al guardar las credenciales: ${error.message}`);
    }
  }

  async deleteCredential(credentialId) {
    try {
      return await this.delete(`/api/applicants/credentials/${credentialId}`);
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw error;
    }
  }

  // Admin methods
  async getApplicants() {
    try {
      const response = await this.get('/api/admin/applicants');
      return response.applicants || [];
    } catch (error) {
      console.error('Error getting applicants:', error);
      return [];
    }
  }

  async getApplicantCredentials(applicantId) {
    try {
      const response = await this.get(`/api/admin/applicants/${applicantId}/credentials`);
      return response.credentials || [];
    } catch (error) {
      console.error('Error getting applicant credentials:', error);
      return [];
    }
  }

  async updateApplicantStatus(applicantId, status) {
    try {
      return await this.put(`/api/admin/applicants/${applicantId}/status`, { status });
    } catch (error) {
      console.error('Error updating applicant status:', error);
      throw error;
    }
  }

  async getAdminStats() {
    try {
      return await this.get('/api/admin/stats');
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return { users: { total: 0, approved: 0, pending: 0, needs_2fa: 0 } };
    }
  }

  // Ticket methods
  async getTickets() {
    try {
      const response = await this.get('/api/tickets/');
      return response.tickets || [];
    } catch (error) {
      console.error('Error getting tickets:', error);
      return [];
    }
  }

  async createTicket(ticketData) {
    try {
      return await this.post('/api/tickets/', ticketData);
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async updateTicket(ticketId, ticketData) {
    try {
      return await this.put(`/api/tickets/${ticketId}`, ticketData);
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      return await this.delete(`/api/tickets/${ticketId}`);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }

  async getTicketStats() {
    try {
      return await this.get('/api/tickets/stats');
    } catch (error) {
      console.error('Error getting ticket stats:', error);
      return { total: 0, by_status: {}, by_priority: {} };
    }
  }

  // Health check
  async healthCheck() {
    try {
      return await this.get('/api/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// ✅ CRITICAL FIX: Create singleton instance
const apiClient = new ApiClient();

// ✅ CRITICAL FIX: Export both named and default exports for compatibility
export { apiClient, ApiClient };
export default apiClient;

