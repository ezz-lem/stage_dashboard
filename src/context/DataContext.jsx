import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehiclePages, setVehiclePages] = useState({}); // Cache per page: { 1: [...], 2: [...] }
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [lastFetchUsers, setLastFetchUsers] = useState(0);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Persist to sessionStorage
    useEffect(() => {
        const savedUsers = sessionStorage.getItem('cached_users');
        const savedVehicles = sessionStorage.getItem('cached_vehicles');
        const savedTotalVehicles = sessionStorage.getItem('cached_total_vehicles');

        if (savedUsers) {
            const { data, timestamp } = JSON.parse(savedUsers);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setUsers(data);
                setLastFetchUsers(timestamp);
            }
        }

        if (savedVehicles) {
            const { data, timestamp } = JSON.parse(savedVehicles);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setVehiclePages(data);
            }
        }

        if (savedTotalVehicles) {
            setTotalVehicles(parseInt(savedTotalVehicles));
        }
    }, []);

    const fetchUsers = async (force = false) => {
        if (!force && users.length > 0 && (Date.now() - lastFetchUsers < CACHE_DURATION)) {
            return users;
        }

        setLoadingUsers(true);
        try {
            const response = await api.get('/view/allusers');
            if (response.success) {
                const data = response.myusers || [];
                setUsers(data);
                setLastFetchUsers(Date.now());
                sessionStorage.setItem('cached_users', JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
                return data;
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchVehiclesPage = async (page = 1, force = false) => {
        if (!force && vehiclePages[page]) {
            return vehiclePages[page];
        }

        setLoadingVehicles(true);
        try {
            const response = await api.get(`/view/vehicles?page=${page}`);
            if (response.success) {
                const data = response.myvehicles || [];
                const newPages = { ...vehiclePages, [page]: data };
                setVehiclePages(newPages);
                // Simple total count estimation if not provided by API
                // If we get fewer than expected (e.g. 10), we might know total
                // For now, let's just store the pages
                sessionStorage.setItem('cached_vehicles', JSON.stringify({
                    data: newPages,
                    timestamp: Date.now()
                }));
                return data;
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            throw error;
        } finally {
            setLoadingVehicles(false);
        }
    };

    const clearCache = () => {
        sessionStorage.removeItem('cached_users');
        sessionStorage.removeItem('cached_vehicles');
        setUsers([]);
        setVehiclePages({});
        setLastFetchUsers(0);
    };

    const value = {
        users,
        loadingUsers,
        fetchUsers,
        vehiclePages,
        loadingVehicles,
        fetchVehiclesPage,
        clearCache
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
