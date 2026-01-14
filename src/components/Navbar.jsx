import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Car, Users, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
                    <div className="flex items-center">
                        <span className="text-gray-700 text-sm mr-4 font-medium">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
