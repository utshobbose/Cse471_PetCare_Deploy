const { v2: cloudinary } = require('cloudinary');
const productModel = require('../model/ProductModel');

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // safe parse sizes
    let sizesValue = sizes;
    if (typeof sizes === 'string') {
      try {
        sizesValue = JSON.parse(sizes);
      } catch {
        return res.json({ success: false, message: 'Invalid sizes format' });
      }
    }

    const product = new productModel({
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true,
      sizes: sizesValue,
      image: imagesUrl,
      date: Date.now(),
    });

    await product.save();
    res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product (support DELETE /:id or body.id)
const removeProduct = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.json({ success: false, message: 'Product id is required' });

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single product (support GET /:id or body.productId)
const singleProduct = async (req, res) => {
  try {
    const productId = req.params.id || req.body.productId;
    if (!productId) return res.json({ success: false, message: 'productId is required' });

    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  // canonical names
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,

  // aliases so existing route imports still work
  getAllProducts: listProducts,
  createProduct: addProduct,
  deleteProduct: removeProduct,
  getProductById: singleProduct,
};
