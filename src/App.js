import './App.css';
import { useState, useEffect } from 'react';
import EventTabs from './components/EventTabs';
import PlannerPage from './pages/PlannerPage';
import CapitalClashPlanner from './pages/CapitalClashPlanner';
import AvABusterPlanner from './pages/AvABusterPlanner';
import WorldWatch from './pages/WorldWatch';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [activeTab, setActiveTab] = useState('canyon-clash');
  const [currentPage, setCurrentPage] = useState('planner');
  const [pendingPlanToLoad, setPendingPlanToLoad] = useState(null);

  // Check if there's a pending plan to load from admin page
  useEffect(() => {
    const pending = localStorage.getItem('pendingPlanToLoad');
    if (pending) {
      try {
        setPendingPlanToLoad(JSON.parse(pending));
        localStorage.removeItem('pendingPlanToLoad');
      } catch (error) {
        console.error('Error loading pending plan:', error);
      }
    }
  }, []);

  const handleNavigateToAdmin = () => {
    setCurrentPage('admin');
  };

  const handleNavigateToPlan = (plan) => {
    setPendingPlanToLoad(plan);
    setCurrentPage('planner');
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleNavigateToPlannerFromAbout = () => {
    setCurrentPage('planner');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage('planner');
  };

  const renderContent = () => {
    // Navigation pages
    if (currentPage === 'admin') {
      return <AdminPage onNavigateToPlan={handleNavigateToPlan} />;
    }
    if (currentPage === 'about') {
      return <AboutPage onNavigateToPlanner={handleNavigateToPlannerFromAbout} />;
    }

    // Tab content
    switch (activeTab) {
      case 'canyon-clash':
        return (
          <PlannerPage 
            onAdminClick={handleNavigateToAdmin}
            onAboutClick={handleNavigateToAbout}
            pendingPlan={pendingPlanToLoad}
            onPlanLoaded={() => setPendingPlanToLoad(null)}
          />
        );
      case 'capital-clash':
        return <CapitalClashPlanner onAdminClick={handleNavigateToAdmin} onAboutClick={handleNavigateToAbout} />;
      case 'ava-buster':
        return <AvABusterPlanner onAdminClick={handleNavigateToAdmin} onAboutClick={handleNavigateToAbout} />;
      case 'world-watch':
        return <WorldWatch onAdminClick={handleNavigateToAdmin} onAboutClick={handleNavigateToAbout} />;
      default:
        return <PlannerPage onAdminClick={handleNavigateToAdmin} onAboutClick={handleNavigateToAbout} />;
    }
  };

  return (
    <div className="App">
      {currentPage === 'planner' && <EventTabs activeTab={activeTab} onTabChange={handleTabChange} />}
      {renderContent()}
    </div>
  );
}

export default App;
