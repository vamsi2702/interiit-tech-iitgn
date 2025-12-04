# Our Kyzeel - Sustainability Analytics Platform

AI-powered ESG dashboard with RAG search, carbon credit marketplace, and real-time sustainability metrics.

## 🌿 Features

- **3-Column Dashboard**: AI chat sidebar, company watchlist, live news feed
- **RAG-Powered Search**: Semantic search across companies and carbon projects
- **Dual-Mode Reports**: Company ESG analysis + Carbon project details
- **6 Data Visualizations**: Carbon emissions, ESG scores, energy mix, stock performance
- **Carbon Marketplace**: Semantic project search with Carbonmark integration
- **Dark Cyberpunk UI**: Glassmorphism, animations, responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

## 🎨 Tech Stack

**Frontend**: React 18, Vite, Tailwind CSS  
**Routing**: React Router DOM v7  
**Charts**: Recharts (Line, Bar, Area, Pie, Radar)  
**Icons**: Lucide React  
**Data**: JSON files (ready for API replacement)

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx                   # Global nav with RAG search
│   ├── DashboardChatSidebar.jsx     # Left sidebar AI chat
│   └── AIBot.jsx                    # Chat widget
├── pages/
│   ├── Dashboard.jsx                # 3-column main dashboard
│   ├── ReportPage.jsx               # Company/Project reports
│   └── ProjectsPage.jsx             # Carbon marketplace
├── data/
│   ├── companies.json               # 10 companies with ESG data
│   ├── projects.json                # 7 carbon projects
│   └── news.json                    # 10 sustainability articles
├── App.jsx                          # Routes
└── index.css                        # Custom animations
```

## 🌐 Live Demo

**Production**: https://dist-6j5374n9v-raj-s-projects-33a9f3d9.vercel.app  
**GitHub**: https://github.com/rajmodi8905/interiit-tech-iitgn-raj

## 🔌 Backend Integration

Replace mock data with API calls:

```javascript
// Search API
POST /api/search/companies      // RAG-powered company search
POST /api/search/projects       // Semantic project search

// Data APIs
GET /api/companies/:id          // Company details
GET /api/companies/:id/charts   // Time-series chart data
GET /api/projects/:id           // Project details
GET /api/news                   // Latest news

// AI APIs
POST /api/chat/ask              // Chat/query responses
POST /api/chat/suggest          // Query suggestions
```

**Required**: Vector database (pgvector/Pinecone) for semantic search

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel dist --prod
```

### Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## 📄 License

MIT License - see LICENSE file

---

**Status**: Production Ready ✅  
**Last Updated**: December 2025  
**Contributors**: [@rajmodi8905](https://github.com/rajmodi8905)

## 🤝 Contributing

This project is part of IIT Gandhinagar Tech development.

## 📄 License

MIT License

---

**Built with 💚 for a sustainable future | Deployed on Vercel**
