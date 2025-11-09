import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const analyzeImage = async (base64Image) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/analyze`,
      { image: base64Image },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    return response.data; // Now contains { text, report, metadata }
  } catch (err) {
    if (err.response) throw new Error(err.response.data?.message || err.response.data?.error);
    if (err.request) throw new Error('Unable to connect to server.');
    throw new Error(err.message);
  }
};

export const checkApiHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    return res.status === 200;
  } catch (e) {
    console.error("API offline");
    return false;
  }
};
