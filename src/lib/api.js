// API Client for Loan Platform
// Fixed version with proper method definitions and error handling

const API_BASE_URL = 'https://web-production-f1d71.up.railway.app/api';

// Get JWT token from localStorage
const getAuthToken = () => {
  try {
    const token = localStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Create headers with authentication
const createHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Making API request to: ${url}`);
  
  const config = {
    headers: createHeaders(),
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// API Client object with all methods
const apiClient = {
  // GET request
  get: async (endpoint) => {
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // POST request
  post: async (endpoint, data) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: async (endpoint, data) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: async (endpoint) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  },

  // Authentication methods
  login: async (email, password) => {
    console.log('Attempting login for:', email);
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Login successful, token saved');
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    console.log('Attempting registration for:', userData.email);
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Registration successful, token saved');
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logged out, token removed');
  },

  // Bank-related methods
  getBanks: async () => {
    console.log('Fetching available banks...');
    try {
      return await apiClient.get('/applicants/banks');
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      // Return fallback banks if API fails
      return {
        banks: [
          { id: 'bbva-mexico', name: 'BBVA México', logo: '/banks/bbva.jpg' },
          { id: 'santander-mexico', name: 'Santander México', logo: '/banks/santander.png' },
          { id: 'banamex', name: 'Banamex', logo: '/banks/banamex.jpg' },
          { id: 'banorte', name: 'Banorte', logo: '/banks/banorte.jpg' },
          { id: 'hsbc-mexico', name: 'HSBC México', logo: '/banks/hsbc.png' },
          { id: 'banco-azteca', name: 'Banco Azteca', logo: '/banks/azteca.jpg' }
        ]
      };
    }
  },

  getCredentials: async () => {
    console.log('Fetching user credentials...');
    try {
      return await apiClient.get('/applicants/credentials');
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      // Return empty array if API fails
      return [];
    }
  },

  saveCredentials: async (credentialData) => {
    console.log('Saving credentials for bank:', credentialData.provider_id);
    try {
      return await apiClient.post('/applicants/credentials', credentialData);
    } catch (error) {
      console.error('Failed to save credentials:', error);
      throw error;
    }
  },

  deleteCredentials: async (credentialId) => {
    console.log('Deleting credentials:', credentialId);
    try {
      return await apiClient.delete(`/applicants/credentials/${credentialId}`);
    } catch (error) {
      console.error('Failed to delete credentials:', error);
      throw error;
    }
  },

  // Admin methods
  getApplicants: async () => {
    console.log('Fetching applicants (admin)...');
    try {
      return await apiClient.get('/admin/applicants');
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      // Return mock data if API fails
      return [];
    }
  },

  getTickets: async () => {
    console.log('Fetching tickets (admin)...');
    try {
      return await apiClient.get('/admin/tickets');
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      // Return mock data if API fails
      return [];
    }
  },

  // NEW: Admin method to get applicant's bank credentials
  getApplicantCredentials: async (applicantId) => {
    console.log('Fetching credentials for applicant:', applicantId);
    try {
      return await apiClient.get(`/admin/applicants/${applicantId}/credentials`);
    } catch (error) {
      console.error('Failed to fetch applicant credentials:', error);
      throw error;
    }
  },

  // User profile methods
  getProfile: async () => {
    console.log('Fetching user profile...');
    try {
      return await apiClient.get('/applicants/profile');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Return basic profile from localStorage
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  },

  updateProfile: async (profileData) => {
    console.log('Updating user profile...');
    try {
      return await apiClient.put('/applicants/profile', profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Application status methods
  getApplicationStatus: async () => {
    console.log('Fetching application status...');
    try {
      return await apiClient.get('/applicants/application-status');
    } catch (error) {
      console.error('Failed to fetch application status:', error);
      // Return default status if API fails
      return {
        status: 'new',
        progress: 0,
        message: 'Bienvenido a la plataforma'
      };
    }
  }
};

// Export both named and default exports for compatibility
export { apiClient };
export default apiClient;

// Global error handler for debugging
window.apiClient = apiClient;
console.log('🚀 API Client initialized with all methods');

