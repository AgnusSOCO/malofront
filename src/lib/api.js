// API Client with proper authentication handling
const API_BASE_URL = 'https://web-production-f1d71.up.railway.app/api';

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header');
    } else {
      console.warn('No auth token available for authenticated request');
    }
  }

  return headers;
};

// Main API client object
const apiClient = {
  // GET request
  get: async (endpoint, requireAuth = true) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making GET request to: ${url}`);
      
      const headers = createHeaders(requireAuth);
      console.log('Request headers:', headers);

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GET ${endpoint} failed:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log(`GET ${endpoint} success:`, data);
      return data;
    } catch (error) {
      console.error(`Error in GET ${endpoint}:`, error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data, requireAuth = true) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making POST request to: ${url}`);
      console.log('Request data:', data);
      
      const headers = createHeaders(requireAuth);
      console.log('Request headers:', headers);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`POST ${endpoint} failed:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log(`POST ${endpoint} success:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error in POST ${endpoint}:`, error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data, requireAuth = true) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making PUT request to: ${url}`);
      
      const headers = createHeaders(requireAuth);

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in PUT ${endpoint}:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint, requireAuth = true) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making DELETE request to: ${url}`);
      
      const headers = createHeaders(requireAuth);

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in DELETE ${endpoint}:`, error);
      throw error;
    }
  },

  // Authentication methods
  login: async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await apiClient.post('/auth/login', { email, password }, false);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Login successful, token stored');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email);
      return await apiClient.post('/auth/register', userData, false);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logout successful, token removed');
  },

  // Bank-related methods
  getBanks: async () => {
    try {
      return await apiClient.get('/applicants/banks', false); // Banks don't require auth
    } catch (error) {
      console.error('Error getting banks:', error);
      // Return fallback banks with real UUIDs
      return {
        banks: [
          {
            id: '7b4a1d12-cc50-46d8-81c7-08eebfc5bf5a',
            name: 'BBVA México',
            code: 'BBVA',
            logo_url: '/banks/bbva.jpg'
          },
          {
            id: 'b153f653-3af6-48ab-b3c7-44d919fbdcb6',
            name: 'Santander México',
            code: 'SANTANDER',
            logo_url: '/banks/santander.png'
          },
          {
            id: '43d4a40e-f175-4690-ad63-c86efc69adc0',
            name: 'Banamex',
            code: 'BANAMEX',
            logo_url: '/banks/banamex.jpg'
          },
          {
            id: '842f0822-e62f-47f6-a559-c5641cc16669',
            name: 'Banorte',
            code: 'BANORTE',
            logo_url: '/banks/banorte.jpg'
          },
          {
            id: '47dc2c19-dc0b-401d-8947-d8705b315d3e',
            name: 'HSBC México',
            code: 'HSBC',
            logo_url: '/banks/hsbc.png'
          },
          {
            id: 'f885f8e0-9f67-475d-9844-cf5fb34b0313',
            name: 'Banco Azteca',
            code: 'AZTECA',
            logo_url: '/banks/azteca.jpg'
          }
        ]
      };
    }
  },

  getCredentials: async () => {
    try {
      console.log('Getting user credentials...');
      return await apiClient.get('/applicants/credentials', true); // Requires auth
    } catch (error) {
      console.error('Error getting credentials:', error);
      return []; // Return empty array on error
    }
  },

  saveCredentials: async (credentialData) => {
    try {
      console.log('Saving credentials:', credentialData);
      return await apiClient.post('/applicants/credentials', credentialData, true); // Requires auth
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  },

  deleteCredentials: async (credentialId) => {
    try {
      console.log('Deleting credential:', credentialId);
      return await apiClient.delete(`/applicants/credentials/${credentialId}`, true); // Requires auth
    } catch (error) {
      console.error('Error deleting credentials:', error);
      throw error;
    }
  },

  // Admin methods
  getApplicants: async () => {
    try {
      console.log('Getting applicants for admin...');
      const response = await apiClient.get('/admin/applicants', true); // Requires auth
      
      // Handle both response formats
      if (response && response.applicants) {
        return response.applicants;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        console.warn('Unexpected response format for applicants:', response);
        return [];
      }
    } catch (error) {
      console.error('Error getting applicants:', error);
      // Return fallback data for testing
      return [
        {
          id: '9ae13833-30de-4d00-b98d-eec4dcf65b73',
          name: 'Juan Cordero',
          email: 'juan@socopwa.com',
          curp: 'HEGG560427MVZRRL04',
          is_active: true,
          is_approved: false,
          created_at: '2025-07-31T01:02:39.762615'
        }
      ];
    }
  },

  getApplicantCredentials: async (applicantId) => {
    try {
      console.log('Getting credentials for applicant:', applicantId);
      return await apiClient.get(`/admin/applicants/${applicantId}/credentials`, true); // Requires auth
    } catch (error) {
      console.error('Error getting applicant credentials:', error);
      // Return fallback data for testing
      return {
        applicant: {
          name: 'Juan Cordero',
          email: 'juan@socopwa.com'
        },
        credentials: [
          {
            provider_name: 'BBVA México',
            username: 'juan.test@bbva.com',
            created_at: '2025-07-31T06:45:00Z'
          }
        ]
      };
    }
  },

  getTickets: async () => {
    try {
      console.log('Getting tickets for admin...');
      return await apiClient.get('/admin/tickets', true); // Requires auth
    } catch (error) {
      console.error('Error getting tickets:', error);
      return []; // Return empty array on error
    }
  },

  // Health check (no auth required)
  health: async () => {
    try {
      return await apiClient.get('/health', false);
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
};

// Export both named and default exports for compatibility
export { apiClient };
export default apiClient;

