const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    name: String, size: String, price: Number, quantity: Number, subtotal: Number,
    }],
    amount: { type: Number, required: true },
    shippingAddress: { type: mongoose.Schema.Types.Mixed, default: null },
    note: { type: String, default: '' },
    status: { type: String, default: 'PAID', enum: ['Order Placed','PAID','Shipped','Delivered','Cancelled'] },
    payment: {
    provider: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true },
    },
}, { timestamps: true });


module.exports =
    mongoose.models.order || mongoose.model('order', orderSchema);
