import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;