
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/provider/auth';

export const Layout = () => {
  const { user } = useAuth();

  return (
    <div>
      {user && (
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center ps-2.5 mb-5">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3 sm:h-7" alt="Flowbite Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">ProjectPulse</span>
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
                </Link>
              </li>
              <li>
                <Link to="/logout" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      )}
      <div className="pl-64"> {/* This padding makes room for the sidebar */}
        <Outlet />
      </div>
    </div>
  );
};
