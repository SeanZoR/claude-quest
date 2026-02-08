import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AchievementPage from './pages/AchievementPage';
import AllAchievements from './pages/AllAchievements';
import Landing from './pages/Landing';
import MemoryList from './pages/MemoryList';
import MemoryPostPage from './pages/MemoryPostPage';
import CookieConsent from './components/CookieConsent';
import { initAnalytics, trackPageView } from './lib/analytics';

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
}

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Memory / Blog */}
        <Route path="/memory" element={<MemoryList />} />
        <Route path="/memory/:slug" element={<MemoryPostPage />} />

        {/* Quest */}
        <Route path="/quest" element={<Dashboard />} />
        <Route path="/quest/achievements" element={<AllAchievements />} />
        <Route path="/quest/achievement/:id" element={<AchievementPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
