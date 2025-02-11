import axios from 'axios';

// Replace with your actual DeepSeek API base URL and key
const API_BASE_URL = 'https://api.deepseek.com';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual key

export const fetchJobListings = async (company, role) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs`, {
      params: { company, role },
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return [];
  }
};

export const fetchH1BData = async (company) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/h1b`, {
      params: { company },
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching H1B data:', error);
    return { applications: 0, accepted: 0, rejected: 0, salary: 0 };
  }
};
