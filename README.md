# Our Kyzeel - Sustainability Dashboard

A modern, AI-powered sustainability analytics platform built with React, Tailwind CSS, and Recharts. Track carbon credits, monitor ESG performance, and analyze sustainability metrics with RAG-powered search.

## 🌿 Features

### 1. **Interactive Dashboard (3-Column Layout)**
- **Left Sidebar**: Kyzeel AI Chat with suggested functions
- **Center**: Company Watchlist with search and filtering
- **Right Sidebar**: Live sustainability news feed with sentiment analysis
- **Dark Theme**: Modern glassmorphism design with emerald accents
- **Independent Scrolling**: Each column scrolls separately

### 2. **RAG-Powered Search**
- **Global Search Bar**: Semantic search across companies, reports, and ESG data
- **Project Search**: Find carbon projects by type, location, or methodology
- **Smart Suggestions**: Real-time dropdown with relevant results
- **Vector Database Ready**: Built for semantic similarity search

### 3. **Detailed Report Pages (Dual-Mode)**
- **Company View**: 
  - Overview with stock price, market cap, ESG ratings
  - 6 interactive data visualizations (carbon emissions, ESG breakdown, energy mix, etc.)
  - "Ask About Company" RAG query interface
  - Future Impact Analysis with AI predictions
- **Project View**:
  - Full project details with images
  - Market data (price, available credits)
  - Direct Carbonmark purchase links

### 4. **Carbon Credit Marketplace**
- **Semantic Search**: Find projects using natural language
- **Category Filters**: Quick filtering by project type
- **Verified Projects**: Integration with Carbonmark.com
- **Two Actions**: View details or buy directly on Carbonmark

### 5. **AI Chat Interfaces**
- **Dashboard Chat**: Persistent sidebar with suggested queries
- **Company Q&A**: Context-aware queries about specific companies
- **Message History**: Track conversation flow

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router DOM v7
- **Charts**: Recharts (Line, Bar, Area, Pie, Radar)
- **Icons**: Lucide React
- **Data**: JSON files (ready for API integration)

## 📁 Project Structure

```
our-kyzeel/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Global nav with RAG search
│   │   ├── DashboardChatSidebar.jsx # Left sidebar chat
│   │   └── AIBot.jsx               # Legacy chat widget
│   ├── pages/
│   │   ├── Dashboard.jsx           # 3-column dashboard
│   │   ├── ReportPage.jsx          # Dual-mode reports (company/project)
│   │   └── ProjectsPage.jsx        # Carbon projects marketplace
│   ├── data/
│   │   ├── companies.json          # Company data
│   │   ├── projects.json           # Carbon project data
│   │   └── news.json               # News articles
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles + animations
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                     # Vercel deployment config
└── package.json
```

## 🎨 Design Philosophy

- **Dark Cyberpunk Theme**: Deep slate backgrounds with emerald/green accents
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Float, glow, and slide-in effects
- **Custom Scrollbars**: Emerald-themed thin scrollbars
- **Responsive Design**: Mobile-first with desktop optimization

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajmodi8905/interiit-tech-iitgn-raj.git
   cd interiit-tech-iitgn-raj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📊 Data Structure

### Companies (companies.json)
```json
{
  "id": "TSLA",
  "name": "Tesla, Inc.",
  "industry": "Automotive & Energy",
  "gii_score": 89,
  "stock_price": 242.84,
  "esg_rating": "A",
  "sustainability_update": "...",
  "description": "..."
}
```

### Projects (projects.json)
```json
{
  "id": "VCS-1234",
  "name": "Rimba Raya Biodiversity Reserve",
  "methodology": "Verra VCS",
  "price": 12.75,
  "available_credits": 284500,
  "category": "Forestry",
  "country": "Indonesia"
}
```

### News (news.json)
```json
{
  "id": "news_001",
  "title": "EU Carbon Price Hits Record High",
  "summary": "...",
  "sentiment": "Positive",
  "author": "Elena Martinez",
  "date": "2025-11-28T09:15:00Z",
  "source": "Bloomberg Green"
}
```

## 🎯 Key Components

### Navbar (`components/Navbar.jsx`)
- Logo with Leaf icon
- Centered search bar
- Navigation links
- Sticky positioning

### Dashboard (`pages/Dashboard.jsx`)
- Company watchlist grid (2 columns)
- News sidebar with sentiment badges
- Click-to-navigate company cards
- Real-time news indicator

### ReportPage (`pages/ReportPage.jsx`)
- Dynamic route: `/report/:id`
- Company header with GII score
- Carbon emissions chart (Recharts)
- AI-generated insights sections
- Integrated carbon credit project
- Market sentiment indicator

### AIBot (`components/AIBot.jsx`)
- Floating action button (bottom-right)
- Chat window with message history
- Send message functionality
- Simulated bot responses

## 🌍 Environment Variables

No environment variables required - all data is local JSON.

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  'forest-green': '#228B22',
  'eco-green': '#2D5016',
  'light-green': '#90EE90',
}
```

### Data
Update JSON files in `src/data/` to change displayed content.

### Routes
Add new routes in `src/App.jsx`:
```javascript
<Route path="/new-page" element={<NewPage />} />
```

## 📱 Responsive Breakpoints

- Mobile: < 1024px (chat sidebar hidden)
- Desktop: ≥ 1024px (full 3-column layout)

## 🚀 Deployment

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "yes" for linking to existing project or create new
   - Your site will be live in seconds!

3. **Share the URL** with your team (e.g., `https://your-project.vercel.app`)

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   "homepage": "https://rajmodi8905.github.io/interiit-tech-iitgn-raj",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Setup (if needed in future)
Create `.env` file:
```env
VITE_API_URL=https://your-backend-api.com
VITE_OPENAI_KEY=your-key-here
```

## 🚦 Development Status

✅ 3-column dashboard with sticky sidebars
✅ RAG-powered global search bar
✅ Semantic project search with suggestions
✅ Dual-mode report pages (company + project)
✅ 6 interactive data visualizations
✅ AI chat interfaces (sidebar + query boxes)
✅ Dark cyberpunk theme with animations
✅ Carbonmark integration for purchases
✅ Full responsive design
✅ Production-ready build

## 🔌 Backend Integration Needed

See detailed backend guide above. Key APIs required:
- `POST /api/search/companies` - RAG search
- `POST /api/search/projects` - Semantic project search
- `POST /api/chat/ask` - Chat responses
- `GET /api/companies/:id/charts` - Chart data
- `GET /api/news` - News feed

## 🤝 Contributing

This project is part of IIT Gandhinagar Tech development.

## 📄 License

MIT License

---

**Built with 💚 for a sustainable future | Deployed on Vercel**
