const Order = require("../models/order.model");

const getSalesSummary = async (req, res) => {
  try {
    // همه سفارش‌های completed با آیتم‌ها
    const orders = await Order.findByStatusWithItems("delivered");

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProductsSold = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0,
    );
    const averageOrderValue = totalOrders
      ? Math.round(totalRevenue / totalOrders)
      : 0;

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalProductsSold,
      averageOrderValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDailySales = async (req, res) => {
  try {
    const orders = await Order.findByStatus("delivered");

    const dailyMap = {};

    orders.forEach((o) => {
      const day = o.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      dailyMap[day] = (dailyMap[day] || 0) + o.totalPrice;
    });

    const dailySales = Object.keys(dailyMap)
      .sort()
      .map((date) => ({ date, revenue: dailyMap[date] }));

    res.status(200).json(dailySales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSalesSummary, getDailySales };
