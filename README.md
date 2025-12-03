# Our Kyzeel - Sustainability Dashboard

A modern, eco-friendly sustainability analytics platform built with React, Tailwind CSS, and Recharts. Track carbon credits, monitor ESG performance, and analyze sustainability metrics for leading companies.

## 🌿 Features

### 1. **Interactive Dashboard**
- **Company Watchlist**: Display top 10 sustainable companies with real-time metrics
- **Live News Feed**: Curated sustainability news with sentiment analysis
- **Performance Sparklines**: Visual trend indicators for each company
- **Responsive Grid Layout**: Optimized for desktop and mobile viewing

### 2. **Detailed Report Pages**
- **Company Analysis**: Deep dive into individual company sustainability performance
- **Carbon Emission Trends**: Interactive line charts showing emissions over time
- **AI-Generated Insights**: Automated performance analysis and future outlook
- **ESG Ratings**: Comprehensive sustainability scoring

### 3. **Carbon Credit Marketplace**
- **Project Integration**: Browse verified carbon credit projects
- **Purchase Interface**: Direct links to buy carbon credits
- **Project Details**: Full information on methodology, location, and impact

### 4. **AI Chat Assistant**
- **Floating Chat Widget**: Always-accessible AI helper
- **Sustainability Queries**: Ask questions about reports and metrics
- **Interactive UI**: Real-time chat interface with message history

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM v7
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Local JSON files (news.json, projects.json, companies.json)

## 📁 Project Structure

```
our-kyzeel/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Global navigation bar
│   │   └── AIBot.jsx            # Floating AI chat widget
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   └── ReportPage.jsx       # Detailed company reports
│   ├── data/
│   │   ├── news.json            # Sustainability news articles
│   │   ├── projects.json        # Carbon credit projects
│   │   └── companies.json       # Company sustainability data
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS imports
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Design Philosophy

- **Eco-Friendly Colors**: Forest greens, natural whites, and earth tones
- **Minimalist UI**: Clean cards with soft shadows and ample whitespace
- **Professional Typography**: Inter font family for readability
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone or navigate to the project**
   ```bash
   cd e:\iitgn_tech\our-kyzeel
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

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚦 Development Status

✅ Dashboard with company watchlist  
✅ Live news feed sidebar  
✅ Detailed report pages with charts  
✅ Carbon credit project integration  
✅ AI chat bot widget  
✅ Responsive navigation  
✅ Routing between pages  

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- **Verra VCS** - Carbon credit methodology standards
- **Gold Standard** - Project verification framework
- **Carbonmark** - Inspiration for project marketplace
- **Bloomberg Green** - News content style reference

## 📞 Support

For questions or issues, please refer to the component documentation in the source files.

---

**Built with 💚 for a sustainable future**
