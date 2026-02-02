import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Users from '../pages/Users';
import UserDetail from '../pages/UserDetail';
import VehicleDetail from '../pages/VehicleDetail';
import Agenda from '../pages/Agenda';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/vehicles/:id" element={<VehicleDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />

                {/* Default redirect to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;
