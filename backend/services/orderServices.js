import Order from "../models/orderModel.js";

export const getAllOrders = async () => {
  try {
    return await Order.find().populate("user", "name");
  } catch (error) {
    throw new Error("Error al obtener las órdenes.");
  }
};

export const createOrder = async (orderData, userId) => {
  try {
    const newOrder = new Order({
      ...orderData,
      user: userId,
    });
    return await newOrder.save();
  } catch (error) {
    throw new Error("Error al crear la orden.");
  }
};

export const getOrderSummary = async () => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    return { users, orders, dailyOrders, productCategories };
  } catch (error) {
    throw new Error("Error al obtener el resumen.");
  }
};

export const getUserOrders = async (userId) => {
  try {
    return await Order.find({ user: userId });
  } catch (error) {
    throw new Error("Error al obtener las órdenes del usuario.");
  }
};

export const getOrderById = async (orderId) => {
  try {
    return await Order.findById(orderId);
  } catch (error) {
    throw new Error("Error al obtener la orden por ID.");
  }
};
