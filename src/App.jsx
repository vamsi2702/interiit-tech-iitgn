import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import ProjectsPage from './pages/ProjectsPage';
import './index.css';

export const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = React.useState('dark'); // 'dark' or 'light'

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className={`h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-50' : 'bg-white'} flex flex-col`}>
          <Navbar />
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
