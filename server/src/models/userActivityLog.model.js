const db = require("../config/db");

const UserActivityLog = {
  async create({ actorId, targetUserId, action, details }) {
    const query = `
      INSERT INTO "UserActivityLog"
      ("actorId", "targetUserId", action, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [actorId, targetUserId || null, action, details || null];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll({ actorId, targetUserId, page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];

    if (actorId) {
      values.push(actorId);
      conditions.push(`ual."actorId" = $${values.length}`);
    }

    if (targetUserId) {
      values.push(targetUserId);
      conditions.push(`ual."targetUserId" = $${values.length}`);
    }

    let query = `
      SELECT
        ual.*,
        actor."firstName" AS "actorFirstName",
        actor."lastName" AS "actorLastName",
        target."firstName" AS "targetFirstName",
        target."lastName" AS "targetLastName"
      FROM "UserActivityLog" ual
      LEFT JOIN "User" actor ON actor.id = ual."actorId"
      LEFT JOIN "User" target ON target.id = ual."targetUserId"
    `;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY ual."createdAt" DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);

    return result.rows.map((row) => ({
      id: row.id,
      actorId: row.actorId,
      actorName: row.actorFirstName
        ? `${row.actorFirstName} ${row.actorLastName}`
        : "سیستم",
      targetUserId: row.targetUserId,
      targetUserName: row.targetFirstName
        ? `${row.targetFirstName} ${row.targetLastName}`
        : "-",
      action: row.action,
      details: row.details,
      createdAt: row.createdAt,
    }));
  },
};

module.exports = UserActivityLog;
