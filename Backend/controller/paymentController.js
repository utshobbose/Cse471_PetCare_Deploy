const gateway = require("../lib/braintree");
const Product = require("../model/ProductModel");
const Order = require("../model/orderModel");

/**
 * GET /api/payment/client-token
 * auth: required (recommended)
 */
exports.getClientToken = async (req, res) => {
    try {
    const { clientToken } = await gateway.clientToken.generate({});
    res.json({ success: true, clientToken });
    } catch (err) {
    console.error("BT token error:", err);
    res.status(500).json({ success: false, message: "Token generation failed" });
    }
    };

    /**
     * POST /api/payment/checkout
     * body: { items: [{ productId, size, quantity }], address?, note? }
     * auth: required
     */
    exports.checkout = async (req, res) => {
    try {
    const { items = [], address, note, nonce } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!nonce) {
        return res.status(400).json({ success: false, message: "Payment nonce is required" });
    }

    // 1) Pull product data and re-calc totals on the server
    const ids = [...new Set(items.map(i => i.productId))];
    const products = await Product.find({ _id: { $in: ids } }).lean();

    const productMap = new Map(products.map(p => [String(p._id), p]));
    let amount = 0;
    const normalizedItems = [];

    for (const it of items) {
        const p = productMap.get(String(it.productId));
        if (!p) return res.status(400).json({ success: false, message: "Invalid product in cart" });
        const qty = Math.max(0, Number(it.quantity || 0));
        if (!qty) continue;

        const line = {
        productId: p._id,
        name: p.name,
        size: it.size || "",
        price: Number(p.price),      // authoritative price
        quantity: qty,
        subtotal: Number(p.price) * qty,
        };
        amount += line.subtotal;
        normalizedItems.push(line);
    }

    if (amount <= 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2) Create Braintree transaction
    const saleRequest = {
        amount: amount.toFixed(2),          // e.g. "42.00"
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
        // You can pass orderId/customer here if you want:
        // orderId: someString,
        // customer: { firstName, lastName, email, phone },
    };
    // server --> Braintree API call (external API)
    const result = await gateway.transaction.sale(saleRequest);
    if (!result?.success) {
        return res.status(400).json({
        success: false,
        message: result?.message || "Transaction failed",
        errors: result?.errors?.deepErrors?.() || [],
        });
    }

    const tx = result.transaction;

    // 3) Persist order in your DB
    const orderDoc = await Order.create({
        user: req.user?._id,                   // from auth middleware
        items: normalizedItems.map(l => ({
        product: l.productId,
        name: l.name,
        size: l.size,
        price: l.price,
        quantity: l.quantity,
        subtotal: l.subtotal,
        })),
        amount,
        payment: {
        provider: "braintree",
        transactionId: tx.id,
        status: tx.status,
        },
        shippingAddress: address || null,
        note: note || "",
        status: "PAID",                        // or your own enum
    });

    res.json({
        success: true,
        orderId: orderDoc._id,
        transaction: { id: tx.id, status: tx.status, amount: tx.amount },
    });
    } catch (err) {
    console.error("BT checkout error:", err);
    res.status(500).json({ success: false, message: "Checkout error" });
    }
};
