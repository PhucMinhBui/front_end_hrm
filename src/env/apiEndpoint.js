// src/env/apiEndpoints.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  CONFIRM_EMAIL: `${API_BASE_URL}/confirmations`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
};
