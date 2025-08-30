import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function useQueryParam(key, initial = "") {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [value, setValue] = useState(params.get(key) ?? initial);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (value) p.set(key, value);
    else p.delete(key);
    navigate({ search: p.toString() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // search state (synced to ?q=)
  const [q, setQ] = useQueryParam("q", "");
  const [debouncedQ, setDebouncedQ] = useState(q);

  // NEW: sort state (synced to ?sort=). Default = relevance (no sorting)
  const [sort, setSort] = useQueryParam("sort", "relevance");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/products/getProducts");
        setItems(data?.products || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedQ) return items;

    const words = debouncedQ
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const containsAll = (haystack, needles) =>
      needles.every((w) => haystack.includes(w));

    return items.filter((p) => {
      const hay = [p.name, p.category, p.subCategory]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return containsAll(hay, words);
    });
  }, [items, debouncedQ]);

  // NEW: apply sorting on top of filtered
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "price_desc": // Price: High → Low
        arr.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "price_asc": // (optional) Low → High
        arr.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      default:
        // relevance: do nothing
        break;
    }
    return arr;
  }, [filtered, sort]);

  if (loading) return <div className="pt-14 p-6">Loading products…</div>;

  return (
    <div className="pt-14 mx-auto max-w-screen-2xl p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Pet Shop</h1>

        <div className="flex items-center gap-2 w-full md:w-[480px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products (e.g., dog food, toys, cat litter)…"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50"
              title="Clear"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setDebouncedQ(q.trim())}
            className="rounded-lg bg-teal-600 px-4 py-2 text-white font-medium hover:bg-teal-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* NEW: results + sort control */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "result" : "results"}
          {debouncedQ ? (
            <>
              {" "}
              for <span className="font-medium">“{debouncedQ}”</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="price_asc">Price: Low → High</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl bg-white ring-1 ring-slate-200 p-8 text-center text-slate-600">
          No products found. Try different keywords.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sorted.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="group rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden hover:shadow-md"
            >
              <div className="aspect-square bg-slate-100">
                <img
                  src={p.image?.[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="text-sm text-slate-500">{p.category}</div>
                <div className="font-semibold line-clamp-2">{p.name}</div>
                <div className="mt-1 text-teal-700 font-bold">
                  ₹{Number(p.price).toFixed(2)}
                </div>
                {p.bestseller ? (
                  <span className="mt-2 inline-block rounded bg-amber-100 text-amber-800 px-2 py-[2px] text-xs">
                    Bestseller
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
