import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { UpdateNotification } from '../pwa/UpdateNotification';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide navbar on homepage for mobile devices */}
      {!isHomePage && <Navbar />}
      {isHomePage && (
        <div className="hidden md:block">
          <Navbar />
        </div>
      )}
      
      <main className={`flex-grow ${
        isHomePage 
          ? 'px-4 py-4 md:container md:mx-auto md:px-4 md:py-8' 
          : 'container mx-auto px-4 py-8'
      }`}>
        <Outlet />
      </main>
      
      {!isHomePage && <Footer />}
      <InstallPrompt />
      <UpdateNotification />
    </div>
  );
};

export default Layout;