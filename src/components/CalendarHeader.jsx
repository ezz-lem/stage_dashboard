import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarHeader = () => {
    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" /> Vehicle Agenda
                </h1>
                <p className="text-gray-500 mt-1">Manage and track vehicle bookings across your fleet.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                    <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Confirmed
                    </span>
                    <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span> Pending
                    </span>
                    <span className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Cancelled
                    </span>
                </div>

                {/* View Switcher Placeholder */}
                <div className="hidden lg:flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-blue-600">Month</button>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-gray-500 hover:text-gray-700">Week</button>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-gray-500 hover:text-gray-700">Day</button>
                </div>
            </div>
        </div>
    );
};

export default CalendarHeader;
