import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const analyzeWebsites = async (urls, options = {}) => {
  const res = await api.post("/api/analyze", {
    urls,
    fetch_resources: options.fetchResources ?? true,
    resource_limit: options.resourceLimit ?? 10,
    check_advanced: options.checkAdvanced ?? true,
  });
  return res.data;
};

export const getAnalysisStatus = async (taskId) => {
  const res = await api.get(`/api/analysis/${taskId}`);
  return res.data;
};

export default api;
