
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const CartModal = ({ isOpen, onClose, restaurantId }) => {
    const navigate = useNavigate();
    const { cart, addItem, removeItem } = useCart();

    const handleCheckout = () => {
        onClose();
        const restaurantCart = cart[restaurantId];
        if (restaurantCart) {
            navigate(`/checkout`, {
                state: {
                    restaurant: restaurantCart.restaurant,
                    items: Object.values(restaurantCart.items).map(item => ({
                        ...item.dish,
                        quantity: item.quantity
                    }))
                }
            });
        }
    };

    if (!isOpen) return null;

    const restaurantCart = cart[restaurantId];
    // If no items, we might still want to show empty cart or just close?
    // Screenshot 2 shows items.
    const items = restaurantCart ? Object.values(restaurantCart.items) : [];
    const totalPrice = items.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal-container" onClick={e => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <div className="cart-header-text">
                        <h3>Giỏ hàng của bạn</h3>
                        {restaurantCart?.restaurant && <span className="cart-res-name">{restaurantCart.restaurant.name}</span>}
                    </div>
                    <button className="cart-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="cart-modal-body">
                    {items.length === 0 ? (
                        <div className="cart-empty-state">
                            <ShoppingBag size={48} color="#ccc" />
                            <p>Giỏ hàng đang trống</p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {items.map(item => (
                                <div key={item.dish.id} className="cart-item-row">
                                    <div className="cart-item-img">
                                        <img src={item.dish.imageUrl || "https://placehold.co/60x60"} alt={item.dish.name} />
                                    </div>
                                    <div className="cart-item-info">
                                        <h4>{item.dish.name}</h4>
                                        <p className="cart-item-desc">{item.dish.description}</p>
                                        {/* If options exist, list them here */}
                                        {item.dish.selectedOptions && item.dish.selectedOptions.length > 0 && (
                                            <p className="cart-item-options">
                                                {item.dish.selectedOptions.map(opt => opt.name).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="cart-price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.dish.price * item.quantity)}
                                        </div>
                                        <div className="cart-qty-control">
                                            <button
                                                className="qty-btn-circle minus"
                                                onClick={() => removeItem(restaurantId, item.dish.id)}
                                            >
                                                {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                            </button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button
                                                className="qty-btn-circle plus"
                                                onClick={() => addItem(restaurantId, item.dish)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-subtotal-row">
                            <span>Tổng tạm tính</span>
                            <span className="cart-subtotal-val">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </span>
                        </div>
                        <button className="cart-checkout-btn" onClick={handleCheckout}>
                            <ShoppingBag size={18} />
                            <span>THANH TOÁN</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
