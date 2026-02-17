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

    // 1️⃣ محاسبه totalPrice و آماده سازی آیتم‌ها
    let totalPrice = 0;
    const preparedItems = [];

    for (const item of items) {
      const { rows } = await client.query(
        `SELECT price, stock FROM "Book" WHERE id = $1`,
        [item.bookId],
      );

      if (rows.length === 0) {
        throw new Error(`Book with id ${item.bookId} not found`);
      }

      const { price, stock } = rows[0];

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

    // 2️⃣ ایجاد سفارش داخل تراکنش
    const orderQuery = `
      INSERT INTO "Order"
      ("userId", "totalPrice", note, phone, address, city, "postalCode")
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;
    const orderValues = [
      userId,
      totalPrice,
      note || null,
      phone,
      address,
      city,
      postalCode,
    ];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    // 3️⃣ اضافه کردن آیتم‌ها با client همان تراکنش
    for (const item of preparedItems) {
      const itemQuery = `
        INSERT INTO "OrderItem" ("orderId", "bookId", quantity, "unitPrice")
        VALUES ($1,$2,$3,$4);
      `;
      await client.query(itemQuery, [
        order.id,
        item.bookId,
        item.quantity,
        item.unitPrice,
      ]);
    }

    // 4️⃣ کم کردن موجودی کتاب‌ها
    for (const item of preparedItems) {
      const updateStock = `
        UPDATE "Book"
        SET stock = stock - $1,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $2 AND stock >= $1
      `;
      const stockResult = await client.query(updateStock, [
        item.quantity,
        item.bookId,
      ]);

      if (stockResult.rowCount === 0) {
        throw new Error(`Not enough stock for book ${item.bookId}`);
      }
    }

    // 5️⃣ COMMIT تراکنش
    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    return res.status(400).json({ message: error.message });
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

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let query = `
      SELECT 
        o.*,
        u."firstName",
        u."lastName",
        oi.id as "orderItemId",
        oi."bookId",
        b.title AS "bookTitle",
        oi.quantity,
        oi."unitPrice"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "User" u ON o."userId" = u.id
      LEFT JOIN "Book" b ON oi."bookId" = b.id
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

    values.push(limitNumber);
    values.push(offset);

    query += `
      ORDER BY o."createdAt" DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const result = await db.query(query, values);

    const ordersMap = {};

    for (const row of result.rows) {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.userId,
          user: {
            id: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
          },
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
          book: {
            id: row.bookId,
            title: row.bookTitle,
          },
          quantity: row.quantity,
          unitPrice: row.unitPrice,
        });
      }
    }

    const orders = Object.values(ordersMap);

    // -------- Count Query --------
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
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
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

    const query = `
      SELECT 
        o.*,
        u."firstName",
        u."lastName",
        u.email,
        oi.id as "orderItemId",
        oi."bookId",
        b.title AS "bookTitle",
        oi.quantity,
        oi."unitPrice"
      FROM "Order" o
      LEFT JOIN "User" u ON o."userId" = u.id
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Book" b ON oi."bookId" = b.id
      WHERE o.id = $1
    `;

    const result = await db.query(query, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const rows = result.rows;

    const order = {
      id: rows[0].id,
      userId: rows[0].userId,
      status: rows[0].status,
      totalPrice: rows[0].totalPrice,
      note: rows[0].note,
      phone: rows[0].phone,
      address: rows[0].address,
      city: rows[0].city,
      postalCode: rows[0].postalCode,
      createdAt: rows[0].createdAt,
      updatedAt: rows[0].updatedAt,
      user: {
        id: rows[0].userId,
        firstName: rows[0].firstName,
        lastName: rows[0].lastName,
        email: rows[0].email,
      },
      items: [],
    };

    for (const row of rows) {
      if (row.orderItemId) {
        order.items.push({
          id: row.orderItemId,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          book: {
            id: row.bookId,
            title: row.bookTitle,
          },
        });
      }
    }

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
