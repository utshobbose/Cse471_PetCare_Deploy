// seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');

const productModel = require('./model/ProductModel'); // make sure this path/export is CommonJS
const userModel    = require('./model/userModel');     // matches your file above

(async () => {
  try {
    // 1) Connect once
    await connectDB();
    console.log('MongoDB connected');

    // 2) Clear collections (optional)
    await productModel.deleteMany({});
    await userModel.deleteMany({});
    console.log('Cleared products & users');

    // 3) Seed products
    const now = Date.now();
    const products = await productModel.insertMany([
      {
        name: 'Premium Dry Dog Food (Chicken & Rice)',
        description:
          'Complete and balanced dry food for adult dogs. Enriched with vitamins and omega-3 for a shiny coat.',
        price: 1299,
        image: [
          'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=640',
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=640'
        ],
        category: 'Food',
        subCategory: 'Dog Food',
        sizes: ['1kg', '3kg', '10kg'],
        bestseller: true,
        date: now
      },
      {
        name: 'Grain-Free Wet Cat Food (Salmon)',
        description:
          'High-protein, grain-free wet food with real salmon. Ideal for sensitive stomachs.',
        price: 249,
        image: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=640'],
        category: 'Food',
        subCategory: 'Cat Food',
        sizes: ['85g', '400g'],
        bestseller: false,
        date: now
      },
      {
        name: 'Durable Rubber Chew Toy (Dog)',
        description:
          'Tough chew toy to reduce boredom and support dental health. Dishwasher safe.',
        price: 499,
        image: ['https://images.unsplash.com/photo-1596495578065-6e0763fa6a5a?w=640'],
        category: 'Toys',
        subCategory: 'Dog Toys',
        sizes: ['S', 'M', 'L'],
        bestseller: true,
        date: now
      },
      {
        name: 'Interactive Feather Wand (Cat)',
        description:
          'Keep your cat active with this teaser wand. Replaceable feather tip.',
        price: 299,
        image: ['https://images.unsplash.com/photo-1624439117846-10be0f631ee4?w=640'],
        category: 'Toys',
        subCategory: 'Cat Toys',
        sizes: ['Standard'],
        bestseller: true,
        date: now
      },
      {
        name: 'Adjustable Nylon Collar (Reflective)',
        description:
          'Lightweight and reflective collar with quick-release buckle. ID ring included.',
        price: 399,
        image: ['https://images.unsplash.com/photo-1534361960057-19889db9621e?w=640'],
        category: 'Accessories',
        subCategory: 'Collars',
        sizes: ['XS', 'S', 'M', 'L'],
        bestseller: false,
        date: now
      },
      {
        name: 'Stainless Steel Non-Slip Bowl',
        description:
          'Rust-resistant pet bowl with silicone base to prevent slipping.',
        price: 349,
        image: ['https://images.unsplash.com/photo-1546443046-ed1ce6ffd1db?w=640'],
        category: 'Accessories',
        subCategory: 'Bowls',
        sizes: ['350ml', '700ml', '1000ml'],
        bestseller: false,
        date: now
      },
      {
        name: 'Clumping Cat Litter (Unscented)',
        description:
          'Low-dust, fast-clumping litter for easier scooping and better odor control.',
        price: 799,
        image: ['https://images.unsplash.com/photo-1612536053192-5ffabf74f4ab?w=640'],
        category: 'Grooming',
        subCategory: 'Litter',
        sizes: ['5kg', '10kg'],
        bestseller: true,
        date: now
      },
      {
        name: 'Pet Bed (Orthopedic Memory Foam)',
        description:
          'Supportive memory foam bed with washable cover. Great for senior pets.',
        price: 2499,
        image: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=640'],
        category: 'Beds',
        subCategory: 'Dog Beds',
        sizes: ['S', 'M', 'L', 'XL'],
        bestseller: true,
        date: now
      }
    ]);
    console.log(`Inserted ${products.length} products`);

    // 4) Seed a demo user (uses 'name', not 'username')
    const hashed = await bcrypt.hash('password123', 10);
    await userModel.create({
      name: 'Demo Customer',
      email: 'demo@petcare.test',
      password: hashed,
    });
    console.log('Demo user created: demo@petcare.test / password123');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
