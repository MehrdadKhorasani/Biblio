const db = require("../config/db");

const UserActivityLog = {
  async create({ actorId, targetUserId, action, details }) {
    const query = `
      INSERT INTO "UserActivityLog"
      ("actorId", "targetUserId", action, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [actorId, targetUserId, action, details || null];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT *
      FROM "UserActivityLog"
      ORDER BY "createdAt" DESC
    `;
    const result = await db.query(query);
    return result.rows;
  },
};

module.exports = UserActivityLog;
