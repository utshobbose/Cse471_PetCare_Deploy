import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = async (email, password) => {
    // const { data } = await api.post("/api/login", { email, password });
    const { data } = await api.post("/login", { email, password });
    if (!data?.success || !data?.token) throw new Error(data?.message || "Login failed");
    localStorage.setItem("token", data.token);
    setToken(data.token);
    };

    const register = async (name, email, password) => {
    // const { data } = await api.post("/api/register", { name, email, password });
    const { data } = await api.post("/register", { name, email, password });
    if (!data?.success || !data?.token) throw new Error(data?.message || "Register failed");
    localStorage.setItem("token", data.token);
    setToken(data.token);
    };

    const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    };

    const value = useMemo(() => ({ token, isAuthed: !!token, login, register, logout }), [token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    export function useAuth() {
    return useContext(AuthContext);
}
