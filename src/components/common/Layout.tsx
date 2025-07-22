import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { UpdateNotification } from '../pwa/UpdateNotification';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <InstallPrompt />
      <UpdateNotification />
    </div>
  );
};

export default Layout;