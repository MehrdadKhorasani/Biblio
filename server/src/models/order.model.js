const db = require("../config/db");

const Order = {
  async create({ userId, totalPrice, note }) {
    const query = `
            INSERT INTO "Order"
            ("userId", "totalPrice", note)
            VALUES ($1,$2,$3)
            RETURNING *;
        `;

    const values = [userId, totalPrice, note || null];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
            SELECT *
            FROM "Order"
            WHERE id = $1;
        `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findByUser(userId) {
    const query = `
            SELECT *
            FROM "Order"
            WHERE "userId" = $1
            ORDER BY "createdAt" DESC;
        `;

    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async findAll() {
    const query = `
            SELECT * FROM "Order"
            ORDER BY "createdAt" DESC;
        `;

    const result = await db.query(query);
    return result.rows;
  },

  async updateStatus(orderId, status, handledBy) {
    const query = `
            UPDATE "Order" SET
                status = $1,
                "handledBy" = $2,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *;
        `;

    const values = [status, handledBy || null, orderId];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = `
            SELECT id, status, "totalPrice", note, "createdAt", "updatedAt"
            FROM "Order"
            WHERE "userId" = $1
            ORDER BY "createdAt" DESC;
        `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async cancelOrder(id) {
    await db.query(
      `
            UPDATE "Order" SET
                status = 'canceled',
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $1;
        `,
      [id],
    );
  },

  async findByStatus(status) {
    const result = await db.query(
      `
    SELECT *
    FROM "Order"
    WHERE status = $1
    ORDER BY "createdAt" DESC
    `,
      [status],
    );

    return result.rows;
  },
};

module.exports = Order;
