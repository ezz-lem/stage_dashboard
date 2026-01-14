import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    ArrowLeft, Car, Calendar, FileText, User as UserIcon,
    Activity, CheckCircle, AlertTriangle, Hash
} from 'lucide-react';

const VehicleDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const vehicle = state?.vehicle;

    const handleBack = () => {
        navigate('/vehicles');
    };

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                            <Car className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h3>
                        <p className="text-gray-500 mb-8">
                            We couldn't find the vehicle details you're looking for. Please try navigating properly from the list.
                        </p>
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Vehicles
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
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
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
                {/* Vehicle Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="p-8 sm:flex sm:items-end sm:space-x-8">
                        <div className="relative -mt-16 sm:-mt-24 mb-6 sm:mb-0 flex-shrink-0">
                            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                <Car className="h-16 w-16 text-gray-400" />
                            </div>
                            <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold text-white border-2 border-white ${vehicle.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {vehicle.status.toUpperCase()}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900 truncate">
                                {vehicle.brand} {vehicle.model}
                            </h1>
                            <p className="text-lg text-gray-500 font-medium mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-mono mr-2">
                                    {vehicle.matricule}
                                </span>
                                License Plate
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    <Hash className="w-4 h-4 mr-1.5 text-gray-400" />
                                    VIN: {vehicle.vin}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Key Specs */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </span>
                                Vehicle Details
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 mr-3"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Brand</p>
                                        <p className="text-sm text-gray-900 mt-1">{vehicle.brand}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 mr-3"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Model</p>
                                        <p className="text-sm text-gray-900 mt-1">{vehicle.model}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 mr-3"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <p className="text-sm text-gray-900 mt-1 capitalize">{vehicle.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                                <Car className="h-32 w-32" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Need Maintenance?</h3>
                            <p className="text-indigo-200 text-sm mb-4">Report an issue or schedule maintenance for this vehicle.</p>
                            <button className="w-full py-2 bg-white text-indigo-900 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                                Report Issue
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Assignment & History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-green-100 p-2 rounded-lg mr-3">
                                    <UserIcon className="h-5 w-5 text-green-600" />
                                </span>
                                Current Assignment
                            </h3>

                            {vehicle.driver_fullname ? (
                                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xl mr-4">
                                        {vehicle.driver_fullname.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-gray-900">{vehicle.driver_fullname}</p>
                                        <p className="text-sm text-green-700">Currently assigned driver</p>
                                    </div>
                                    <button className="text-sm text-green-700 font-medium hover:text-green-900 hover:underline">
                                        View Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-gray-500">Unassigned</p>
                                        <p className="text-sm text-gray-400">This vehicle is currently not assigned to any driver.</p>
                                    </div>
                                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
                                        Assign Driver
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                                    Recent Activity
                                </h4>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center text-sm text-gray-500">
                                            <div className="h-2 w-2 rounded-full bg-gray-300 mr-3"></div>
                                            <span className="flex-1">Vehicle check-in completed</span>
                                            <span className="text-xs text-gray-400">{i} days ago</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VehicleDetail;
