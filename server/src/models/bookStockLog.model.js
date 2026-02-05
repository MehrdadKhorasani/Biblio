const db = require("../config/db");

const BookStockLog = {
  async create(log) {
    const query = `
      INSERT INTO "BookStockLog"
      ("bookId", "actorId", action, "oldStock", "newStock", note)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const values = [
      log.bookId,
      log.actorId,
      log.action,
      log.oldStock,
      log.newStock,
      log.note || null,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByBookId(bookId) {
    const query = `
      SELECT 
        l.*,
        u."firstName",
        u."lastName"
      FROM "BookStockLog" l
      JOIN "User" u ON u.id = l."actorId"
      WHERE l."bookId" = $1
      ORDER BY l."createdAt" DESC;
    `;

    const result = await db.query(query, [bookId]);
    return result.rows;
  },
};

module.exports = BookStockLog;
