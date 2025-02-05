import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Update with your API URL

export const fetchTestData = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test data:", error);
    throw error;
  }
};

// Fetch data from the database
export const fetchDataFromDB = async () => {
  try {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from DB:", error);
    throw error;
  }
};
