import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    ArrowLeft, Mail, Phone, Calendar, Shield, User,
    CheckCircle, XCircle, MapPin, Briefcase
} from 'lucide-react';

const UserDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const user = state?.user;

    const handleBack = () => {
        navigate('/users');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <User className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h3>
                        <p className="text-gray-500 mb-8">
                            We couldn't find the user details you're looking for. Please try navigating properly from the list.
                        </p>
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Users
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <button
                        onClick={handleBack}
                        className="group flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all absolute top-6 left-4 sm:left-8"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12 relative z-10">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="p-8 sm:flex sm:items-end sm:space-x-8">
                        <div className="relative -mt-16 sm:-mt-24 mb-6 sm:mb-0">
                            <img
                                className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl ring-4 ring-white shadow-lg object-cover bg-white"
                                src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&size=256`}
                                alt=""
                            />
                            <div className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white ${user.enabled === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900 truncate">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-lg text-gray-500 font-medium mb-4 flex items-center">
                                @{user.username}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                    <Shield className="w-4 h-4 mr-1.5" />
                                    {user.role_name}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${user.enabled === 1
                                    ? 'bg-green-50 text-green-700 border-green-100'
                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                    {user.enabled === 1
                                        ? <><CheckCircle className="w-4 h-4 mr-1.5" /> Active Account</>
                                        : <><XCircle className="w-4 h-4 mr-1.5" /> Inactive Account</>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <User className="h-5 w-5 text-indigo-600" />
                                </span>
                                Contact Information
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <p className="text-sm text-gray-900 mt-1">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                        <p className="text-sm text-gray-900 mt-1">{user.tel}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Joined</p>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats/Activity (Placeholder for future) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                </span>
                                Performance & Activity
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <p className="text-sm font-medium text-gray-500">Total Rides</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                                    <p className="text-xs text-green-600 mt-2 flex items-center">
                                        <span className="bg-green-100 rounded-full px-1.5 py-0.5 mr-1">+0%</span> this month
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <p className="text-sm font-medium text-gray-500">Rating</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">5.0</p>
                                    <p className="text-xs text-gray-500 mt-2">Average from 0 reviews</p>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Notes</h4>
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-sm">No recent activity recorded for this user.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDetail;
