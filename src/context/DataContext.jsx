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
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [lastFetchUsers, setLastFetchUsers] = useState(0);
    const [lastFetchVehicles, setLastFetchVehicles] = useState(0);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Persist to sessionStorage
    useEffect(() => {
        const savedUsers = sessionStorage.getItem('cached_users');
        const savedVehicles = sessionStorage.getItem('cached_vehicles');

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
                setVehicles(data);
                setLastFetchVehicles(timestamp);
            }
        }
    }, []);

    const fetchUsers = async (force = false) => {
        // If we have cached users, return them immediately but still fetch in the background
        if (!force && users.length > 0) {
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
            if (users.length === 0) throw error;
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchVehicles = async (force = false) => {
        if (!force && vehicles.length > 0) {
            if (Date.now() - lastFetchVehicles > CACHE_DURATION / 5) {
                performFetchVehicles();
            }
            return vehicles;
        }

        return await performFetchVehicles();
    };

    const performFetchVehicles = async () => {
        setLoadingVehicles(true);
        try {
            // Using page=1 because the API seems to return everything regardless
            const response = await api.get('/view/vehicles?page=1');
            if (response.success) {
                const data = response.myvehicles || [];
                setVehicles(data);
                setLastFetchVehicles(Date.now());
                sessionStorage.setItem('cached_vehicles', JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
                return data;
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            if (vehicles.length === 0) throw error;
        } finally {
            setLoadingVehicles(false);
        }
    };

    const clearCache = () => {
        sessionStorage.removeItem('cached_users');
        sessionStorage.removeItem('cached_vehicles');
        setUsers([]);
        setVehicles([]);
        setLastFetchUsers(0);
        setLastFetchVehicles(0);
    };

    const value = {
        users,
        loadingUsers,
        fetchUsers,
        vehicles,
        loadingVehicles,
        fetchVehicles,
        clearCache
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
