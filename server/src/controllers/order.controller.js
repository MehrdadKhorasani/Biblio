const db = require("../config/db");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const OrderStatusHistory = require("../models/orderStatusHistory.model");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createOrder = async (req, res) => {
  const client = await db.connect();

  try {
    const userId = req.user.id;
    const { items, note, phone, address, city, postalCode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    await client.query("BEGIN");

    let totalPrice = 0;
    const preparedItems = [];

    for (const item of items) {
      const bookResult = await client.query(
        `SELECT price, stock FROM "Book" WHERE id = $1`,
        [item.bookId],
      );

      if (bookResult.rows.length === 0) {
        throw new Error(`Book with id ${item.bookId} not found`);
      }

      const { price, stock } = bookResult.rows[0];

      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for book id ${item.bookId}`);
      }

      totalPrice += price * item.quantity;

      preparedItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: price,
      });
    }

    const order = await Order.create(
      {
        userId,
        totalPrice,
        note: note || null,
        phone,
        address,
        city,
        postalCode,
      },
      client,
    );

    for (const item of preparedItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          bookId: item.bookId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
        client,
      );
    }

    for (const item of preparedItems) {
      const stockUpdateResult = await client.query(
        `UPDATE "Book" 
          SET stock = stock - $1,
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $2 AND stock >= $1
          RETURNING stock`,
        [item.quantity, item.bookId],
      );

      if (stockUpdateResult.rowCount === 0) {
        throw new Error(`Not enough stock for book ${item.bookId}`);
      }
    }
    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findByUserId(userId);

    for (const order of orders) {
      const items = await OrderItem.findByOrderId(order.id);
      order.items = items;
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  const client = await db.connect();

  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    await client.query("BEGIN");

    const orderResult = await client.query(
      `SELECT * FROM "Order" WHERE id = $1 AND "userId" = $2`,
      [orderId, userId],
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows[0];

    if (!order || order.status.trim().toLowerCase() !== "pending") {
      throw new Error("Only pending orders can be cancelled");
    }

    const itemsResult = await client.query(
      `SELECT * FROM "OrderItem" WHERE "orderId" = $1`,
      [orderId],
    );

    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE "Book" 
            SET stock = stock + $1,
              "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $2`,
        [item.quantity, item.bookId],
      );
    }

    await client.query(
      `UPDATE "Order" 
          SET status = 'cancelled',
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $1`,
      [orderId],
    );
    await client.query("COMMIT");

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error cancelling order:", error);
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

const payOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be paid" });
    }

    const updatedOrder = await Order.updateStatus(orderId, "paid", null);

    await OrderStatusHistory.create({
      orderId: orderId,
      oldStatus: order.status,
      newStatus: "paid",
      changedBy: userId,
    });

    res.status(200).json({
      message: "Order paid successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error paying order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.findAll();

    for (const order of orders) {
      const items = await OrderItem.findByOrderId(order.id);
      order.items = items;
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const adminId = req.user.id;

    const statusFlow = {
      pending: ["paid"],
      paid: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!statusFlow[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    await OrderStatusHistory.create({
      orderId,
      oldStatus: order.status,
      newStatus: status,
      changedBy: adminId,
    });

    const updatedOrder = await Order.updateStatus(orderId, status, adminId);

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.*,
        u."firstName",
        u."lastName",
        oi.id as "orderItemId",
        oi."bookId",
        oi.quantity,
        oi."unitPrice"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "User" u ON o."userId" = u.id
    `;

    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`o.status = $${values.length}`);
    }

    if (userId) {
      values.push(userId);
      conditions.push(`o."userId" = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    values.push(limit);
    values.push(offset);
    query += ` ORDER BY o."createdAt" DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await db.query(query, values);

    const ordersMap = {};

    for (const row of result.rows) {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.userId,
          userName: row.userName,
          status: row.status,
          totalPrice: row.totalPrice,
          note: row.note,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          items: [],
        };
      }

      if (row.orderItemId) {
        ordersMap[row.id].items.push({
          id: row.orderItemId,
          bookId: row.bookId,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
        });
      }
    }

    const orders = Object.values(ordersMap);

    let countQuery = `SELECT COUNT(*) FROM "Order" o`;
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }
    const countResult = await db.query(
      countQuery,
      values.slice(0, values.length - 2),
    );
    const total = parseInt(countResult.rows[0].count, 10);

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOrderStatusHistory = async (req, res) => {
  try {
    const orderId = req.params.id;

    const history = await OrderStatusHistory.findByOrderId(orderId);

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching order status history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId && req.user.roleId === 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const items = await OrderItem.findByOrderId(orderId);
    order.items = items;

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getUserOrders,
  cancelOrder,
  payOrder,
  getAllOrdersAdmin,
  updateOrderStatus,
  getAdminOrders,
  getOrderStatusHistory,
  getOrderById,
};
