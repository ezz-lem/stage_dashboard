import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

/**
 * StatsCard Component
 * Displays a single statistic with an icon, value, and optional trend.
 * 
 * Props:
 * - title: Title of the stat (string)
 * - value: The numerical value (string or number)
 * - icon: Lucide icon component
 * - trend: Object { value: number, label: string, direction: 'up' | 'down' | 'neutral' }
 * - color: Color theme for the icon background (string, e.g., "blue", "green")
 */
const StatsCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {

    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        yellow: "bg-yellow-100 text-yellow-600",
        purple: "bg-purple-100 text-purple-600",
        indigo: "bg-indigo-100 text-indigo-600",
        orange: "bg-orange-100 text-orange-600",
        gray: "bg-gray-100 text-gray-600",
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`rounded-md p-3 ${colorClasses[color] || colorClasses.blue}`}>
                        {Icon && <Icon className="h-6 w-6" />}
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-2xl font-bold text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    {trend.direction === 'up' && <ArrowUp className="flex-shrink-0 h-4 w-4 text-green-500" />}
                    {trend.direction === 'down' && <ArrowDown className="flex-shrink-0 h-4 w-4 text-red-500" />}
                    {trend.direction === 'neutral' && <Minus className="flex-shrink-0 h-4 w-4 text-gray-400" />}
                    <span className={`ml-1 font-medium ${trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                        {trend.value}%
                    </span>
                    <span className="ml-2 text-gray-400">{trend.label}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
