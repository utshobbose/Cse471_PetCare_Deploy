import { useState } from "react";
// import axios from "axios";
import api from "../services/api";
    // dob: "",
    // height: "",
    // weight: "",
    //phoneNumber: "",

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    marketingAccept: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const name =
        formData.username?.trim() ||
        `${formData.firstName} ${formData.lastName}`.trim();

    //   const res = await axios.post("/api/register", {
    //     name,
    //     email: formData.email,
    //     password: formData.password,
    //   });
    const res = await api.post("/register", { name, email: formData.email, password: formData.password });
      if (res.data?.success) {
        setSuccess("Account created successfully!");
        setError("");
      } else {
        setError(res.data?.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://thattogspot.com/wp-content/uploads/2020/05/dog-photography-studio-in-a-small-space-SOOC-1-1024x683.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Join PetCare
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Your pets, organized in one place.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                  required
                />
              </div>
              {/* <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div> */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Password Confirmation
                </label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                  required
                />
              </div>

              {/* Optional extras retained in UI but not sent to backend yet */}
              {/* <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div> */}

              {error && <p className="col-span-6 text-sm text-red-600">{error}</p>}
              {success && <p className="col-span-6 text-sm text-green-600">{success}</p>}

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-teal-600 bg-teal-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-teal-600 focus:outline-none focus:ring active:text-teal-500"
                >
                  Register
                </button>
              </div>

              <p className="col-span-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-teal-600 hover:underline">
                  Login!
                </a>
              </p>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Register;
