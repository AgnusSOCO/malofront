/**
 * Updated API Client with correct endpoint paths
 * Replace your src/lib/api.js with this version
 */

const API_BASE_URL = 'https://web-production-f1d71.up.railway.app/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`Making API request to: ${url}`);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Banks
  async getBanks() {
    return this.request('/applicants/banks');
  }

  // Bank Credentials - FIXED ENDPOINTS
  async getUserCredentials() {
    return this.request('/applicants/credentials');
  }

  async saveCredentials(providerId, credentials) {
    return this.request('/applicants/credentials', {
      method: 'POST',
      body: JSON.stringify({
        provider_id: providerId,
        username: credentials.username,
        password: credentials.password
      }),
    });
  }

  async deleteCredentials(credentialId) {
    return this.request(`/applicants/credentials/${credentialId}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getApplicants() {
    return this.request('/admin/applicants');
  }

  async getTickets() {
    return this.request('/admin/tickets');
  }

  async approveApplicant(applicantId) {
    return this.request(`/admin/applicants/${applicantId}/approve`, {
      method: 'POST',
    });
  }

  async rejectApplicant(applicantId) {
    return this.request(`/admin/applicants/${applicantId}/reject`, {
      method: 'POST',
    });
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

// Create and export the API client instance
const apiClient = new ApiClient();

// Export both named and default exports for compatibility
export { apiClient };
export default apiClient;

