import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all fields.");
      return;
    }

    // Send email using EmailJS
    emailjs
      .send(
        "service_uiek2pn", // EmailJS Service ID (Create in EmailJS dashboard)
        "template_jev191q", // EmailJS Template ID (Create in EmailJS dashboard)
        formData, // The form data that you want to send
        "xM8khpaPLWAT4tx1C" // Your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response);
          setSuccess("Your message has been sent successfully!");
          setFormData({ name: "", email: "", message: "" }); // Clear the form
        },
        (err) => {
          console.log("FAILED...", err);
          setError("There was an issue sending your message.");
        }
      );
  };

  return (
    <section className="relative bg-gradient-to-b from-teal-50 to-white py-20">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12 grid gap-12 lg:grid-cols-2 items-center">
        
        {/* Left: Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 leading-tight">
            Contact <span className="text-teal-600">Us</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Have any questions? We would love to hear from you! Reach out to
            us through the form below, and we’ll get back to you as soon as
            possible.
          </p>

          {/* Success/Error messages */}
          {success && <p className="mt-4 text-green-600">{success}</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>

        {/* Right: Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-600">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border-gray-200 p-4 text-sm shadow-sm"
                type="text"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border-gray-200 p-4 text-sm shadow-sm"
                type="email"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-600">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border-gray-200 p-4 text-sm shadow-sm"
                rows="6"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
