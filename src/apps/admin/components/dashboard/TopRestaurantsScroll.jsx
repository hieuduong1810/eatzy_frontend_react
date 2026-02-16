import { ChevronRight, Plus, Store } from "lucide-react";

const TopRestaurantsScroll = ({ restaurants }) => {
    const formatCurrency = (val) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency", currency: "VND", notation: "compact",
        }).format(val);

    return (
        <div className="top-restaurants card">
            <div className="top-restaurants-header">
                <h3 className="top-restaurants-title">Top Cửa hàng hiệu quả</h3>
                <button className="top-restaurants-link">
                    Xem tất cả <ChevronRight size={16} />
                </button>
            </div>

            <div className="top-restaurants-scroll">
                <div className="top-restaurants-add">
                    <div className="top-restaurants-add-circle">
                        <Plus size={24} />
                    </div>
                    <span className="top-restaurants-add-label">Thêm mới</span>
                </div>

                {restaurants.map((r) => (
                    <div key={r.id} className="top-restaurant-item">
                        <div className="top-restaurant-avatar">
                            {r.image ? (
                                <img src={r.image} alt={r.name} />
                            ) : (
                                <Store size={24} />
                            )}
                        </div>
                        <div className="top-restaurant-info">
                            <p className="top-restaurant-name">{r.name}</p>
                            <p className="top-restaurant-type">{r.type}</p>
                        </div>
                        <div className="top-restaurant-revenue">
                            {formatCurrency(r.revenue)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRestaurantsScroll;
