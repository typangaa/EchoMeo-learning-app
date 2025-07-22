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
    <div className="flex flex-col min-h-screen">
      {/* Desktop navbar - hidden on mobile */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      <main className={`flex-grow ${
        isHomePage 
          ? 'px-4 py-4 md:container md:mx-auto md:px-4 md:py-8' 
          : 'container mx-auto px-4 py-8'
      } ${!isHomePage ? 'pb-20 md:pb-8' : ''}`}>
        <Outlet />
      </main>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
      
      {!isHomePage && <Footer />}
      <InstallPrompt />
      <UpdateNotification />
    </div>
  );
};

export default Layout;