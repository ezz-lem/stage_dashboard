import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import SearchFilterBar from '../components/SearchFilterBar';
import { useData } from '../context/DataContext';

const Users = () => {
    const navigate = useNavigate();
    const { users, fetchUsers, loadingUsers } = useData();
    const [error, setError] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchUsers();
            } catch (err) {
                setError(err.message || "An error occurred fetching users");
            }
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch =
            (user.first_name || '').toLowerCase().includes(lowerQuery) ||
            (user.last_name || '').toLowerCase().includes(lowerQuery) ||
            (user.email || '').toLowerCase().includes(lowerQuery) ||
            (user.username || '').toLowerCase().includes(lowerQuery);

        const matchesRole = roleFilter ? user.role_name === roleFilter : true;

        // Check exact match for status (1 for Active, 0 for Inactive)
        // Ensure type compatibility by comparing roughly or converting
        const matchesStatus = statusFilter !== ''
            ? user.enabled === parseInt(statusFilter)
            : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            header: "User", key: "fullname", render: (row) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={row.profile_photo_url || `https://ui-avatars.com/api/?name=${row.first_name}+${row.last_name}`} alt="" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{row.first_name} {row.last_name}</div>
                        <div className="text-sm text-gray-500">{row.username}</div>
                    </div>
                </div>
            )
        },
        { header: "Email", key: "email" },
        { header: "Phone", key: "tel" },
        {
            header: "Role", key: "role_name", render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {row.role_name}
                </span>
            )
        },
        {
            header: "Status", key: "enabled", render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.enabled === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {row.enabled === 1 ? 'Active' : 'Inactive'}
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
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">Users</h1>
                            <button
                                onClick={() => fetchUsers(true)}
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
                                placeholder="Search by name, email, or username..."
                                filters={[
                                    {
                                        label: "All Roles",
                                        value: roleFilter,
                                        onChange: setRoleFilter,
                                        options: [
                                            { label: "Admin", value: "admin" }, // Assuming role names are lowercase, adjust if dynamic
                                            { label: "User", value: "user" },
                                            { label: "Manager", value: "manager" }
                                        ]
                                    },
                                    {
                                        label: "All Status",
                                        value: statusFilter,
                                        onChange: setStatusFilter,
                                        options: [
                                            { label: "Active", value: "1" },
                                            { label: "Inactive", value: "0" }
                                        ]
                                    }
                                ]}
                            />
                            <Table
                                columns={columns}
                                data={paginatedUsers}
                                isLoading={loadingUsers}
                                keyField="id"
                                pagination={{
                                    currentPage: currentPage,
                                    totalPages: totalPages,
                                    isLastPage: currentPage >= totalPages
                                }}
                                onPageChange={setCurrentPage}
                                onRowClick={(user) => navigate(`/users/${user.id}`, { state: { user } })}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Users;
