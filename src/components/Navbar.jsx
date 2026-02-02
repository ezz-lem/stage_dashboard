import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Car, Users, LayoutDashboard, Menu, X, Calendar } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Close menu automatically on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

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
            ? "bg-indigo-50 text-indigo-700 block px-4 py-3 text-base font-semibold border-l-4 border-indigo-500"
            : "text-gray-700 hover:bg-gray-50 block px-4 py-3 text-base font-medium border-l-4 border-transparent";
    };

    return (
        <>
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/dashboard" className="text-xl font-bold text-blue-600">VengoDashboard</Link>
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
                                <Link to="/agenda" className={getLinkClass('/agenda')}>
                                    <Calendar className={`w-4 h-4 mr-2 ${isActive('/agenda') ? 'text-indigo-500' : ''}`} /> Agenda
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
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
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
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 sm:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Sidebar */}
                <div
                    className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="text-2xl font-bold text-blue-600">VengoDashboard</div>
                            <div className="mt-8 flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                    <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <div className="text-sm font-bold text-gray-900 truncate">{user?.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{user?.email || 'Admin'}</div>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 py-6 space-y-2">
                            <Link to="/dashboard" className={getMobileLinkClass('/dashboard')}>
                                <div className="flex items-center">
                                    <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                                </div>
                            </Link>
                            <Link to="/vehicles" className={getMobileLinkClass('/vehicles')}>
                                <div className="flex items-center">
                                    <Car className="w-5 h-5 mr-3" /> Vehicles
                                </div>
                            </Link>
                            <Link to="/users" className={getMobileLinkClass('/users')}>
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-3" /> Users
                                </div>
                            </Link>
                            <Link to="/agenda" className={getMobileLinkClass('/agenda')}>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3" /> Agenda
                                </div>
                            </Link>
                        </nav>

                        <div className="p-4 border-t border-gray-100 mb-6">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
