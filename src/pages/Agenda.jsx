import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from '../api/apiClient';
import Loader from '../components/Loader';
import { AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import CalendarHeader from '../components/CalendarHeader';
import VehicleRow from '../components/VehicleRow';
import BookingEvent from '../components/BookingEvent';
import BookingTooltip from '../components/BookingTooltip';

import { useData } from '../context/DataContext';

// Status colors configuration
const STATUS_COLORS = {
    confirmed: '#10B981',  // Green
    pending: '#F59E0B',     // Amber
    maintenance: '#6B7280', // Gray
    cancelled: '#EF4444',   // Red
};

const Agenda = () => {
    const { vehicles, fetchVehicles } = useData(); // Use global vehicle data
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true); // Only track booking loading
    const [error, setError] = useState(null);

    // Filter, Search State
    const [searchTerm, setSearchTerm] = useState('');

    // Booking Pagination & Filter State
    const [bookingPage, setBookingPage] = useState(1);
    const [totalBookingPages, setTotalBookingPages] = useState(1);
    const [selectedBookingStatus, setSelectedBookingStatus] = useState('all');

    // Tooltip State
    const [tooltipEvent, setTooltipEvent] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });


    useEffect(() => {
        // Reset booking page to 1 when status filter changes
        setBookingPage(1);
    }, [selectedBookingStatus]);

    // Fetch bookings whenever bookingPage or selectedBookingStatus changes
    useEffect(() => {
        const loadBookings = async () => {
            setLoadingBookings(true);
            setError(null);
            try {
                // 1. Refresh Vehicles (background, mostly constant)
                fetchVehicles();

                // 2. Fetch Bookings with pagination and optional status filter
                const requestBody = {
                    table: "vehiclesbookings",
                    select: ["id", "start", "end", "vehicle_id", "status", "vehicle_fullname"],
                    batch: bookingPage,
                    batch_size: 20
                };

                // Add status filter if not 'all'
                if (selectedBookingStatus !== 'all') {
                    requestBody.where = {
                        status: selectedBookingStatus
                    };
                }

                const bookingsRes = await api.post('/select/universal', requestBody);

                // The API returns data in 'records' field
                const bookingsData = bookingsRes.success ? (bookingsRes.records || []) : [];

                // Calculate total pages from API response
                const totalItems = bookingsRes.total_items || bookingsData.length;
                const calculatedPages = Math.ceil(totalItems / 20);
                setTotalBookingPages(calculatedPages);

                // Filter valid statuses
                const filteredBookings = bookingsData.filter(b =>
                    ['confirmed', 'pending', 'cancelled', 'maintenance'].includes(b.status.toLowerCase())
                );

                setBookings(filteredBookings);
            } catch (err) {
                console.error("Error loading agenda data:", err);
                const errorMessage = err.response?.data?.message
                    || err.response?.data?.error
                    || "Failed to load agenda data. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoadingBookings(false);
            }
        };

        loadBookings();
    }, [bookingPage, selectedBookingStatus]);

    // Build vehicle resources based on current bookings only
    const { resources, totalPages } = useMemo(() => {
        const vehicleMap = new Map();
        const vehicleOrder = [];

        bookings.forEach(b => {
            const vId = String(b.vehicle_id);
            if (!vehicleMap.has(vId)) {
                const fullVehicle = vehicles.find(v => String(v.id) === vId);

                // Track original vehicle_id but use index for sorting ID
                const indexId = String(vehicleOrder.length).padStart(4, '0');

                const vehicleInfo = {
                    id: indexId, // FORCED ORDER ID (0000, 0001...)
                    original_id: vId,
                    title: b.vehicle_fullname || (fullVehicle ? `${fullVehicle.brand} ${fullVehicle.model} (${fullVehicle.matricule})` : `Vehicle #${vId}`)
                };

                vehicleMap.set(vId, vehicleInfo);
                vehicleOrder.push(vehicleInfo);
            }
        });

        let result = vehicleOrder;

        // Apply Search Filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(v =>
                v.title.toLowerCase().includes(lowerSearch)
            );
        }

        return { resources: result, totalPages: totalBookingPages };
    }, [vehicles, bookings, searchTerm, totalBookingPages]);

    // Map filtered bookings to FullCalendar events
    const events = useMemo(() => {
        const getDuration = (start, end) => {
            if (!start || !end) return '';
            const diff = new Date(end) - new Date(start);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (days > 0) return `${days}d ${hours > 0 ? ` ${hours}h` : ''}`;
            return `${hours}h`;
        };

        // Filtered Bookings for the calendar
        const currentFiltered = selectedBookingStatus === 'all'
            ? bookings
            : bookings.filter(b => b.status && b.status.toLowerCase() === selectedBookingStatus.toLowerCase());

        return currentFiltered.map(b => {
            const vId = String(b.vehicle_id);

            // WE MUST FIND THE SYNCED ID (e.g. "0000") for this booking
            const resource = resources.find(r => r.original_id === vId);
            const resourceId = resource ? resource.id : vId;

            const vehicleName = resource ? resource.title : (b.vehicle_fullname || `Vehicle #${vId}`);

            return {
                id: `booking-${b.id}`,
                resourceId: resourceId,
                start: b.start,
                end: b.end,
                title: `${b.status}`,
                backgroundColor: STATUS_COLORS[b.status?.toLowerCase()] || '#3B82F6',
                borderColor: 'transparent',
                extendedProps: {
                    status: b.status,
                    vehicle_id: b.vehicle_id,
                    vehicle_fullname: vehicleName,
                    duration_human: getDuration(b.start, b.end)
                }
            };
        });
    }, [bookings, selectedBookingStatus, resources]);

    if (loadingBookings && bookings.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader size={40} />
                    <p className="mt-4 text-gray-500 font-medium">Loading agenda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 p-8">
                    <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-xl border border-red-100 flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="text-red-800 font-bold text-lg">Error</h3>
                            <p className="text-red-600 mt-1">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                <CalendarHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedBookingStatus={selectedBookingStatus}
                    onBookingStatusChange={setSelectedBookingStatus}
                    bookingPage={bookingPage}
                    totalBookingPages={totalBookingPages}
                    onBookingPageChange={setBookingPage}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Subtle Loading Overlay */}
                    {loadingBookings && bookings.length > 0 && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all duration-300">
                            <div className="bg-white/80 px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-3">
                                <Loader size={20} />
                                <span className="text-sm font-semibold text-gray-700">Updating batch...</span>
                            </div>
                        </div>
                    )}

                    <div className="calendar-container relative">
                        <FullCalendar
                            plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin]}
                            initialView="resourceTimelineMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay'
                            }}
                            resourceAreaHeaderContent="Vehicles"
                            resources={resources}
                            resourceOrder="id" // Force sorting by our zero-padded index IDs (0000, 0001...)
                            events={events}
                            height="auto"
                            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                            eventContent={(eventInfo) => <BookingEvent eventInfo={eventInfo} />}
                            resourceLabelContent={(resourceInfo) => <VehicleRow resourceInfo={resourceInfo} />}

                            // Updated Tooltip Logic
                            eventMouseEnter={(info) => {
                                const rect = info.el.getBoundingClientRect();
                                setTooltipPos({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top
                                });
                                setTooltipEvent(info.event);
                            }}
                            eventMouseLeave={() => {
                                setTooltipEvent(null);
                            }}
                        />

                        {/* Render Floating Tooltip */}
                        {tooltipEvent && (
                            <BookingTooltip
                                event={tooltipEvent}
                                position={tooltipPos}
                            />
                        )}
                    </div>
                </div>

                <style>{`
                    .fc {
                        --fc-border-color: #f3f4f6;
                        --fc-today-bg-color: #f0f7ff;
                        font-family: inherit;
                    }
                    .fc .fc-timeline-slot-today,
                    .fc .fc-day-today {
                        background-color: #f0f9ff !important;
                    }
                    .fc .fc-toolbar-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #111827;
                    }
                    .fc .fc-button-primary {
                        background-color: white;
                        border-color: #e5e7eb;
                        color: #374151;
                        font-weight: 500;
                        text-transform: capitalize;
                    }
                    .fc .fc-button-primary:hover {
                        background-color: #f9fafb;
                        border-color: #d1d5db;
                        color: #111827;
                    }
                    .fc .fc-button-primary:not(:disabled).fc-button-active, 
                    .fc .fc-button-primary:not(:disabled):active {
                        background-color: #eff6ff;
                        border-color: #3b82f6;
                        color: #2563eb;
                    }
                    .fc-timeline-header-row {
                        background-color: #f9fafb;
                    }
                    .fc-resource-area-header-cell {
                        font-weight: 700;
                        color: #374151;
                        padding: 10px !important;
                    }
                    .fc-datagrid-cell-cushion {
                        padding: 12px !important;
                        font-weight: 500;
                    }
                    .fc-timeline-event {
                        border-radius: 6px;
                        padding: 2px 0;
                        margin: 2px 0;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Agenda;
