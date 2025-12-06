# Carbon Intelligence - Frontend Setup & Usage

**Author:** Daksh Desai  
**Last Updated:** December 5, 2025

Complete guide for running the Carbon Intelligence frontend with live WebSocket integration.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0
- **npm** >= 9.0
- **Backend running** on port 5001 (see backend/README.md)

### 1. Install Dependencies

```bash
cd /Users/dakshdesai/Codes/InterIIT\ Tech/interiit-tech-iitgn
npm install
```

**Packages installed:**

- `react` & `react-dom` - UI framework
- `react-router-dom` - Navigation
- `socket.io-client` - WebSocket for live updates
- `recharts` - Data visualization
- `lucide-react` - Icons
- `fuse.js` - Fuzzy search
- `vite` - Build tool

### 2. Configure Environment

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5001
VITE_WS_URL=http://localhost:5001
```

### 3. Start Development Server

```bash
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

---

## 🔌 WebSocket Integration

The frontend automatically connects to the backend WebSocket for **live data updates every 10 seconds**.

### Features:

- ✅ **Real-time analytics updates**
- ✅ **Live project data streaming**
- ✅ **Finance/ESG data updates**
- ✅ **News sentiment updates**
- ✅ **Automatic reconnection** on disconnect

### How It Works:

```javascript
// Automatically initializes in Dashboard.jsx
api.initWebSocket();

// Register callbacks for live updates
api.onDataUpdate("analytics", (data) => {
  console.log("New analytics:", data);
  // Update UI with new data
});

// Request specific data
api.requestData("projects");
```

---

## 📊 API Integration

All API calls go through `/src/services/api.js`:

### Projects

```javascript
import api from "./services/api";

// Get all projects
const projects = await api.getProjects(100);

// Search projects
const results = await api.searchProjects("wind power");

// Get countries
const countries = await api.getCountries();
```

### Finance & ESG

```javascript
// Get all finance data
const finance = await api.getFinance();

// Get specific ticker
const company = await api.getFinanceByTicker("AAPL");

// Analyze ESG
const esgAnalysis = await api.analyzeESG(["AAPL", "TSLA"]);
```

### News

```javascript
// Get news with sentiment
const news = await api.getNews(50);

// Analyze sentiment
const sentiment = await api.analyzeNewsSentiment();
```

### Analytics

```javascript
// Get dashboard analytics
const analytics = await api.getAnalytics();

// Carbon trends
const trends = await api.analyzeCarbonTrends();
```

---

## 🎨 Pages Overview

### 1. Dashboard (`/`)

- **Live analytics** with WebSocket updates
- **Company watchlist** with localStorage persistence
- **News feed** with sentiment analysis
- **Search functionality** with fuzzy matching
- **Real-time data updates** every 10 seconds

### 2. Projects Page (`/projects`)

- Browse all carbon credit projects
- Filter by country and category
- Search projects by name
- View project details

### 3. Report Page (`/report/:id`)

- Detailed company/project report
- ESG scores and metrics
- Historical charts
- Investment recommendations

---

## 🛠 Development

### Project Structure

```
src/
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
├── index.css                # Global styles
├── services/
│   └── api.js              # API & WebSocket client
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   └── DashboardChatSidebar.jsx
├── pages/
│   ├── Dashboard.jsx       # Main dashboard
│   ├── ProjectsPage.jsx    # Projects listing
│   └── ReportPage.jsx      # Detailed reports
└── data/
    ├── companies.json      # Fallback data (deprecated)
    ├── projects.json       # Fallback data (deprecated)
    └── news.json           # Fallback data (deprecated)
```

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Development Server

- **Port:** 5173
- **Hot reload:** Enabled
- **API proxy:** Not needed (direct fetch to backend)

---

## 🔧 Common Operations

### Start Everything

```bash
# Terminal 1: Start backend
cd backend/carbon-intelligence
docker-compose up -d

# Terminal 2: Start frontend
cd /Users/dakshdesai/Codes/InterIIT\ Tech/interiit-tech-iitgn
npm run dev
```

### Stop Everything

```bash
# Stop frontend (Ctrl+C in terminal)

# Stop backend
cd backend/carbon-intelligence
docker-compose down
```

### Restart Frontend

```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Clear Cache

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Troubleshooting

### Frontend Won't Start

**Check Node version:**

```bash
node --version  # Should be >= 18
npm --version   # Should be >= 9
```

**Reinstall dependencies:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Can't Connect to Backend

**Verify backend is running:**

```bash
curl http://localhost:5001/health
```

**Check .env file:**

```env
VITE_API_URL=http://localhost:5001
VITE_WS_URL=http://localhost:5001
```

**Check browser console:**

- Open DevTools (F12)
- Look for WebSocket connection messages
- Should see: "✅ Connected to Carbon Intelligence Backend WebSocket"

### WebSocket Not Connecting

**Check CORS in backend:**
Backend should have `CORS_ORIGINS=*` or include `http://localhost:5173`

**Check browser console:**
Look for socket.io connection errors

**Verify backend WebSocket:**

```bash
docker-compose logs carbon_backend | grep -i socket
```

### No Data Showing

**Check API responses:**

```bash
# Test backend directly
curl http://localhost:5001/api/projects?limit=5
curl http://localhost:5001/api/analytics
```

**Check browser Network tab:**

- Open DevTools → Network
- Filter by "Fetch/XHR"
- Look for failed requests

### Hot Reload Not Working

**Restart Vite:**

```bash
# Stop with Ctrl+C
npm run dev
```

**Clear Vite cache:**

```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 📱 Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features Required

- ES2015+ support
- WebSocket support
- Fetch API
- LocalStorage

---

## 🔐 Security Notes

### CORS Configuration

- Backend accepts requests from any origin in development
- Production should restrict to specific domains

### WebSocket Security

- Uses same-origin policy
- No authentication required in development
- Add JWT tokens for production

### LocalStorage

- Watchlist stored in browser localStorage
- Not synced across devices
- Cleared on browser cache clear

---

## 🎯 Performance Tips

### Optimize Bundle Size

```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

### Lazy Loading

Routes are automatically code-split by Vite

### API Caching

- Backend caches JSONL files (10-second TTL)
- Frontend uses React state for session cache
- WebSocket reduces polling

---

## 📦 Production Build

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy

**Static hosting (Vercel, Netlify):**

```bash
# Build
npm run build

# Deploy dist/ folder
```

**Environment variables:**

```env
VITE_API_URL=https://your-backend-domain.com
VITE_WS_URL=wss://your-backend-domain.com
```

---

## 🔗 Related Links

- **Backend Documentation:** `backend/README.md`
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **Socket.IO Client:** https://socket.io/docs/v4/client-api

---

## 📞 Support

**Author:** Daksh Desai  
**Repository:** https://github.com/jilsnshah/interiit-tech-iitgn

---

**Built with ❤️ for InterIIT Tech Competition**
