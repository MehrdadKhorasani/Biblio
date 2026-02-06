const db = require("../config/db");

const Book = {
  async create(book) {
    const query = `
            INSERT INTO "Book"
            (title, author, translator, publisher, 
            description, "ISBN", price, stock, "isAvailable",
            "coverImage", "categoryId")
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *;
        `;

    const values = [
      book.title,
      book.author,
      book.translator || null,
      book.publisher,
      book.description || null,
      book.ISBN || null,
      book.price,
      book.stock,
      book.stock > 0,
      book.coverImage || null,
      book.categoryId,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
        SELECT 
            b.*,
            c.name AS "categoryName"
        FROM "Book" b
        LEFT JOIN "Category" c ON b."categoryId" = c.id
        ORDER BY b."createdAt" DESC;
        `;

    const result = await db.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      translator: row.translator,
      publisher: row.publisher,
      description: row.description,
      ISBN: row.ISBN,
      price: row.price,
      stock: row.stock,
      isAvailable: row.isAvailable,
      coverImage: row.coverImage,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
      },
    }));
  },

  async findById(id) {
    const query = `
        SELECT 
          b.*,
          c.name AS "categoryName"
        FROM "Book" b
        LEFT JOIN "Category" c ON c.id = b."categoryId"
        WHERE b.id = $1;
        `;

    const result = await db.query(query, [id]);
    if (!result.rows.length) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      translator: row.translator,
      publisher: row.publisher,
      description: row.description,
      ISBN: row.ISBN,
      price: row.price,
      stock: row.stock,
      isAvailable: row.isAvailable,
      coverImage: row.coverImage,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
      },
    };
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

  async updateById(id, updates) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
      fields.push(`"${key}" = $${index++}`);
      values.push(updates[key]);
    }
    const query = `
            UPDATE "Book"
            SET ${fields.join(", ")},
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $${index}
            RETURNING *;
        `;
    values.push(id);

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateAvailability(id, isAvailable) {
    const query = `
            UPDATE "Book"
            SET "isAvailable" = $1,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;

    const result = await db.query(query, [isAvailable, id]);
    return result.rows[0];
  },

  async findAllWithFilters(filters = {}) {
    let conditions = [];
    let values = [];
    let index = 1;

    if (filters.categoryId) {
      conditions.push(`b."categoryId" = $${index++}`);
      values.push(filters.categoryId);
    }

    if (filters.search) {
      conditions.push(`b.title ILIKE $${index++}`);
      values.push(`%${filters.search}%`);
    }

    if (filters.author) {
      conditions.push(`b.author ILIKE $${index++}`);
      values.push(`%${filters.author}%`);
    }

    if (filters.minPrice) {
      conditions.push(`b.price >= $${index++}`);
      values.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      conditions.push(`b.price <= $${index++}`);
      values.push(filters.maxPrice);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const allowedSortFields = ["price", "createdAt"];

    const sortField = allowedSortFields.includes(filters.sortBy)
      ? filters.sort
      : "createdAt";

    const sortOrder =
      filters.order === "asc" || filters.order === "desc"
        ? filters.order
        : "desc";

    const query = `
        SELECT 
            b.*,
            c.id AS "categoryId",
            c.name AS "categoryName"
        FROM "Book" b
        JOIN "Category" c ON b."categoryId" = c.id
        ${whereClause}
        ORDER BY b."${sortField}" ${sortOrder}
        `;
    const result = await db.query(query, values);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      translator: row.translator,
      publisher: row.publisher,
      description: row.description,
      ISBN: row.ISBN,
      price: row.price,
      stock: row.stock,
      isAvailable: row.isAvailable,
      coverImage: row.coverImage,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
      },
    }));
  },
};

module.exports = Book;
