import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/provider/auth';
import React from "react";

export const Layout: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex">
            {isAuthenticated && (
                <aside className="fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 text-white transition-transform">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center justify-center p-4">
                                <span className="text-xl font-semibold">ProjectPulse</span>
                            </div>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive('/') ? 'text-[#c080f0]' : 'text-white'} no-underline`}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/tickets" className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive('/tickets') ? 'text-[#c080f0]' : 'text-white'} no-underline`}>
                                        Tickets
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/administration" className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive('/administration') ? 'text-[#c080f0]' : 'text-white'} no-underline`}>
                                        Administration
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 mt-4">
                            <Link to="/logout" className="flex items-center p-2 w-full text-white bg-gray-700 rounded-lg hover:bg-gray-600 no-underline">
                                Logout
                            </Link>
                        </div>
                    </div>
                </aside>
            )}
            <div className={`flex-1 ${isAuthenticated ? 'ml-64' : ''}`}>
                <Outlet />
            </div>
        </div>
    );
};
