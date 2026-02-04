const db = require("../config/db");

const User = {
  async create({ firstName, lastName, email, passwordHash, roleId }) {
    const query = `
            INSERT INTO "User" 
            ("firstName", "lastName", email, "passwordHash", "roleId")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, "firstName", "lastName", email, "passwordHash", "roleId", "createdAt", "updatedAt";
        `;
    const values = [firstName, lastName, email, passwordHash, roleId];

    const result = await db.query(query, values);
    const row = result.rows[0];

    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      passwordHash: row.passwordHash,
      roleId: row.roleId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  async findByEmail(email) {
    if (!email) return null;
    const query = `
            SELECT * FROM "User"
            WHERE email = $1
            LIMIT 1;
        `;

    try {
      const result = await db.query(query, [email]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        passwordHash: row.passwordHash,
        roleId: row.roleId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    } catch (error) {
      console.error("findByEmail query error:", error.message);
      throw error;
    }
  },

  async findById(id) {
    const query = `
            SELECT * FROM "User"
            WHERE id = $1;
        `;
    const result = await db.query(query, [id]);
    if (!result.rows.length) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      passwordHash: row.passwordHash,
      roleId: row.roleId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  async findAll() {
    const query = `
            SELECT * FROM "User"
            ORDER BY id;
        `;
    const result = await db.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      passwordHash: row.passwordHash,
      roleId: row.roleId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  },
};

module.exports = User;
