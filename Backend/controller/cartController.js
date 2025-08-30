const userModel = require('../model/userModel'); 

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: 'Added To Cart' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const cartData = userData.cartData || {};
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: 'Cart Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, updateCart, getUserCart };
