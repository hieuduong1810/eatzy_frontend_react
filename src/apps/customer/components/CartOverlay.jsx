import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, ShoppingBag, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatVnd } from "../data/mockCustomerData";
import "./CartOverlay.css";

export default function CartOverlay({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { cart, removeItem, deleteItem, deleteRestaurantCart, totalItems, totalPrice, restaurantCount } = useCart();
    const [editMode, setEditMode] = useState(false);

    if (!isOpen) return null;

    const restaurantEntries = Object.entries(cart);

    const handleCheckout = (restaurantId) => {
        onClose();
        const selectedCart = cart[restaurantId];
        navigate(`/checkout`, {
            state: {
                restaurant: selectedCart.restaurant,
                items: Object.values(selectedCart.items).map(item => ({
                    ...item.dish,
                    quantity: item.quantity
                }))
            }
        });
    };

    return (
        <div className="cart-overlay-bg" onClick={onClose}>
            <div className="cart-overlay-panel" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="cart-overlay-header">
                    <div>
                        <h2 className="cart-overlay-title">MY CART</h2>
                        <span className="cart-overlay-subtitle">
                            {restaurantCount} quán ăn • {totalItems} món
                        </span>
                    </div>
                    <div className="cart-overlay-header-actions">
                        {restaurantEntries.length > 0 && (
                            <button
                                className={`cart-overlay-edit-btn ${editMode ? "cart-overlay-edit-btn--active" : ""}`}
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? "Xong" : "Sửa"}
                            </button>
                        )}
                        <button className="cart-overlay-close" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="cart-overlay-body">
                    {restaurantEntries.length === 0 ? (
                        <div className="cart-overlay-empty">
                            <ShoppingBag size={48} />
                            <h3>Giỏ hàng trống</h3>
                            <p>Thêm món ăn từ nhà hàng yêu thích của bạn</p>
                        </div>
                    ) : (
                        restaurantEntries.map(([restId, restCart]) => {
                            const items = Object.values(restCart.items);
                            const restTotal = items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0);
                            return (
                                <div key={restId} className="cart-rest-card">
                                    {/* Restaurant header */}
                                    <div className="cart-rest-header">
                                        <div className="cart-rest-icon">
                                            <Store size={14} />
                                        </div>
                                        <img src={restCart.restaurant.imageUrl} alt="" className="cart-rest-thumb" />
                                        <div className="cart-rest-info">
                                            <h3 className="cart-rest-name">{restCart.restaurant.name}</h3>
                                            <span className="cart-rest-meta">{items.length} món</span>
                                        </div>
                                        {editMode && (
                                            <button className="cart-rest-delete" onClick={() => deleteRestaurantCart(restId)}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Items */}
                                    {items.map((item) => (
                                        <div key={item.dish.id} className="cart-item">
                                            <img src={item.dish.imageUrl} alt="" className="cart-item-img" />
                                            <div className="cart-item-info">
                                                <h4 className="cart-item-name">{item.dish.name}</h4>
                                                <span className="cart-item-desc">{item.dish.description}</span>
                                                {item.dish.selectedOptions && item.dish.selectedOptions.length > 0 && (
                                                    <span className="cart-item-options">
                                                        {item.dish.selectedOptions.map(opt => opt.name).join(", ")}
                                                    </span>
                                                )}
                                                <span className="cart-item-qty">{item.quantity} món</span>
                                            </div>
                                            <div className="cart-item-right">
                                                {editMode && (
                                                    <button className="cart-item-delete" onClick={() => deleteItem(restId, item.dish.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <span className="cart-item-price">{formatVnd(item.dish.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Checkout for this restaurant */}
                                    {!editMode && (
                                        <button className="cart-rest-checkout" onClick={(e) => { e.preventDefault(); handleCheckout(restId); }}>
                                            Thanh toán · {formatVnd(restTotal)}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
