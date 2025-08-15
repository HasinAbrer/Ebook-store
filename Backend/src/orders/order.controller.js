const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const {
      name,
      address = {},
      phone,
      productIds,
      totalPrice,
    } = req.body || {};
    const authEmail = req.user?.email;

    // Basic validation
    if (!name || !authEmail || !phone || !address?.city) {
      return res.status(400).json({ message: 'name, authenticated email, phone and address.city are required' });
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'productIds must be a non-empty array' });
    }

    const tp = Number(totalPrice);
    if (!Number.isFinite(tp) || tp <= 0) {
      return res.status(400).json({ message: 'totalPrice must be a positive number' });
    }

    const payload = {
      name,
      email: authEmail,
      address: {
        city: address.city,
        country: address.country || '',
        state: address.state || '',
        zipcode: address.zipcode || '',
      },
      phone: String(phone),
      productIds,
      totalPrice: tp,
    };

    const savedOrder = await Order.create(payload);
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order', error);
    const msg = error?.message?.includes('validation') ? 'Invalid order data' : 'Failed to create order';
    res.status(500).json({ message: msg, error: error?.message });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const {email} = req.params;
    const orders = await Order.find({email}).sort({createdAt: -1});
    if(!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus
};