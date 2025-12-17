import './App.css';
import { useState, useEffect } from 'react';
import PlannerPage from './pages/PlannerPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

function App() {
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

  return (
    <div className="App">
      {currentPage === 'planner' ? (
        <PlannerPage 
          onAdminClick={handleNavigateToAdmin}
          onAboutClick={handleNavigateToAbout}
          pendingPlan={pendingPlanToLoad}
          onPlanLoaded={() => setPendingPlanToLoad(null)}
        />
      ) : currentPage === 'admin' ? (
        <AdminPage onNavigateToPlan={handleNavigateToPlan} />
      ) : (
        <AboutPage onNavigateToPlanner={handleNavigateToPlannerFromAbout} />
      )}
    </div>
  );
}

export default App;
