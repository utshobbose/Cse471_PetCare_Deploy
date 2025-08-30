import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
// Pages
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/homepage";
import AboutPage from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";

function App() {
  const location = useLocation();

  // hide navbar on login/register
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const aboutRoute = <Route path="/about" element={<AboutPage />} />;
  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {aboutRoute}
          <Route path="/contact" element={<ContactPage />} />

          {/* placeholders */}
          <Route path="/alerts" element={<div className="p-6">Lost Pet Alerts (todo)</div>} />
          <Route path="/diet" element={<div className="p-6">Diet Tracker (todo)</div>} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default App;
