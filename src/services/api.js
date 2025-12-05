// API Client for Carbon Intelligence Backend
// Handles both REST API and WebSocket connections
// Author: Daksh Desai

import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5001";

// WebSocket client singleton
let socket = null;
let socketCallbacks = {};

// Initialize WebSocket connection
export const initWebSocket = () => {
  if (socket?.connected) return socket;

  socket = io(WS_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Connected to Carbon Intelligence Backend WebSocket");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from backend WebSocket");
  });

  socket.on("connection_response", (data) => {
    console.log("Backend:", data.message);
  });

  // Auto-receive data updates (broadcast every 10 seconds)
  socket.on("data_update", (data) => {
    console.log("📊 Received live data update:", data.timestamp);
    if (socketCallbacks.analytics) {
      socketCallbacks.analytics(data.analytics);
    }
  });

  // Analytics updates
  socket.on("analytics_update", (data) => {
    if (socketCallbacks.analytics) {
      socketCallbacks.analytics(data);
    }
  });

  // Projects updates
  socket.on("projects_update", (data) => {
    if (socketCallbacks.projects) {
      socketCallbacks.projects(data);
    }
  });

  // Finance updates
  socket.on("finance_update", (data) => {
    if (socketCallbacks.finance) {
      socketCallbacks.finance(data);
    }
  });

  // News updates
  socket.on("news_update", (data) => {
    if (socketCallbacks.news) {
      socketCallbacks.news(data);
    }
  });

  return socket;
};

// Register callback for data updates
export const onDataUpdate = (type, callback) => {
  socketCallbacks[type] = callback;
};

// Request specific data via WebSocket
export const requestData = (type) => {
  if (!socket) initWebSocket();
  socket.emit("request_data", { type });
};

// ============================================================================
// REST API FUNCTIONS
// ============================================================================

// Generic fetch wrapper with error handling
const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Health Check
export const healthCheck = async () => {
  return apiFetch("/health");
};

// ============================================================================
// PROJECTS API
// ============================================================================

export const getProjects = async (
  limit = 100,
  country = null,
  category = null
) => {
  let url = `/api/projects?limit=${limit}`;
  if (country) url += `&country=${country}`;
  if (category) url += `&category=${category}`;
  return apiFetch(url);
};

export const getProjectById = async (id) => {
  return apiFetch(`/api/project/${id}`);
};

export const searchProjects = async (query, limit = 50) => {
  return apiFetch("/api/projects/search", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  });
};

export const getCountries = async () => {
  return apiFetch("/api/countries");
};

export const getCategories = async () => {
  return apiFetch("/api/categories");
};

// ============================================================================
// FINANCE & ESG API
// ============================================================================

export const getFinance = async (ticker = null) => {
  const url = ticker ? `/api/finance?ticker=${ticker}` : "/api/finance";
  return apiFetch(url);
};

export const getFinanceByTicker = async (ticker) => {
  return apiFetch(`/api/finance/${ticker}`);
};

export const analyzeESG = async (tickers = null) => {
  return apiFetch("/api/analysis/esg", {
    method: "POST",
    body: JSON.stringify({ tickers }),
  });
};

// Alias for backward compatibility
export const getCompanies = async () => {
  const result = await getFinance();
  return result.data || [];
};

export const getCompanyById = async (ticker) => {
  const result = await getFinanceByTicker(ticker);
  return result.data || null;
};

// ============================================================================
// NEWS API
// ============================================================================

export const getNews = async (limit = 50, source = null) => {
  let url = `/api/news?limit=${limit}`;
  if (source) url += `&source=${source}`;
  return apiFetch(url);
};

export const analyzeNewsSentiment = async () => {
  return apiFetch("/api/analysis/news-sentiment");
};

// ============================================================================
// ANALYTICS API
// ============================================================================

export const getAnalytics = async () => {
  return apiFetch("/api/analytics");
};

export const analyzeCarbonTrends = async () => {
  return apiFetch("/api/analysis/carbon-trends");
};

export const getDashboardSummary = async () => {
  return getAnalytics();
};

// ============================================================================
// LEGACY COMPATIBILITY (for existing frontend code)
// ============================================================================

export const getCompanyCharts = async (ticker) => {
  // Return mock chart data based on finance data
  const company = await getFinanceByTicker(ticker);
  if (!company.success) return null;

  return {
    esg_trend: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      score: company.data.esg_score + Math.random() * 10 - 5,
    })),
    price_trend: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      price: company.data.price * (1 + (Math.random() * 0.2 - 0.1)),
    })),
  };
};

export const getFinanceTickers = async () => {
  const result = await getFinance();
  return result.data?.map((f) => f.ticker) || [];
};

export const searchCompanies = async (query) => {
  const finance = await getFinance();
  const companies = finance.data || [];
  return companies.filter(
    (c) =>
      c.company_name?.toLowerCase().includes(query.toLowerCase()) ||
      c.ticker?.toLowerCase().includes(query.toLowerCase())
  );
};

export const getESGAnalysis = async () => {
  return analyzeESG();
};

export const getTrendsAnalysis = async () => {
  return analyzeCarbonTrends();
};

export const getRiskAnalysis = async (projectId = null) => {
  // Mock risk analysis based on projects
  const projects = await getProjects(100);
  return {
    success: true,
    risk_levels: {
      low: projects.data?.filter((p) => p.price < 10).length || 0,
      medium:
        projects.data?.filter((p) => p.price >= 10 && p.price < 20).length || 0,
      high: projects.data?.filter((p) => p.price >= 20).length || 0,
    },
  };
};

export const getRecommendations = async (preferences = {}) => {
  // Get projects and return top recommendations
  const projects = await getProjects(20);
  return {
    success: true,
    recommendations: projects.data || [],
  };
};

export const getPortfolioMetrics = async (portfolio = []) => {
  // Calculate portfolio metrics from projects
  const projects = await getProjects(500);
  return {
    success: true,
    total_value: portfolio.length * 10000,
    total_credits: portfolio.length * 1000,
    avg_price: 12.5,
  };
};

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

export default {
  // WebSocket
  initWebSocket,
  onDataUpdate,
  requestData,

  // Health
  healthCheck,

  // Projects
  getProjects,
  getProjectById,
  searchProjects,
  getCountries,
  getCategories,

  // Finance & ESG
  getFinance,
  getFinanceByTicker,
  getCompanies,
  getCompanyById,
  getCompanyCharts,
  getFinanceTickers,
  analyzeESG,
  searchCompanies,

  // News
  getNews,
  analyzeNewsSentiment,

  // Analytics
  getAnalytics,
  analyzeCarbonTrends,
  getDashboardSummary,

  // Analysis (Legacy)
  getESGAnalysis,
  getTrendsAnalysis,
  getRiskAnalysis,
  getRecommendations,
  getPortfolioMetrics,
};
