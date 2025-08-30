import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar({ user, onLogout }) {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : null;

  const isLoggedIn = !!(user?.name || user?.username || storedToken);
  const displayName = user?.username || user?.name || storedName;

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    } catch {}
    if (onLogout) onLogout();
    window.location.href = "/login";
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (!storedToken) {
        setCartCount(0);
        return;
      }
      try {
        const { data } = await api.post("/cart/get", {});
        if (data?.success && data?.cartData) {
          const cd = data.cartData;
          let total = 0;
          for (const itemId in cd) {
            const sizes = cd[itemId] || {};
            for (const size in sizes) total += Number(sizes[size] || 0);
          }
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        console.error("Cart fetch failed:", e);
        setCartCount(0);
      }
    };

    fetchCart();
  }, [storedToken]);

  const buttonList = [
    { id: 0, name: "Pet Profiles", href: "/pets" },
    { id: 1, name: "Daily Routine", href: "/routine" },
    { id: 2, name: "Gallery", href: "/gallery" },
    { id: 3, name: "Care Notes", href: "/notes" },
    { id: 4, name: "Health", href: "/health" },
    { id: 5, name: "Shop", href: "/shop" },
    { id: 6, name: "Lost Pet Alerts", href: "/alerts" },
    { id: 7, name: "Emergency", href: "/emergency" },
    { id: 8, name: "Diet Tracker", href: "/diet" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="/">
              <span className="sr-only">Home</span>
              <svg
                className="h-8"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                {buttonList.map((button) => (
                  <li key={button.id}>
                    <a
                      href={button.href}
                      className="text-teal-700 hover:text-teal-800 transition"
                    >
                      {button.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {/* Cart (gray) */}
              <a
                href="/cart"
                title="Cart"
                className="relative rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-700"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-teal-600 px-1.5 py-[2px] text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </a>

              {isLoggedIn ? (
                <div className="sm:flex sm:gap-4 justify-center items-center">
                  <span className="text-teal-800">Hi{displayName ? `, ${displayName}` : ""}</span>
                  <button
                    onClick={logout}
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-teal-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="sm:flex sm:gap-4">
                  <a
                    href="/login"
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-teal-500"
                  >
                    Login
                  </a>

                  {/* Register (gray) */}
                  <a
                    href="/register"
                    className="rounded-md bg-gray-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-gray-700"
                  >
                    Register
                  </a>
                </div>
              )}

              <div className="block md:hidden">
                <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
