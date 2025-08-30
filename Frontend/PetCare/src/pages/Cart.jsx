import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import dropin from "braintree-web-drop-in";

export default function Cart() {
const { cartData, updateCart } = useCart();
const { isAuthed } = useAuth();

const [products, setProducts] = useState([]);
const [btInstance, setBtInstance] = useState(null);
const [btLoading, setBtLoading] = useState(false);
const [placing, setPlacing] = useState(false);
const [payError, setPayError] = useState("");

const dropinContainerRef = useRef(null);
const dropinInstanceRef = useRef(null);

// Load products (for price/name rendering)
useEffect(() => {
    (async () => {
    try {
        const { data } = await api.get("/products/getProducts");
        setProducts(data?.products || []);
    } catch {
        setProducts([]);
    }
    })();
}, []);

const productMap = useMemo(() => {
    const m = new Map();
    products.forEach((p) => m.set(p._id, p));
    return m;
}, [products]);

const rows = useMemo(() => {
    const arr = [];
    for (const pid in cartData) {
    for (const size in cartData[pid]) {
        const qty = Number(cartData[pid][size] || 0);
        if (!qty) continue;
        const p = productMap.get(pid);
        if (p) arr.push({ p, size, qty });
    }
    }
    return arr;
}, [cartData, productMap]);

const total = rows.reduce((sum, r) => sum + Number(r.p.price) * r.qty, 0);

const changeQty = async (pid, size, qty) => {
    if (qty < 0) return;
    await updateCart(pid, size, qty);
};

// Braintree Drop-in init (runs after auth and when cart rows exist so the container is mounted)
useEffect(() => {
    if (!isAuthed) {
    if (dropinInstanceRef.current) {
        dropinInstanceRef.current.teardown().catch(() => {});
        dropinInstanceRef.current = null;
    }
    setBtInstance(null);
    setPayError("");
    if (dropinContainerRef.current) dropinContainerRef.current.innerHTML = "";
    return;
    }

    if (rows.length === 0) return;
    if (!dropinContainerRef.current) return;
    if (dropinInstanceRef.current) return;

    let mounted = true;

    (async () => {
    try {
        setBtLoading(true);
        setPayError("");

        dropinContainerRef.current.innerHTML = "";

        const { data } = await api.get("/payment/client-token");
        if (!data?.success || !data?.clientToken) {
        setPayError("Payment temporarily unavailable. Please try again later.");
        return;
        }

        const inst = await dropin.create({
        authorization: data.clientToken,
        container: dropinContainerRef.current,
        card: { cardholderName: true },
        // paypal: { flow: "checkout", amount: total.toFixed(2), currency: "USD" },
        });

        if (!mounted) {
        inst.teardown().catch(() => {});
        return;
        }

        dropinInstanceRef.current = inst;
        setBtInstance(inst);
    } catch {
        setPayError("Payment init failed. Please refresh and try again.");
        if (dropinContainerRef.current) dropinContainerRef.current.innerHTML = "";
    } finally {
        if (mounted) setBtLoading(false);
    }
    })();

    return () => {
    mounted = false;
    if (dropinInstanceRef.current) {
        dropinInstanceRef.current
        .teardown()
        .then(() => {
            dropinInstanceRef.current = null;
            setBtInstance(null);
            if (dropinContainerRef.current) dropinContainerRef.current.innerHTML = "";
        })
        .catch(() => {});
    } else if (dropinContainerRef.current) {
        dropinContainerRef.current.innerHTML = "";
    }
    };
    // Only re-run when auth changes or when rows first appear
}, [isAuthed, rows.length]);

// Braintree checkout
const checkoutWithBraintree = async () => {
    if (!isAuthed) return alert("Please login first.");
    if (!rows.length) return alert("Your cart is empty.");
    if (!btInstance) return alert("Payment UI not ready yet.");

    try {
    setPlacing(true);

    const { nonce } = await btInstance.requestPaymentMethod();

    const items = rows.map((r) => ({
        productId: r.p._id,
        size: r.size,
        quantity: r.qty,
    }));

    const { data } = await api.post("/payment/checkout", {
        nonce,
        items,
    });

    if (data?.success) {
        alert("Payment success! Transaction ID: " + data.transaction.id);
    } else {
        alert(data?.message || "Payment failed.");
    }
    } catch {
    alert("Checkout error.");
    } finally {
    setPlacing(false);
    }
};

if (!rows.length)
    return (
    <div className="pt-14 mx-auto max-w-screen-lg p-6">
        <h1 className="text-xl font-semibold mb-3">Your Cart</h1>
        <div className="rounded-lg bg-white ring-1 ring-slate-200 p-6">
        Your cart is empty.{" "}
        <Link to="/shop" className="text-teal-700 underline">
            Go shopping →
        </Link>
        </div>
    </div>
    );

return (
    <div className="pt-14 mx-auto max-w-screen-xl p-6">
    <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

    <div className="grid gap-4">
        {rows.map(({ p, size, qty }) => (
        <div
            key={p._id + size}
            className="flex items-center gap-4 rounded-lg bg-white ring-1 ring-slate-200 p-3"
        >
            <img
            src={p.image?.[0]}
            alt={p.name}
            className="h-16 w-16 object-cover rounded"
            />
            <div className="flex-1">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-slate-500">Variant: {size}</div>
            <div className="text-sm text-slate-600 mt-1">
                ₹{Number(p.price).toFixed(2)} each
            </div>
            </div>

            <div className="flex items-center gap-2">
            <button
                onClick={() => changeQty(p._id, size, qty - 1)}
                className="rounded bg-slate-100 px-2 py-1"
                aria-label={`Decrease ${p.name} (${size}) quantity`}
            >
                -
            </button>

            <input
                type="number"
                id={`qty-${p._id}-${size}`}
                name={`qty-${p._id}-${size}`}
                aria-label={`Quantity for ${p.name} (${size})`}
                className="w-12 text-center rounded border border-slate-300 py-1"
                value={qty}
                onChange={(e) => {
                const v = Number(e.target.value) || 0;
                changeQty(p._id, size, v);
                }}
                min={0}
                inputMode="numeric"
                pattern="[0-9]*"
            />

            <button
                onClick={() => changeQty(p._id, size, qty + 1)}
                className="rounded bg-slate-100 px-2 py-1"
                aria-label={`Increase ${p.name} (${size}) quantity`}
            >
                +
            </button>
            </div>

            <div className="w-24 text-right font-semibold">
            ₹{(Number(p.price) * qty).toFixed(2)}
            </div>
        </div>
        ))}
    </div>

    {/* Payment section */}
    <div className="mt-8 grid md:grid-cols-[1fr,380px] gap-6 items-start">
        <div className="rounded-lg bg-white ring-1 ring-slate-200 p-4">
        <h2 className="font-semibold mb-2">Payment</h2>

        {payError && (
            <div className="mb-2 text-sm text-red-600">{payError}</div>
        )}

        {btLoading && (
            <div className="text-sm text-slate-500">Loading payment form…</div>
        )}

        <div id="bt-dropin" ref={dropinContainerRef} />

        {!isAuthed && (
            <div className="mt-3 text-sm text-amber-700">
            Please login to pay.
            </div>
        )}
        </div>

        <div className="rounded-lg bg-white ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-lg font-semibold">₹{total.toFixed(2)}</div>
        </div>

        <button
            onClick={checkoutWithBraintree}
            disabled={!isAuthed || !btInstance || btLoading || placing}
            className={
            "mt-4 w-full rounded-lg px-5 py-2.5 text-white font-medium " +
            (!isAuthed || !btInstance || btLoading || placing
                ? "bg-teal-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-500")
            }
        >
            {placing
            ? "Processing…"
            : btLoading
            ? "Loading payment…"
            : "Pay with Braintree"}
        </button>
        </div>
    </div>
    </div>
);
}



