import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Car, Users, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path) => {
        return isActive(path)
            ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    };

    const getMobileLinkClass = (path) => {
        return isActive(path)
            ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium";
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">VengoDashboard</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                                <LayoutDashboard className={`w-4 h-4 mr-2 ${isActive('/dashboard') ? 'text-indigo-500' : ''}`} /> Dashboard
                            </Link>
                            <Link to="/vehicles" className={getLinkClass('/vehicles')}>
                                <Car className={`w-4 h-4 mr-2 ${isActive('/vehicles') ? 'text-indigo-500' : ''}`} /> Vehicles
                            </Link>
                            <Link to="/users" className={getLinkClass('/users')}>
                                <Users className={`w-4 h-4 mr-2 ${isActive('/users') ? 'text-indigo-500' : ''}`} /> Users
                            </Link>
                        </div>
                    </div>

                    {/* Desktop profile and logout */}
                    <div className="hidden sm:flex sm:items-center">
                        <span className="text-gray-700 text-sm mr-4 font-medium">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/dashboard"
                        className={getMobileLinkClass('/dashboard')}
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                        </div>
                    </Link>
                    <Link
                        to="/vehicles"
                        className={getMobileLinkClass('/vehicles')}
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center">
                            <Car className="w-4 h-4 mr-2" /> Vehicles
                        </div>
                    </Link>
                    <Link
                        to="/users"
                        className={getMobileLinkClass('/users')}
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" /> Users
                        </div>
                    </Link>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-500" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user?.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user?.email || 'User'}</div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1">
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                            <div className="flex items-center text-red-600">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

