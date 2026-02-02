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
    if (isLoading && (!data || data.length === 0)) {
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

                    </div>

                    {/* Pagination Footer - Moved outside and unified */}
                    {pagination && (pagination.currentPage > 1 || !pagination.isLastPage || (pagination.totalPages && pagination.totalPages > 1)) && (
                        <div className="mt-4 px-4 py-3 flex flex-col space-y-4 sm:flex-row sm:space-y-0 items-center justify-between sm:px-0">
                            <div className="flex flex-col items-center sm:flex-row sm:justify-between w-full sm:w-auto text-center sm:text-left">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{pagination.currentPage}</span>
                                        {pagination.totalPages && (
                                            <> of <span className="font-medium">{pagination.totalPages}</span></>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
                                            disabled={pagination.currentPage <= 1}
                                            className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                                        </button>

                                        {/* Page Numbers */}
                                        {pagination.totalPages && Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                                            const isNearCurrent = Math.abs(page - pagination.currentPage) <= 1;
                                            const isFirst = page === 1;
                                            const isLast = page === pagination.totalPages;

                                            if (isNearCurrent || isFirst || isLast) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => onPageChange(page)}
                                                        aria-current={pagination.currentPage === page ? 'page' : undefined}
                                                        className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border text-xs sm:text-sm font-medium ${pagination.currentPage === page
                                                            ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            }

                                            if ((page === 2 && pagination.currentPage > 3) || (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)) {
                                                return <span key={`ell-${page}`} className="relative inline-flex items-center px-2 py-1.5 sm:px-4 sm:py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700">...</span>;
                                            }

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
                                            className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Table;
