import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-slate-800">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
