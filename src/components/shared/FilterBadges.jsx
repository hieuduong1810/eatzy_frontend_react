import { X } from "lucide-react";
import "./FilterBadges.css";

const FilterBadges = ({ filters = [], onRemove, onClearAll }) => {
    if (filters.length === 0) return null;

    return (
        <div className="filter-badges">
            {filters.map((filter, index) => (
                <div key={index} className="filter-badge-item">
                    <span className="filter-badge-label">{filter.label}:</span>
                    <span className="filter-badge-value">{filter.value}</span>
                    <button
                        className="filter-badge-remove"
                        onClick={() => onRemove && onRemove(filter.key)}
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
            {filters.length > 1 && (
                <button className="filter-badge-clear" onClick={onClearAll}>
                    Xoá tất cả
                </button>
            )}
        </div>
    );
};

export default FilterBadges;
