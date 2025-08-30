import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../services/api";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
    //   const res = await axios.post("/api/login", { email, password });
    const res = await api.post("/login", { email, password });

      if (res.data?.success && res.data?.token) {
        // Store token in the same key used by your navbar/middleware
        localStorage.setItem("token", res.data.token);
        // (Optional) store a display name if your backend ever returns it
        // localStorage.setItem("userName", res.data?.name ?? "");

        navigate("/"); // go home (or /shop, /dashboard, etc.)
      } else {
        setError(res.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome Back</h1>
          <p className="mt-4 text-gray-500">
            Sign in to manage pets, orders, and more.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="sr-only">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div>
            <label className="sr-only">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No account?{" "}
              <a className="underline" href="/register" target="_blank">
                Register
              </a>
            </p>
            <button
              type="submit"
              className="inline-block rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>

      <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?q=80&w=1080&auto=format&fit=crop"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
