import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler, validate } from '../utils/http.js';

const router = Router();
const SHIPPING_FEE = 60;

router.use(requireAuth);

// Prices always come from the database; the client only sends product ids and quantities.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, phone, address, items } = req.body;
    validate({
      name: !String(name || '').trim() ? 'The name field is required.' : '',
      phone: !String(phone || '').trim() ? 'The phone field is required.' : String(phone).length > 30 ? 'The phone may not be longer than 30 characters.' : '',
      address: !String(address || '').trim() ? 'The address field is required.' : '',
    });

    if (!Array.isArray(items) || items.length === 0) throw new HttpError(422, 'Your cart is empty.');

    const quantities = new Map();
    for (const item of items) {
      if (!mongoose.isValidObjectId(item?.productId)) throw new HttpError(422, 'Your cart contains an invalid product.');
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      quantities.set(String(item.productId), (quantities.get(String(item.productId)) || 0) + qty);
    }

    const products = await Product.find({ _id: { $in: [...quantities.keys()] }, isActive: true });
    if (products.length !== quantities.size) {
      throw new HttpError(422, 'Some products in your cart are no longer available.');
    }

    const orderItems = products.map((product) => ({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantities.get(String(product._id)),
    }));
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      customerName: name,
      phone,
      address,
      items: orderItems,
      subtotal,
      shipping: SHIPPING_FEE,
      totalPrice: subtotal + SHIPPING_FEE,
    });
    res.status(201).json({ order });
  }),
);

router.get(
  '/mine',
  asyncHandler(async (req, res) => {
    res.json({ orders: await Order.find({ user: req.user._id }).sort('-createdAt') });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new HttpError(404, 'Order not found.');
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      throw new HttpError(403, 'You cannot view this order.');
    }
    res.json({ order });
  }),
);

export default router;
