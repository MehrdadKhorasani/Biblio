const db = require("../config/db");

const Report = {
  async getOrderStatusReport({ userName, status, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];

    // 🔍 فیلتر نام کاربر سفارش‌دهنده
    if (userName) {
      values.push(`%${userName}%`);
      conditions.push(
        `(customer."firstName" || ' ' || customer."lastName") ILIKE $${values.length}`,
      );
    }

    // 🔍 فیلتر بر اساس وضعیت فعلی
    if (status) {
      values.push(status);
      conditions.push(`osh."newStatus" = $${values.length}`);
    }

    let query = `
      SELECT
        osh.id,
        osh."orderId",
        osh."oldStatus",
        osh."newStatus",
        osh."createdAt",

        customer.id AS "customerId",
        customer."firstName" AS "customerFirstName",
        customer."lastName" AS "customerLastName",

        actor."firstName" AS "actorFirstName",
        actor."lastName" AS "actorLastName"

      FROM "OrderStatusHistory" osh
      JOIN "Order" o ON o.id = osh."orderId"
      JOIN "User" customer ON customer.id = o."userId"
      LEFT JOIN "User" actor ON actor.id = osh."changedBy"
    `;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      ORDER BY osh."createdAt" DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);

    const result = await db.query(query, values);

    return result.rows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      oldStatus: row.oldStatus,
      newStatus: row.newStatus,
      createdAt: row.createdAt,
      customerName: `${row.customerFirstName} ${row.customerLastName}`,
      changedBy: row.actorFirstName
        ? `${row.actorFirstName} ${row.actorLastName}`
        : "سیستم",
    }));
  },
};

module.exports = Report;
