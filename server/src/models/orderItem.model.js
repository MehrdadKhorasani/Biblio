const db = require("../config/db");

const OrderItem = {
  async create({ orderId, bookId, quantity, unitPrice }) {
    const query = `
      INSERT INTO "OrderItem" ("orderId", "bookId", quantity, "unitPrice")
      VALUES ($1, $2, $3, $4)
      RETURNING id, "orderId", "bookId", quantity, "unitPrice";
    `;

    const values = [orderId, bookId, quantity, unitPrice];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error inserting OrderItem:", err);
      throw err;
    }
  },

  async findByOrder(orderId) {
    const query = `
      SELECT id, "bookId", quantity, "unitPrice"
      FROM "OrderItem" WHERE "orderId" = $1;
    `;

    try {
      const result = await db.query(query, [orderId]);
      return result.rows;
    } catch (err) {
      console.error("Error fetching OrderItems:", err);
      throw err;
    }
  },

  async findByOrderId(orderId) {
    const query = `
      SELECT 
        oi."bookId",
        b.title,
        oi.quantity,
        oi."unitPrice"
      FROM "OrderItem" AS oi
      INNER JOIN "Book" AS b ON b.id = oi."bookId"
      WHERE oi."orderId" = $1;
    `;
    const result = await db.query(query, [orderId]);
    return result.rows;
  },

  async delete(id) {
    const query = `
      DELETE FROM "OrderItem" WHERE id = $1 RETURNING *;
    `;

    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error deleting OrderItem:", err);
      throw err;
    }
  },
};

module.exports = OrderItem;
