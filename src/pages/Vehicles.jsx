import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import SearchFilterBar from '../components/SearchFilterBar';
import Loader from '../components/Loader';
import { useData } from '../context/DataContext';

const Vehicles = () => {
    const navigate = useNavigate();
    const { vehiclePages, fetchVehiclesPage, loadingVehicles } = useData();
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    // Get current page list from context
    const vehicles = vehiclePages[page] || [];

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchVehiclesPage(page);
            } catch (err) {
                setError(err.message || "An error occurred fetching vehicles");
            }
        };
        loadData();
    }, [page]);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Filter Logic
    const filteredVehicles = vehicles.filter(vehicle => {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch =
            (vehicle.brand || '').toLowerCase().includes(lowerQuery) ||
            (vehicle.model || '').toLowerCase().includes(lowerQuery) ||
            (vehicle.matricule || '').toLowerCase().includes(lowerQuery) ||
            (vehicle.vin || '').toLowerCase().includes(lowerQuery) ||
            (vehicle.driver_fullname || '').toLowerCase().includes(lowerQuery);

        const matchesStatus = statusFilter ? vehicle.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    const columns = [
        { header: "Brand", key: "brand", className: "font-semibold text-gray-900" },
        { header: "Model", key: "model" },
        {
            header: "Matricule", key: "matricule", render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {row.matricule}
                </span>
            )
        },
        { header: "VIN", key: "vin", className: "text-xs font-mono" },
        { header: "Driver", key: "driver_fullname" },
        {
            header: "Status", key: "status", render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {row.status || 'Unknown'}
                </span>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">Vehicles</h1>
                            <button
                                onClick={() => fetchVehiclesPage(page, true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 mb-4 mx-4 sm:mx-0">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-4 sm:px-0">
                            <SearchFilterBar
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                placeholder="Search by brand, model, plate..."
                                filters={[
                                    {
                                        label: "All Status",
                                        value: statusFilter,
                                        onChange: setStatusFilter,
                                        options: [
                                            { label: "Available", value: "available" },
                                            { label: "Sold", value: "sold" }, // Example statuses, adjust as needed
                                            { label: "Maintenance", value: "maintenance" }
                                        ]
                                    }
                                ]}
                            />
                            <Table
                                columns={columns}
                                data={filteredVehicles}
                                isLoading={loadingVehicles}
                                keyField="id"
                                pagination={{
                                    currentPage: page,
                                    isLastPage: vehicles.length < 10
                                }}
                                onPageChange={setPage}
                                onRowClick={(vehicle) => navigate(`/vehicles/${vehicle.id}`, { state: { vehicle } })}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Vehicles;
