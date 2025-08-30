export default function AboutPage() {
  return (
    <section className="relative bg-gradient-to-b from-teal-50 to-white py-20">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12 grid gap-12 lg:grid-cols-2 items-center">
        
        {/* Left: Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 leading-tight">
            About <span className="text-teal-600">PetCare</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            PetCare is an advanced platform that offers pet care services,
            grooming, training, adoption, veterinary support, and much more 
            to help pet lovers manage and care for their pets.
          </p>

          {/* Features list */}
          <ul className="mt-6 space-y-3 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              Grooming, Training & Adoption
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              Veterinary Support & Health Tracking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              Lost Pet Alerts & Emergency Help
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              Online Shop for Pet Products
            </li>
          </ul>

          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1080&auto=format&fit=crop"
            alt="Happy pets"
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
