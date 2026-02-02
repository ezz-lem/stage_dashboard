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

const Agenda = () => {
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch Vehicles for mapping (resources)
                const vehiclesRes = await api.get('/get/allvehicles01');
                console.log("Agenda Vehicles Response:", vehiclesRes); // Debug log for user

                let vehiclesData = [];
                if (Array.isArray(vehiclesRes)) {
                    vehiclesData = vehiclesRes;
                } else if (Array.isArray(vehiclesRes.myvehicles)) {
                    vehiclesData = vehiclesRes.myvehicles;
                } else if (Array.isArray(vehiclesRes.data)) {
                    vehiclesData = vehiclesRes.data;
                } else if (Array.isArray(vehiclesRes.records)) {
                    vehiclesData = vehiclesRes.records;
                }

                setVehicles(vehiclesData);

                // 2. Fetch Bookings (events)
                const bookingsRes = await api.post('/select/universal', {
                    table: "vehiclesbookings",
                    select: ["id", "start", "end", "vehicle_id", "status"],
                    batch: 1,
                    batch_size: 1000 // Fetch all items (total is ~600)
                });

                // The API returns data in 'records' field based on user example
                const bookingsData = bookingsRes.success ? (bookingsRes.records || []) : [];

                // Filter statuses: confirmed, pending, cancelled, maintenance
                const filteredBookings = bookingsData.filter(b =>
                    ['confirmed', 'pending', 'cancelled', 'maintenance'].includes(b.status.toLowerCase())
                );

                setBookings(filteredBookings);
            } catch (err) {
                console.error("Error loading agenda data:", err);
                setError("Failed to load agenda data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Combine fetched vehicles with any missing vehicles found in bookings
    const combinedVehicles = useMemo(() => {
        const vehicleMap = new Map();

        // 1. Add fetched vehicles
        vehicles.forEach(v => {
            vehicleMap.set(String(v.id), {
                id: String(v.id),
                title: `${v.brand} ${v.model} (${v.matricule})`
            });
        });

        // 2. Add vehicles from bookings if missing
        bookings.forEach(b => {
            const vId = String(b.vehicle_id);
            if (!vehicleMap.has(vId)) {
                // If detailed info is missing, use fullname or fallback
                vehicleMap.set(vId, {
                    id: vId,
                    title: b.vehicle_fullname || `Vehicle #${vId}`
                });
            }
        });

        return Array.from(vehicleMap.values());
    }, [vehicles, bookings]);

    // Map combined vehicles to FullCalendar resources
    const resources = useMemo(() => {
        return combinedVehicles;
    }, [combinedVehicles]);

    // Map bookings to FullCalendar events
    const events = useMemo(() => {
        return bookings.map(b => ({
            id: String(b.id),
            resourceId: String(b.vehicle_id),
            start: b.start,
            end: b.end,
            title: `${b.status}`,
            backgroundColor: b.status.toLowerCase() === 'confirmed' ? '#10B981' :
                b.status.toLowerCase() === 'pending' ? '#F59E0B' :
                    b.status.toLowerCase() === 'maintenance' ? '#6B7280' : '#EF4444',
            borderColor: 'transparent',
            extendedProps: {
                status: b.status,
                vehicle_id: b.vehicle_id
            }
        }));
    }, [bookings]);

    if (loading) {
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
                <CalendarHeader />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="calendar-container">
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
                            events={events}
                            height="auto"
                            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                            eventContent={(eventInfo) => <BookingEvent eventInfo={eventInfo} />}
                            resourceLabelContent={(resourceInfo) => <VehicleRow resourceInfo={resourceInfo} />}
                            eventMouseEnter={(info) => {
                                // Simple tooltip
                                info.el.title = `Status: ${info.event.extendedProps.status}\nStarts: ${new Date(info.event.start).toLocaleString()}\nEnds: ${new Date(info.event.end).toLocaleString()}`;
                            }}
                        />
                    </div>
                </div>

                <style>{`
                    .fc {
                        --fc-border-color: #f3f4f6;
                        --fc-today-bg-color: #eff6ff;
                        font-family: inherit;
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
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Agenda;
