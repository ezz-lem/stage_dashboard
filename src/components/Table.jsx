import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({
    columns,
    data,
    isLoading,
    keyField = 'id',
    pagination,
    onPageChange,
    onRowClick
}) => {
    if (isLoading) {
        return (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-10 text-center text-gray-500">
                Loading data...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-10 text-center text-gray-500">
                No records found.
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key || col.header}
                                            scope="col"
                                            className={clsx(
                                                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                col.className
                                            )}
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((row, rowIndex) => (
                                    <tr
                                        key={row[keyField] || rowIndex}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        {pagination && (pagination.currentPage > 1 || !pagination.isLastPage || (pagination.totalPages && pagination.totalPages > 1)) && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Page <span className="font-medium">{pagination.currentPage}</span>
                                            {pagination.totalPages && (
                                                <> of <span className="font-medium">{pagination.totalPages}</span></>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
                                                disabled={pagination.currentPage <= 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                            </button>

                                            {/* Page Numbers */}
                                            {pagination.totalPages && Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                                                // Simple logic: Show all if few, or just window around current if many.
                                                // For now, implementing simple "show all" or "smart hide" could be complex.
                                                // Let's implement a window: First, Last, Current +/- 1
                                                const isNearCurrent = Math.abs(page - pagination.currentPage) <= 1;
                                                const isFirst = page === 1;
                                                const isLast = page === pagination.totalPages;
                                                const showEllipsisStart = page === 2 && pagination.currentPage > 4;
                                                const showEllipsisEnd = page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3;

                                                if (isNearCurrent || isFirst || isLast) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => onPageChange(page)}
                                                            aria-current={pagination.currentPage === page ? 'page' : undefined}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === page
                                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                }

                                                // Show ellipsis
                                                if ((isFirst && pagination.currentPage > 3 && page === 1) || (isLast && pagination.currentPage < pagination.totalPages - 2 && page === pagination.totalPages)) {
                                                    // Actually cleaner logic:
                                                    // If we skipped, we render ellipsis? 
                                                    // Simplest approach: just render ellipsis if gap
                                                    return null;
                                                }

                                                // Render ellipsis place holders (approximate)
                                                if (page === 2 && pagination.currentPage > 4) return <span key={`ell-${page}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                                                if (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) return <span key={`ell-${page}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;

                                                return null;
                                            })}

                                            {!pagination.totalPages && (
                                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            )}

                                            <button
                                                onClick={() => onPageChange(pagination.currentPage + 1)}
                                                disabled={pagination.isLastPage || (pagination.totalPages && pagination.currentPage >= pagination.totalPages)}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
