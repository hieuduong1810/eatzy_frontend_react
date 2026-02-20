import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "./Skeleton";
import "./DataTable.css";
/* Add this style implicitly in the component or via this file? 
   Wait, I should verify if DataTable.css exists. 
   Assuming it does from the import.
   I will append the CSS to DataTable.css if I can, but I didn't view it.
   Actually, I can just add `style={{ cursor: onRowClick ? 'pointer' : 'default' }}` inline in JSX to be safe and quick without viewing another file.
   Let's modify the previous `replace_file_content` to include the style inline or use the tool to append to css.
   
   Rethink: modifying the previous step is impossible. I will just assume standard CSS or inline style.
   But I already used `className`.
   Let's check `DataTable.css` quickly or just add the class definition in `HistoryPage.css`? No, that's messy.
   I will write to `DataTable.css` blindly? No.
   I'll check `DataTable.css`.
*/
/* Actually, I'll update HistoryPage.jsx to pass onRowClick, and `DataTable` modification is already done.
   I will just add the CSS to `HistoryPage.css` as a global override for now `.clickable-row { cursor: pointer; }` or rely on `HistoryPage.css` being loaded.
   Better: View `DataTable.css`.
*/

const DataTable = ({
    columns = [],
    data = [],
    searchPlaceholder = "Tìm kiếm...",
    onSearch,
    actions,
    pageSize = 10,
    emptyMessage = "Không có dữ liệu",
    onRowClick,
    loading = false, // new prop with default false
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Search filter
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        onSearch && onSearch(value);
    };

    // Sort
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    // Filter data by search
    let filteredData = data;
    if (searchTerm && !onSearch) {
        const term = searchTerm.toLowerCase();
        filteredData = data.filter((row) =>
            columns.some((col) => {
                const val = row[col.key];
                return val && String(val).toLowerCase().includes(term);
            })
        );
    }

    // Sort data
    if (sortConfig.key) {
        filteredData = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const pageData = filteredData.slice(startIdx, startIdx + pageSize);

    return (
        <div className="data-table-wrapper card">
            {/* Toolbar */}
            <div className="data-table-toolbar">
                <div className="data-table-search">
                    <Search size={16} className="data-table-search-icon" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="data-table-search-input"
                    />
                </div>
                {actions && <div className="data-table-actions">{actions}</div>}
            </div>

            {/* Table */}
            <div className="data-table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={col.sortable !== false ? "sortable" : ""}
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    <span>{col.label}</span>
                                    {sortConfig.key === col.key && (
                                        <span className="sort-indicator">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Skeleton Loading Rows
                            Array.from({ length: pageSize }).map((_, idx) => (
                                <tr key={`skeleton-${idx}`}>
                                    {columns.map((col, colIdx) => (
                                        <td key={`sk-col-${colIdx}`}>
                                            <Skeleton
                                                variant="text"
                                                height={20}
                                                width={col.key === 'id' ? '40px' : '80%'}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : pageData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="data-table-empty">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            pageData.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={onRowClick ? "clickable-row" : ""}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="data-table-pagination">
                    <span className="data-table-pagination-info">
                        Hiển thị {startIdx + 1}-{Math.min(startIdx + pageSize, filteredData.length)} / {filteredData.length}
                    </span>
                    <div className="data-table-pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="pagination-btn"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="pagination-btn"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
