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
        tokenVersion: row.tokenVersion,
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
    return result.rows[0];
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

  async findAllForManager(search) {
    let query = `
    SELECT
      id,
      "firstName",
      "lastName",
      email,
      "roleId",
      "isActive",
      "createdAt",
      "updatedAt"
    FROM "User"
    WHERE "roleId" IN (1, 2)
  `;
    const values = [];

    if (typeof search === "string" && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      query += `
      AND (
        LOWER("firstName" || ' ' || "lastName") LIKE LOWER($${values.length})
      )
    `;
    }

    query += ` ORDER BY id ASC`;

    const result = await db.query(query, values);
    return result.rows;
  },

  async findAllForAdmin(search) {
    let query = `
    SELECT
      id,
      "firstName",
      "lastName",
      email,
      "roleId",
      "isActive",
      "createdAt",
      "updatedAt"
    FROM "User"
    WHERE "roleId" = 1
  `;
    const values = [];

    if (typeof search === "string" && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      query += `
      AND (
        LOWER("firstName" || ' ' || "lastName") LIKE LOWER($${values.length})
      )
    `;
    }

    query += ` ORDER BY id ASC`;

    const result = await db.query(query, values);
    return result.rows;
  },

  async findAllAdmins(search) {
    let query = `
    SELECT
      id,
      "firstName",
      "lastName",
      email,
      "roleId",
      "isActive",
      "createdAt",
      "updatedAt"
    FROM "User"
    WHERE "roleId" = 2
  `;
    const values = [];

    if (typeof search === "string" && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      query += `
      AND (
        LOWER("firstName" || ' ' || "lastName") LIKE LOWER($${values.length})
      )
    `;
    }

    query += ` ORDER BY id ASC`;

    const result = await db.query(query, values);
    return result.rows;
  },

  async updateActiveStatus(id, isActive) {
    const result = await db.query(
      `
      UPDATE "User"
      SET "isActive" = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, "firstName", "lastName", email, "roleId", "isActive", "updatedAt";
    `,
      [isActive, id],
    );
    return result.rows[0];
  },

  async updatePassword(id, passwordHash) {
    const result = await db.query(
      `
    UPDATE "User"
    SET "passwordHash" = $1, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id;
    `,
      [passwordHash, id],
    );

    return result.rows[0];
  },

  async updatedById(id, updates) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
      fields.push(`"${key}" = $${index}`);
      values.push(updates[key]);
      index++;
    }

    fields.push(`"updatedAt" = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE "User"
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, "firstName", "lastName", email, "roleId", "isActive", "createdAt", "updatedAt";
    `;

    values.push(id);

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async increamentTokenVersion(userId) {
    const result = await db.query(
      `UPDATE "User"
      SET "tokenVersion" = "tokenVersion" + 1
      WHERE id = $1
      RETURNING *`,
      [userId],
    );
  },
};

module.exports = User;
