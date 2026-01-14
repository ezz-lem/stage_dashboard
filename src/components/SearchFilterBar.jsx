import { Search, Filter } from 'lucide-react';

const SearchFilterBar = ({
    searchQuery,
    onSearchChange,
    placeholder = "Search...",
    filters = []
}) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filters */}
            {filters.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <div className="flex items-center text-sm text-gray-500 mr-2">
                        <Filter className="h-4 w-4 mr-1" />
                        Filters:
                    </div>
                    {filters.map((filter, index) => (
                        <select
                            key={index}
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchFilterBar;
