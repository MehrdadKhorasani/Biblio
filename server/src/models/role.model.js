const db = require("../config/db");

const Role = {
    async findAll() {
        const query = `
            SELECT id, name, description
            FROM "Role"
            ORDER BY id;
        `;

        const result = await db.query(query);
        return result.rows;
    },

    async findByName(name) {
        const query = `
            SELECT id, name
            FROM "Role"
            WHERE name = $1;
        `;

        const result = await db.query(query, [name]);
        return result.rows[0];
    }
};

module.exports = Role;
