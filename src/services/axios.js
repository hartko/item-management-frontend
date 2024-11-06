import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration or any errors
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response directly if it's successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem('token'); // Remove the expired or invalid token
      window.location.href = '/'; // Redirect to login page
    }

    // You can also handle other error statuses or log them here
    return Promise.reject(error); // Reject the promise for further error handling
  }
);

export default axiosInstance;