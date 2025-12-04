const Order = require('../models/Order');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: `Product not found: ${it.product}` });
      if (prod.quantity < it.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      }
      prod.quantity -= it.quantity;
      await prod.save();
      const price = prod.price;
      total += price * it.quantity;
      orderItems.push({ product: prod._id, name: prod.name, price, quantity: it.quantity });
    }

    const order = new Order({ user: req.user._id, items: orderItems, totalPrice: total, shippingAddress });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderHistoryForUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
