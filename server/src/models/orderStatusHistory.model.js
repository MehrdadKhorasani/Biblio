const db = require("../config/db");

const OrderStatusHistory = {
  async create({ orderId, oldStatus, newStatus, changedBy }) {
    const query = `
      INSERT INTO "OrderStatusHistory"
        ("orderId", "oldStatus", "newStatus", "changedBy")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [orderId, oldStatus, newStatus, changedBy];
    const result = await db.query(query, values);
    return result.rows[0];
  },
  async findByOrderId(orderId) {
    const query = `
    SELECT
      osh.id,
      osh."oldStatus",
      osh."newStatus",
      osh."createdAt",
      u."firstName",
      u."lastName"
    FROM "OrderStatusHistory" osh
    LEFT JOIN "User" u ON u.id = osh."changedBy"
    WHERE osh."orderId" = $1
    ORDER BY osh."createdAt" ASC;
  `;

    const result = await db.query(query, [orderId]);

    return result.rows.map((row) => ({
      id: row.id,
      oldStatus: row.oldStatus,
      newStatus: row.newStatus,
      createdAt: row.createdAt,
      changedBy:
        row.firstName && row.lastName
          ? `${row.firstName} ${row.lastName}`
          : "سیستم",
    }));
  },

  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const query = `
    SELECT
      osh.id,
      osh."orderId",
      osh."oldStatus",
      osh."newStatus",
      osh."createdAt",
      u."firstName",
      u."lastName"
    FROM "OrderStatusHistory" osh
    LEFT JOIN "User" u ON u.id = osh."changedBy"
    ORDER BY osh."createdAt" DESC
    LIMIT $1 OFFSET $2;
  `;

    const result = await db.query(query, [limit, offset]);

    return result.rows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      oldStatus: row.oldStatus,
      newStatus: row.newStatus,
      createdAt: row.createdAt,
      changedBy:
        row.firstName && row.lastName
          ? `${row.firstName} ${row.lastName}`
          : "سیستم",
    }));
  },
};

module.exports = OrderStatusHistory;
