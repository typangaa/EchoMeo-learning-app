import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component that handles first-visit detection and redirects new users to the welcome page
 */
const FirstVisitHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('visited');
    const isOnWelcomePage = location.pathname === '/welcome';
    const isOnHomePage = location.pathname === '/';

    // If user hasn't visited and is on home page, redirect to welcome
    if (!hasVisited && isOnHomePage) {
      navigate('/welcome', { replace: true });
    }

    // If user has visited and is on welcome page, redirect to home
    if (hasVisited && isOnWelcomePage) {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default FirstVisitHandler;