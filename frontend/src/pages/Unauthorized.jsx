import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="w-20 h-20 stroke-current text-red-500 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        You do not have permission to view this page. Please contact your
        administrator if you believe this is a mistake.
      </p>
      <Link
        to="/"
        className="mt-8 px-8 py-3 border border-gray-300 dark:border-slate-600 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
