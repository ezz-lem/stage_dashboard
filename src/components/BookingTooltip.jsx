import React from 'react';
import { Clock, Calendar, Info, Car } from 'lucide-react';

const BookingTooltip = ({ event, position }) => {
    if (!event) return null;

    const { extendedProps, start, end } = event;
    const { status, vehicle_fullname, duration_human } = extendedProps;

    // Format badge color based on status
    const getStatusColor = (s) => {
        const lower = s?.toLowerCase() || '';
        if (lower === 'confirmed') return 'bg-green-100 text-green-800 border-green-200';
        if (lower === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (lower === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
        if (lower === 'maintenance') return 'bg-gray-100 text-gray-800 border-gray-200';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    return (
        <div
            className="fixed z-50 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 pointer-events-none transition-opacity duration-200"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%) translateY(-10px)' // Center above cursor with offset
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                        <Car className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                            {vehicle_fullname || 'Vehicle'}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2.5 text-gray-400" />
                    <span className="font-medium">
                        {start?.toLocaleDateString()}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2.5 text-gray-400" />
                    <div>
                        <div className="flex items-center">
                            <span>{start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mx-1.5 text-gray-300">→</span>
                            <span>{end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {duration_human && (
                            <p className="text-xs text-gray-400 mt-0.5">Duration: {duration_human}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end text-xs text-gray-400">
                <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Detailed view
                </span>
            </div>

            {/* Arrow/Tail */}
            <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-100 shadow-sm"
            ></div>
        </div>
    );
};

export default BookingTooltip;
