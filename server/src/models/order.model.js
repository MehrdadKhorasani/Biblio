const db = require("../config/db");

const Order = {
  async create(
    { userId, totalPrice, note, phone, address, city, postalCode },
    client,
  ) {
    const query = `
            INSERT INTO "Order"
            ("userId", "totalPrice", note, phone, address, city, "postalCode")
            VALUES ($1,$2,$3, $4, $5, $6, $7)
            RETURNING *;
        `;

    const values = [
      userId,
      totalPrice,
      note || null,
      phone,
      address,
      city,
      postalCode,
    ];
    const executor = client || db;
    const result = await executor.query(query, values);
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
                status = 'cancelled',
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

  async findAllWithItems() {
    const query = `
    SELECT 
      o.*,
      oi.id as "orderItemId",
      oi."bookId",
      oi.quantity,
      oi."unitPrice"
    FROM "Order" o
    LEFT JOIN "OrderItem" oi
      ON o.id = oi."orderId"
    ORDER BY o."createdAt" DESC
  `;

    const result = await db.query(query);

    const ordersMap = {};

    for (const row of result.rows) {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.userId,
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

    return Object.values(ordersMap);
  },

  async findByStatusWithItems(status) {
    const query = `
    SELECT 
      o.*,
      oi.id as "orderItemId",
      oi."bookId",
      oi.quantity,
      oi."unitPrice"
    FROM "Order" o
    LEFT JOIN "OrderItem" oi
      ON o.id = oi."orderId"
    WHERE o.status = $1
    ORDER BY o."createdAt" DESC
  `;

    const result = await db.query(query, [status]);

    const ordersMap = {};

    for (const row of result.rows) {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.userId,
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

    return Object.values(ordersMap);
  },
};

module.exports = Order;
