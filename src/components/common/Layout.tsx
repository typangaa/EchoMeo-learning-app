import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { UpdateNotification } from '../pwa/UpdateNotification';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="h-screen flex flex-col md:min-h-screen md:h-auto">
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