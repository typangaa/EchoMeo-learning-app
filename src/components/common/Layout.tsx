import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { UpdateNotification } from '../pwa/UpdateNotification';
import { initMobileViewportFix } from '../../utils/mobileViewport';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Initialize mobile viewport fix for iOS Safari/Chrome
  useEffect(() => {
    initMobileViewportFix();
  }, []);
  
  return (
    <div className="h-screen-mobile md:h-auto md:min-h-screen flex flex-col">
      {/* Desktop navbar - hidden on mobile */}
      <div className="hidden md:block flex-shrink-0">
        <Navbar />
      </div>
      
      {/* Main content area - takes remaining space on mobile */}
      <main className={`flex-1 min-h-0 overflow-y-auto ${
        isHomePage 
          ? 'px-4 py-4 md:container md:mx-auto md:px-4 md:py-8' 
          : 'container mx-auto px-4 py-8'
      }`}>
        <Outlet />
      </main>
      
      {/* Mobile bottom navigation - always at bottom */}
      <div className="flex-shrink-0">
        <MobileBottomNav />
      </div>
      
      {!isHomePage && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      <InstallPrompt />
      <UpdateNotification />
    </div>
  );
};

export default Layout;