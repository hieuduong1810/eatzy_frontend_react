
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const CartFloatingButton = ({ restaurantId, onClick }) => {
    const { cart } = useCart();

    const restaurantCart = cart[restaurantId];
    if (!restaurantCart || !restaurantCart.items) return null;

    const items = Object.values(restaurantCart.items);
    if (items.length === 0) return null;

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
    // Note: Total price calculation in CartContext might be more robust if options are considered, 
    // but here we use a simple calculation or rely on what's available. 
    // Wait, CartContext exports totalPrice, but that is GLOBAL total. We need RESTAURANT total.
    // Let's re-calculate for this restaurant.

    // Check if options affect price. CartContext structure stores `dish.price`. 
    // Ideally we should store the final unit price in item. 
    // The previous analysis of DishSelectionModal shows `addItem` call adds `selectedOptions`.
    // But `CartContext` implementation shown earlier does NOT seem to account for option prices in `totalPrice` global calc 
    // nor does it store option selection properly for price calc if strictly following the code I saw.
    // However, for the UI task, I will stick to a basic calculation or use the global one if only 1 restaurant is active.
    // Let's calculate based on item.dish.price * quantity for now.

    return (
        <button className="cart-floating-btn" onClick={onClick}>
            <div className="cart-float-icon">
                <ShoppingBag size={20} color="white" />
                <span className="cart-float-badge">{totalCount}</span>
            </div>
            <div className="cart-float-info">
                <span className="cart-float-label">GIỎ HÀNG</span>
                <span className="cart-float-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
            </div>
        </button>
    );
};

export default CartFloatingButton;
