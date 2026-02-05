const db = require("../config/db");

const Category = {
  async create({ name, description }) {
    const query = `
            INSERT INTO "Category" (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `;
    const result = await db.query(query, [name, description || null]);
    return result.rows[0];
  },

  async findAll() {
    const query = `
            SELECT * FROM "Category"
            WHERE "isActive" = true
            ORDER BY name;
        `;
    const result = await db.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = `
            SELECT * FROM "Category"
            WHERE id = $1;
        `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async toggleActive(id, isActive) {
    const query = `
            UPDATE "Category"
            SET "isActive" = $1,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;
    const result = await db.query(query, [isActive, id]);
    return result.rows[0];
  },
};
module.exports = Category;
