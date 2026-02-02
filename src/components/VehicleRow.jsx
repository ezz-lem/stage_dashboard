import React from 'react';
import { Car } from 'lucide-react';

const VehicleRow = ({ resourceInfo }) => {
    const { title } = resourceInfo.resource;

    return (
        <div className="flex items-center p-2 truncate">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                <Car className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate">
                    {title}
                </span>
            </div>
        </div>
    );
};

export default VehicleRow;
