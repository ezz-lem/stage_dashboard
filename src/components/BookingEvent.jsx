import React from 'react';

const BookingEvent = ({ eventInfo }) => {
    const { event } = eventInfo;
    const { status } = event.extendedProps;

    return (
        <div className="flex flex-col h-full px-2 py-1 overflow-hidden group">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {status}
                </span>
            </div>
            <div className="text-xs font-semibold truncate mt-0.5">
                {event.title}
            </div>

            {/* Hover details hint */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

export default BookingEvent;
