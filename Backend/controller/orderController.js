const orderModel = require('../model/orderModel');
const userModel = require('../model/userModel');
const Stripe = require('stripe');
const Razorpay = require('razorpay');

const currency = 'inr';
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = await new orderModel({
      userId, items, address, amount,
      paymentMethod: 'COD', payment: false, date: Date.now(),
    }).save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: 'Order Placed', orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const origin = req.headers.origin || req.headers.referer || '';

    const newOrder = await new orderModel({
      userId, items, address, amount,
      paymentMethod: 'Stripe', payment: false, date: Date.now(),
    }).save();

    const line_items = items.map((item) => ({
      price_data: { currency, product_data: { name: item.name }, unit_amount: item.price * 100 },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: { currency, product_data: { name: 'Delivery Charges' }, unit_amount: deliveryCharge * 100 },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = await new orderModel({
      userId, items, address, amount,
      paymentMethod: 'Razorpay', payment: false, date: Date.now(),
    }).save();

    const options = { amount: amount * 100, currency: currency.toUpperCase(), receipt: newOrder._id.toString() };
    razorpayInstance.orders.create(options, (error, order) => {
      if (error) return res.json({ success: false, message: error });
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      res.json({ success: false, message: 'Payment Failed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
