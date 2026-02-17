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

  async findDetailedById(id) {
    const query = `
    SELECT 
      o.id,
      o.status,
      o."totalPrice",
      o.note,
      o.phone,
      o.address,
      o.city,
      o."postalCode",
      o."createdAt",
      o."updatedAt",

      u.id as "userId",
      u."firstName",
      u."lastName",
      u.email,

      oi.id as "orderItemId",
      oi.quantity,
      oi."unitPrice",

      b.id as "bookId",
      b.title

    FROM "Order" o
    LEFT JOIN "User" u
      ON u.id = o."userId"
    LEFT JOIN "OrderItem" oi
      ON oi."orderId" = o.id
    LEFT JOIN "Book" b
      ON b.id = oi."bookId"

    WHERE o.id = $1
  `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) return null;

    const order = {
      id: result.rows[0].id,
      status: result.rows[0].status,
      totalPrice: result.rows[0].totalPrice,
      note: result.rows[0].note,
      phone: result.rows[0].phone,
      address: result.rows[0].address,
      city: result.rows[0].city,
      postalCode: result.rows[0].postalCode,
      createdAt: result.rows[0].createdAt,
      updatedAt: result.rows[0].updatedAt,

      user: {
        id: result.rows[0].userId,
        firstName: result.rows[0].firstName,
        lastName: result.rows[0].lastName,
        email: result.rows[0].email,
      },

      items: [],
    };

    for (const row of result.rows) {
      if (row.orderItemId) {
        order.items.push({
          id: row.orderItemId,
          bookId: row.bookId,
          title: row.title,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
        });
      }
    }

    return order;
  },
};

module.exports = Order;
