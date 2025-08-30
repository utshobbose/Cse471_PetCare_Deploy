import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthed } = useAuth();
    // cartData shape from backend: { [itemId]: { [size]: quantity } }
    const [cartData, setCartData] = useState({});

    const loadCart = async () => {
    if (!isAuthed) {
        setCartData({});
        return;
    }
    // const { data } = await api.post("/api/cart/get", {}); // userId injected by middleware
    const { data } = await api.post("/cart/get", {});
    if (data?.success) setCartData(data.cartData || {});
    };

    const addToCart = async (itemId, size) => {
    // const { data } = await api.post("/api/cart/add", { itemId, size });
    const { data } = await api.post("/cart/add", { itemId, size });

    if (data?.success) await loadCart();
    else throw new Error(data?.message || "Add to cart failed");
    };

    const updateCart = async (itemId, size, quantity) => {
    // const { data } = await api.post("/api/cart/update", { itemId, size, quantity });
    const { data } = await api.post("/cart/update", { itemId, size, quantity });

    if (data?.success) await loadCart();
    else throw new Error(data?.message || "Update cart failed");
    };

    useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthed]);

    const count = useMemo(() => {
    let c = 0;
    for (const pid in cartData) for (const sz in cartData[pid]) c += Number(cartData[pid][sz] || 0);
    return c;
    }, [cartData]);

    return (
    <CartContext.Provider value={{ cartData, count, loadCart, addToCart, updateCart }}>
        {children}
    </CartContext.Provider>
    );
    }

    export function useCart() {
    return useContext(CartContext);
}
