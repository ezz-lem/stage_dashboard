import { Calendar as CalendarIcon, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarHeader = ({
    searchTerm,
    onSearchChange,
    selectedBookingStatus,
    onBookingStatusChange,
    bookingPage,
    totalBookingPages,
    onBookingPageChange
}) => {
    const statuses = [
        {
            label: 'Confirmed',
            id: 'confirmed',
            activeClass: 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200',
            inactiveClass: 'bg-green-50 text-green-700 border-green-100 hover:border-green-200',
            dotClass: 'bg-green-500'
        },
        {
            label: 'Pending',
            id: 'pending',
            activeClass: 'bg-yellow-600 text-white border-yellow-600 shadow-sm shadow-yellow-200',
            inactiveClass: 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:border-yellow-200',
            dotClass: 'bg-yellow-500'
        },
        {
            label: 'Maintenance',
            id: 'maintenance',
            activeClass: 'bg-gray-600 text-white border-gray-600 shadow-sm shadow-gray-200',
            inactiveClass: 'bg-gray-50 text-gray-700 border-gray-100 hover:border-gray-200',
            dotClass: 'bg-gray-500'
        },
        {
            label: 'Cancelled',
            id: 'cancelled',
            activeClass: 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-200',
            inactiveClass: 'bg-red-50 text-red-700 border-red-100 hover:border-red-200',
            dotClass: 'bg-red-500'
        },
    ];

    return (
        <div className="mb-6 flex flex-col space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" /> Vehicle Agenda
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and track vehicle bookings across your fleet.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search vehicle name..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Filter & Booking Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => onBookingStatusChange('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedBookingStatus === 'all'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        All Statuses
                    </button>
                    {statuses.map((status) => (
                        <button
                            key={status.id}
                            onClick={() => onBookingStatusChange(status.id)}
                            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedBookingStatus === status.id
                                    ? status.activeClass
                                    : status.inactiveClass
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full mr-2 ${selectedBookingStatus === status.id ? 'bg-white' : status.dotClass
                                }`}></span>
                            {status.label}
                        </button>
                    ))}
                </div>

                {/* Booking Pagination Controls */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-1 py-1 shadow-sm">
                    <button
                        onClick={() => onBookingPageChange(bookingPage - 1)}
                        disabled={bookingPage === 1}
                        className="p-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Previous Booking Page"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-700 min-w-[100px] text-center">
                        Bookings {bookingPage}/{totalBookingPages || 1}
                    </span>
                    <button
                        onClick={() => onBookingPageChange(bookingPage + 1)}
                        disabled={bookingPage === totalBookingPages || totalBookingPages === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Next Booking Page"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarHeader;
