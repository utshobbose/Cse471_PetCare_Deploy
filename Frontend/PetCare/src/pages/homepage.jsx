
// import Navbar from "../components/navbar";

// function HomePage() {
//     return (
//     <>
//         {/* <Navbar /> */}
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Welcome to PetCare</h1>
//             <p>Your one-stop solution for all your pet care needs.</p>
//         </div>
//     </>
//     );
//     }

// export default HomePage;
export default function HomePage() {
  // Royalty-free kitten image; replace with your own asset anytime
  const heroBg =
    "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=1920&auto=format&fit=crop";

  return (
    <section
      className="relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* subtle dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto max-w-screen-2xl px-6 py-24 md:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            <span className="block">PET MANAGEMENT</span>
            <span className="block mt-2">SYSTEM</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
            Make your pets happy. Our Pet Management System offers pet care, grooming, training, adoption,
            veterinary support, products, and customer service for pet lovers.
          </p>

          <div className="mt-8">
            <a
              href="/about"
              className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
