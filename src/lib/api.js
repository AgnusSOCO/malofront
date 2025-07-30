/**
 * API utilities for communicating with the loan platform backend
 */

const API_BASE_URL = '/api';

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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // Applicant endpoints
  async getProfile() {
    return this.request('/applicants/profile');
  }

  async updateProfile(profileData) {
    return this.request('/applicants/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getBanks() {
    return this.request('/applicants/banks');
  }

  async addBankCredentials(providerID, username, password) {
    return this.request('/applicants/bank-credentials', {
      method: 'POST',
      body: JSON.stringify({
        provider_id: providerID,
        username,
        password,
      }),
    });
  }

  async getBankCredentials() {
    return this.request('/applicants/bank-credentials');
  }

  async deleteBankCredentials(credentialId) {
    return this.request(`/applicants/bank-credentials/${credentialId}`, {
      method: 'DELETE',
    });
  }

  async getApplicationStatus() {
    return this.request('/applicants/status');
  }

  // Admin endpoints
  async getApplicants(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/applicants${queryString ? `?${queryString}` : ''}`);
  }

  async getApplicantDetails(applicantId) {
    return this.request(`/admin/applicants/${applicantId}`);
  }

  async approveApplicant(applicantId, contractScanUrl) {
    return this.request(`/admin/applicants/${applicantId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ contract_scan_url: contractScanUrl }),
    });
  }

  async getTickets(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/tickets${queryString ? `?${queryString}` : ''}`);
  }

  async createTicket(ticketData) {
    return this.request('/admin/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async addTicketComment(ticketId, body) {
    return this.request(`/admin/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  async getAuditLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/audit-logs${queryString ? `?${queryString}` : ''}`);
  }

  logout() {
    this.setToken(null);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

