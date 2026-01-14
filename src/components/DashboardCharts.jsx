import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Common Chart Options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
            }
        },
    },
};

/**
 * UsersGrowthChart (Line Chart)
 * Props: data (optional)
 */
export const UsersGrowthChart = ({ data }) => {
    const chartData = data || {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'New Users',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(79, 70, 229)', // Indigo-600
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Users Growth Over Time'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return <div className="h-80"><Line options={options} data={chartData} /></div>;
};

/**
 * VehiclesTypeChart (Bar Chart)
 * Props: data (optional)
 */
export const VehiclesTypeChart = ({ data }) => {
    const chartData = data || {
        labels: ['Cars', 'Trucks', 'Motorcycles', 'Vans', 'Buses'],
        datasets: [
            {
                label: 'Number of Vehicles',
                data: [12, 19, 3, 5, 8],
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue-500
                borderRadius: 4,
            },
        ],
    };

    const options = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Vehicles by Type'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return <div className="h-80"><Bar options={options} data={chartData} /></div>;
};

/**
 * VehiclesStatusChart (Doughnut Chart)
 * Props: data (optional)
 */
export const VehiclesStatusChart = ({ data }) => {
    const chartData = data || {
        labels: ['Active', 'Inactive', 'Maintenance'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)', // Green
                    'rgba(156, 163, 175, 0.8)', // Gray
                    'rgba(234, 179, 8, 0.8)', // Yellow
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        ...commonOptions,
        cutout: '70%',
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Vehicles Status'
            },
        },
    };

    return <div className="h-80 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Optional center text could go here */}
        </div>
        <Doughnut options={options} data={chartData} />
    </div>;
};
