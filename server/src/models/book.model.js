const db = require("../config/db");

const Book = {
  async create(book) {
    const query = `
            INSERT INTO "Book"
            (title, author, translator, publisher, category,
            description, "ISBN", price, stock, "isAvailable",
            "coverImage")
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *;
        `;

    const values = [
      book.title,
      book.author,
      book.translator || null,
      book.publisher,
      book.category,
      book.description || null,
      book.ISBN || null,
      book.price,
      book.stock,
      book.isAvailable,
      book.coverImage || null,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
            SELECT * FROM "Book"
            ORDER BY "createdAt" DESC;
        `;

    const result = await db.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = `
            SELECT * FROM "Book"
            WHERE id = $1;
        `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async updateStock(id, stock) {
    const query = `
            UPDATE "Book"
            SET stock = $1,
                "isAvailable" = CASE WHEN $1 > 0 
                    THEN true
                    ELSE false
                    END,
                "updatedAt" = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *;
        `;

    const result = await db.query(query, [stock, id]);
    return result.rows[0];
  },

  async search(filters) {
    let conditions = [];
    let values = [];
    let index = 1;

    if (filters.title) {
      conditions.push(`title ILIKE $${index++}`);
      values.push(`%${filters.title}%`);
    }

    if (filters.author) {
      conditions.push(`author ILIKE $${index++}`);
      values.push(`%${filters.author}%`);
    }

    if (filters.translator) {
      conditions.push(`translator ILIKE $${index++}`);
      values.push(`%${filters.translator}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join("AND ")}` : "";

    const query = `
            SELECT * FROM "Book" 
            ${whereClause}
            ORDER BY "createdAt" DESC;
        `;

    const result = await db.query(query, values);
    return result.rows;
  },
};

module.exports = Book;
