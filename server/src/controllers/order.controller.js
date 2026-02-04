const db = require("../config/db");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

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
    const { items, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    await client.query("BEGIN");

    let totalPrice = 0;
    const preparedItems = [];

    for (const item of items) {
      const bookResult = await client.query(
        `SELECT price FROM "Book" WHERE id = $1`,
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
          SET status = 'Cancelled',
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

    const updatedOrder = await Order.updateStatus(orderId, "paid");

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

module.exports = {
  getAllOrders,
  createOrder,
  getUserOrders,
  cancelOrder,
  payOrder,
  getAllOrdersAdmin,
};
