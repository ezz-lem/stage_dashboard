import { useState, useEffect } from 'react';
import {
    Users,
    Car,
    UserPlus,
    AlertCircle,
    User,
    Truck,
    AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import {
    UsersGrowthChart,
    VehiclesTypeChart
} from '../components/DashboardCharts';
import { useData } from '../context/DataContext';

const Dashboard = () => {
    const { users, vehicles, fetchUsers, fetchVehicles, loadingUsers, loadingVehicles } = useData();
    const [recentUsers, setRecentUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [chartsData, setChartsData] = useState({
        userGrowth: null,
        vehicleBrands: null
    });

    const isLoading = loadingUsers || loadingVehicles;

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [allUsers, allVehicles] = await Promise.all([
                    fetchUsers(),
                    fetchVehicles()
                ]);
                processData(allUsers, allVehicles);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        loadAllData();
    }, []);

    const processData = (users, vehicles) => {
        // --- Calculations ---

        // 1. Stats Cards
        const totalUsers = users.length;
        const activeVehicles = vehicles.filter(v => v.status === 'available').length;

        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const newUsers = users.filter(u => new Date(u.created_at) > oneMonthAgo).length;
        const inactiveVehicles = vehicles.filter(v => v.status !== 'available').length;
        const totalVehicles = vehicles.length;
        const regularUsers = users.filter(u => (u.role_name || '').toLowerCase() !== 'admin').length;

        // Active Drivers: Unique drivers assigned to vehicles
        const uniqueDrivers = new Set(vehicles.map(v => v.driver_fullname).filter(Boolean));
        const activeDrivers = uniqueDrivers.size;

        // Get top 5 recent users
        const sortedUsers = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        setRecentUsers(sortedUsers);

        setStats([
            { title: "Total Users", value: totalUsers, icon: Users, color: "blue", trend: { value: 0, label: "total", direction: "neutral" } },
            { title: "Active Vehicles", value: activeVehicles, icon: Car, color: "green", trend: { value: Math.round((activeVehicles / totalVehicles) * 100) || 0, label: "% of fleet", direction: "neutral" } },
            { title: "New Users (30d)", value: newUsers, icon: UserPlus, color: "purple", trend: { value: newUsers, label: "this month", direction: "up" } },
            { title: "Inactive Vehicles", value: inactiveVehicles, icon: AlertCircle, color: "red", trend: { value: Math.round((inactiveVehicles / totalVehicles) * 100) || 0, label: "% of fleet", direction: "down" } },
            { title: "Pending Alerts", value: "0", icon: AlertTriangle, color: "yellow", trend: { value: 0, label: "simulated", direction: "neutral" } },
            { title: "Total Vehicles", value: totalVehicles, icon: Truck, color: "indigo", trend: { value: 0, label: "tracked", direction: "neutral" } },
            { title: "Active Drivers", value: activeDrivers, icon: User, color: "indigo", trend: { value: 0, label: "assigned", direction: "neutral" } },
            { title: "Regular Users", value: regularUsers, icon: User, color: "orange", trend: { value: 0, label: "clients", direction: "neutral" } },
        ]);

        // 2. Charts Data

        // Users Growth (Group by Month for last 6 months)
        const monthCounts = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        users.forEach(u => {
            const d = new Date(u.created_at);
            const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
            monthCounts[key] = (monthCounts[key] || 0) + 1;
        });

        const chartLabels = [];
        const chartValues = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
            chartLabels.push(key);
            chartValues.push(monthCounts[key] || 0);
        }

        const userGrowthData = {
            labels: chartLabels,
            datasets: [{
                label: 'New Users',
                data: chartValues,
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            }]
        };

        // Vehicles by Brand (Top 5)
        const brandCounts = {};
        vehicles.forEach(v => {
            const brand = v.brand || 'Unknown';
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });
        const sortedBrands = Object.entries(brandCounts)
            .sort((a, b) => b[1] - a[0])
            .slice(0, 5);

        const vehicleBrandData = {
            labels: sortedBrands.map(b => b[0]),
            datasets: [{
                label: 'Number of Vehicles',
                data: sortedBrands.map(b => b[1]),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4,
            }]
        };

        setChartsData({
            userGrowth: userGrowthData,
            vehicleBrands: vehicleBrandData
        });
    };

    if ((loadingUsers || loadingVehicles) && users.length === 0 && vehicles.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard Overview</h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <StatsCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                                <UsersGrowthChart data={chartsData.userGrowth} />
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                                <VehiclesTypeChart data={chartsData.vehicleBrands} />
                                <p className="text-center text-sm text-gray-500 mt-2">Vehicles by Brand</p>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 mb-8">
                            {/* Recent Users Widget */}
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 overflow-hidden">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Registrations</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                                {user.first_name?.[0]}{user.last_name?.[0]}
                                                            </div>
                                                            <div className="ml-3 text-sm font-medium text-gray-900">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                            {user.role_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {recentUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-500">
                                                        No recent users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
