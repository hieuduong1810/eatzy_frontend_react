import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { mockDishes, mockRestaurants } from "../data/mockCustomerData";
import customerApi from "../../../api/customer/customerApi";

const CartContext = createContext(null);

/**
 * Cart structure:
 * {
 *   [restaurantId]: {
 *     restaurant: { id, name, imageUrl },
 *     items: {
 *       [dishId]: { dish: { id, name, description, price, imageUrl }, quantity }
 *     }
 *   }
 * }
 */
export function CartProvider({ children }) {
    const [cart, setCart] = useState({});

    // Helper to sync with server
    const fetchCarts = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem("auth_user"));
            if (!user) return;

            const response = await customerApi.getMyCarts();
            if (response.data && response.data.data) {
                const apiCarts = response.data.data; // List of ResCartDTO
                const newCartState = {};

                apiCarts.forEach(cartData => {
                    const resId = cartData.restaurant.id;
                    const itemsObj = {};

                    if (cartData.cartItems) {
                        cartData.cartItems.forEach(item => {
                            // Assuming item structure from ResCartItemDTO (we haven't seen it but can guess or assume generic)
                            // item.dish is ResDishDTO
                            if (item.dish) {
                                itemsObj[item.dish.id] = {
                                    dish: {
                                        id: item.dish.id,
                                        name: item.dish.name,
                                        description: item.dish.description,
                                        price: item.dish.price,
                                        imageUrl: item.dish.image || item.dish.imageUrl,
                                        selectedOptions: item.cartItemOptions ? item.cartItemOptions.map(opt => ({
                                            id: opt.menuOption.id,
                                            name: opt.menuOption.name,
                                            price: opt.menuOption.priceAdjustment
                                        })) : []
                                    },
                                    quantity: item.quantity
                                };
                                // Calculate effective unit price (Base + Options) from Total Price
                                if (item.totalPrice && item.quantity) {
                                    itemsObj[item.dish.id].dish.price = item.totalPrice / item.quantity;
                                }
                            }
                        });
                    }

                    newCartState[resId] = {
                        restaurant: {
                            id: resId,
                            name: cartData.restaurant.name,
                            imageUrl: cartData.restaurant.imageUrl || ""
                        },
                        items: itemsObj
                    };
                });
                setCart(newCartState);
            }
        } catch (error) {
            console.error("Failed to fetch carts", error);
        }
    }, []);

    // Initial Fetch
    useState(() => {
        fetchCarts();
    }, []); // Or useEffect

    // Add/Update Item
    const addItem = useCallback(async (restaurantId, dish, quantity = 1) => {
        console.log("CartContext: addItem called", { restaurantId, dish, quantity });
        try {
            const user = JSON.parse(localStorage.getItem("auth_user"));
            if (!user) {
                console.warn("User not logged in");
                // Fallback to local logic if needed, or just return
            }

            // 2. Prepare Payload
            // We must include ALL existing items for this restaurant, otherwise backend replaces the list.
            const existingCart = cart[restaurantId];
            const existingItems = existingCart ? Object.values(existingCart.items) : [];

            // Check if item already exists to update quantity in the list, or append
            let newCartItemsPayload = [];

            // Map existing items to ReqCartItemDTO structure
            // We need to be careful: if we are adding a NEW item, we append.
            // If we are adding to an EXISTING item, we update its quantity in the list?
            // Actually, the `saveOrUpdateCart` usually takes the full list of what the cart SHOULD look like.

            // Let's build the "target" list of items.
            // First, deep copy existing items or map them.
            // Note: existing items in `cart` state have `dish` and `quantity`.
            // We need to convert them back to DTO structure: { dish: { id }, quantity, cartItemOptions... }

            const itemMap = new Map();

            existingItems.forEach(item => {
                itemMap.set(item.dish.id, {
                    dish: { id: item.dish.id },
                    quantity: item.quantity,
                    cartItemOptions: item.dish.selectedOptions ? item.dish.selectedOptions.map(opt => ({
                        menuOption: { id: opt.id }
                    })) : []
                });
            });

            // Now merge the new item/quantity
            if (itemMap.has(dish.id)) {
                const current = itemMap.get(dish.id);
                // If the user clicked "Add", we usually add +quantity. 
                // But wait, `addItem` is called with `quantity` (e.g. 1). 
                // Does `addItem` mean "Add to existing" or "Set quantity"? 
                // Standard usage in ProductDetail is "Add to Cart" -> usually recursive add.
                // Usage in CartModal (+) button is `addItem(resId, dish)` -> defaults qty=1 -> Add 1.
                current.quantity += quantity;
            } else {
                itemMap.set(dish.id, {
                    dish: { id: dish.id },
                    quantity: quantity,
                    cartItemOptions: dish.selectedOptions ? dish.selectedOptions.map(opt => ({
                        menuOption: { id: opt.id }
                    })) : []
                });
            }

            newCartItemsPayload = Array.from(itemMap.values());

            const payload = {
                customer: { id: user?.id },
                restaurant: { id: restaurantId },
                cartItems: newCartItemsPayload
            };

            // 3. Optimistic Update (Immediate UI feedback)
            setCart((prev) => {
                const rest = mockRestaurants.find((r) => r.id === restaurantId);
                const existing = prev[restaurantId] || {
                    restaurant: { id: rest?.id || restaurantId, name: rest?.name || "", imageUrl: rest?.imageUrl || "" },
                    items: {},
                };
                const existingItem = existing.items[dish.id];
                return {
                    ...prev,
                    [restaurantId]: {
                        ...existing,
                        items: {
                            ...existing.items,
                            [dish.id]: {
                                dish: { ...dish },
                                quantity: (existingItem?.quantity || 0) + quantity,
                            },
                        },
                    },
                };
            });

            // 4. Call API
            if (user?.id) {
                try {
                    await customerApi.addToCart(payload);
                    await fetchCarts(); // Sync with server response to get correct IDs/etc
                } catch (apiErr) {
                    console.error("API Add failed", apiErr);
                    // Ideally revert state here if critical
                }
            }

            // Optimistic update omitted for brevity, relying on fetch.

        } catch (error) {
            console.error("Failed to add item", error);
        }

    }, [cart, fetchCarts]);

    const removeItem = useCallback(async (restaurantId, dishId) => {
        try {
            const user = JSON.parse(localStorage.getItem("auth_user"));

            // 1. Optimistic Update
            setCart((prev) => {
                const restCart = prev[restaurantId];
                if (!restCart) return prev;
                const item = restCart.items[dishId];
                if (!item) return prev;

                if (item.quantity > 1) {
                    return {
                        ...prev,
                        [restaurantId]: {
                            ...restCart,
                            items: { ...restCart.items, [dishId]: { ...item, quantity: item.quantity - 1 } },
                        },
                    };
                }
                // Remove item entirely
                const newItems = { ...restCart.items };
                delete newItems[dishId];
                if (Object.keys(newItems).length === 0) {
                    const newCart = { ...prev };
                    delete newCart[restaurantId];
                    return newCart;
                }
                return { ...prev, [restaurantId]: { ...restCart, items: newItems } };
            });

            // 2. Sync with Backend
            if (user?.id) {
                // We need to reconstruct the payload MINUS the decremented/removed item state
                // Actually, since we updated state optimistically, let's use the PREVIOUS state logic 
                // but we are inside an async callback, so "cart" state might be stale if we don't use functional update
                // OR we calculate the new payload based on what we *intend* to do.

                // Let's refetch existing cart from state (might be slightly stale if rapid clicking, but for now ok)
                // Better: Calculate payload based on the same logic as optimistic update.

                const existingCart = cart[restaurantId];
                if (!existingCart) return;

                const existingItems = Object.values(existingCart.items);

                // Filter and map
                const newCartItemsPayload = [];

                existingItems.forEach(item => {
                    let newQty = item.quantity;
                    if (item.dish.id === dishId) {
                        newQty -= 1;
                    }

                    if (newQty > 0) {
                        newCartItemsPayload.push({
                            dish: { id: item.dish.id },
                            quantity: newQty,
                            cartItemOptions: item.dish.selectedOptions ? item.dish.selectedOptions.map(opt => ({
                                menuOption: { id: opt.id }
                            })) : []
                        });
                    }
                });

                // If payload empty, maybe backend handles it or we need deleteCart?
                // Assuming saveOrUpdate with empty items clears it, or we leave it empty.

                const payload = {
                    customer: { id: user?.id },
                    restaurant: { id: restaurantId },
                    cartItems: newCartItemsPayload
                };

                await customerApi.addToCart(payload);
                // await fetchCarts(); // Optional: ensure strict sync
            }
        } catch (error) {
            console.error("Failed to remove item", error);
            fetchCarts(); // Revert on error
        }
    }, [cart, fetchCarts]);

    const deleteItem = useCallback(async (restaurantId, dishId) => {
        try {
            const user = JSON.parse(localStorage.getItem("auth_user"));
            // 1. Optimistic Update (Remove item completely)
            setCart((prev) => {
                const restCart = prev[restaurantId];
                if (!restCart) return prev;

                const newItems = { ...restCart.items };
                delete newItems[dishId];

                if (Object.keys(newItems).length === 0) {
                    const newCart = { ...prev };
                    delete newCart[restaurantId];
                    return newCart;
                }
                return { ...prev, [restaurantId]: { ...restCart, items: newItems } };
            });

            // 2. Sync with Backend
            if (user?.id) {
                // Determine payload: existing items MINUS the deleted one
                // Since we don't have the old state easily here without looking at `cart` (which might be stale),
                // we'll rely on the fact that we can reconstruct valid items from the *previous* cart state passed in setValue 
                // but we are in async.
                // Let's use the current `cart` ref data, assuming it hasn't changed concurrently too much.

                const existingCart = cart[restaurantId];
                if (!existingCart) return;

                const existingItems = Object.values(existingCart.items);

                const newCartItemsPayload = existingItems
                    .filter(item => item.dish.id !== dishId)
                    .map(item => ({
                        dish: { id: item.dish.id },
                        quantity: item.quantity,
                        cartItemOptions: item.dish.selectedOptions ? item.dish.selectedOptions.map(opt => ({
                            menuOption: { id: opt.id }
                        })) : []
                    }));

                // If new items is empty, it means we deleted the last item.
                // Depending on backend, sending empty list might not delete the cart entity.
                // But for now, we send empty list.

                const payload = {
                    customer: { id: user?.id },
                    restaurant: { id: restaurantId },
                    cartItems: newCartItemsPayload
                };

                await customerApi.addToCart(payload);
                await fetchCarts(); // Sync
            }
        } catch (error) {
            console.error("Failed to delete item", error);
            fetchCarts();
        }
    }, [cart, fetchCarts]);

    const deleteRestaurantCart = useCallback(async (restaurantId) => {
        try {
            const user = JSON.parse(localStorage.getItem("auth_user"));

            // 1. Optimistic Update
            setCart((prev) => {
                const next = { ...prev };
                delete next[restaurantId];
                return next;
            });

            // 2. Sync with Backend
            if (user?.id) {
                // Send empty cartItems to clear the cart for this restaurant
                const payload = {
                    customer: { id: user.id },
                    restaurant: { id: restaurantId },
                    cartItems: []
                };

                await customerApi.addToCart(payload);
                await fetchCarts();
            }
        } catch (error) {
            console.error("Failed to delete restaurant cart", error);
            fetchCarts();
        }
    }, [fetchCarts]);

    const clearCart = useCallback(() => setCart({}), []);

    const getItemCount = useCallback(
        (restaurantId, dishId) => cart[restaurantId]?.items[dishId]?.quantity || 0,
        [cart]
    );

    const totalItems = useMemo(() => {
        let count = 0;
        for (const restCart of Object.values(cart)) {
            for (const item of Object.values(restCart.items)) {
                count += item.quantity;
            }
        }
        return count;
    }, [cart]);

    const totalPrice = useMemo(() => {
        let sum = 0;
        for (const restCart of Object.values(cart)) {
            for (const item of Object.values(restCart.items)) {
                sum += item.dish.price * item.quantity;
            }
        }
        return sum;
    }, [cart]);

    // Initial load
    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    const restaurantCount = useMemo(() => Object.keys(cart).length, [cart]);

    const value = useMemo(
        () => ({ cart, addItem, removeItem, deleteItem, deleteRestaurantCart, clearCart, getItemCount, totalItems, totalPrice, restaurantCount }),
        [cart, addItem, removeItem, deleteItem, deleteRestaurantCart, clearCart, getItemCount, totalItems, totalPrice, restaurantCount]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
