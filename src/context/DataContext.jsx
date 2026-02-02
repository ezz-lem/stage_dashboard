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
        // If we have cached users, return them immediately but still fetch in the background
        if (!force && users.length > 0) {
            // Trigger background fetch if it's been more than a short while or if force is false but we just want fresh data
            // To prevent too many background calls, we check CACHE_DURATION
            if (Date.now() - lastFetchUsers > CACHE_DURATION / 5) { // Refresh if more than 1 minute old
                performFetchUsers();
            }
            return users;
        }

        return await performFetchUsers();
    };

    const performFetchUsers = async () => {
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
            // Don't throw if we already have data (background refresh failed)
            if (users.length === 0) throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchVehiclesPage = async (page = 1, force = false) => {
        // If we have this page cached, return it immediately but trigger a background refresh
        if (!force && vehiclePages[page]) {
            // Background refresh if needed
            performFetchVehiclesPage(page);
            return vehiclePages[page];
        }

        return await performFetchVehiclesPage(page);
    };

    const performFetchVehiclesPage = async (page) => {
        setLoadingVehicles(true);
        try {
            const response = await api.get(`/view/vehicles?page=${page}`);
            if (response.success) {
                const data = response.myvehicles || [];
                setVehiclePages(prev => {
                    const newPages = { ...prev, [page]: data };
                    sessionStorage.setItem('cached_vehicles', JSON.stringify({
                        data: newPages,
                        timestamp: Date.now()
                    }));
                    return newPages;
                });
                return data;
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            if (!vehiclePages[page]) throw error;
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
