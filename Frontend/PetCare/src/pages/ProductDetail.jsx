import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isAuthed } = useAuth();
    const [p, setP] = useState(null);
    const [size, setSize] = useState("");

    useEffect(() => {
    (async () => {
        // const { data } = await api.get(`/api/products/${id}`);
        const { data } = await api.get(`/products/${id}`);
        console.log(data);
        setP(data?.product || null);
        setSize((data?.product?.sizes || [])[0] || "");
    })();
    }, [id]);

    if (!p) return <div className="pt-14 p-6">Loading…</div>;

    const onAdd = async () => {
    if (!isAuthed) {
        alert("Please login to add items to cart.");
        return;
    }
    if (!size) {
        alert("Please choose a size/variant.");
        return;
    }
    await addToCart(p._id, size);
    alert("Added to cart!");
    };

    return (
    <div className="pt-14 mx-auto max-w-screen-xl p-6 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white">
        <img src={p.image?.[0]} alt={p.name} className="w-full object-cover" />
        </div>

        <div>
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <div className="mt-1 text-slate-500">{p.category}{p.subCategory ? ` • ${p.subCategory}` : ""}</div>
        <div className="mt-3 text-2xl font-bold text-teal-700">₹{Number(p.price).toFixed(2)}</div>

        {Array.isArray(p.sizes) && p.sizes.length > 0 && (
            <div className="mt-4">
            <div className="text-sm text-slate-600 mb-1">Choose size/variant</div>
            <div className="flex gap-2 flex-wrap">
                {p.sizes.map((s) => (
                <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={
                    "rounded-full border px-3 py-1 text-sm " +
                    (size === s ? "border-teal-600 text-teal-700" : "border-slate-300 text-slate-700 hover:border-slate-400")
                    }
                >
                    {s}
                </button>
                ))}
            </div>
            </div>
        )}

        <button onClick={onAdd} className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-white font-medium hover:bg-teal-500">
            Add to Cart
        </button>

        <p className="mt-6 text-slate-700 leading-relaxed">{p.description}</p>
        </div>
    </div>
    );
}
