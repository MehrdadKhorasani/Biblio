const db = require("../config/db");

const Category = {
  // ایجاد دسته‌بندی جدید
  async create({ name, description }) {
    const query = `
      INSERT INTO "Category" (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(query, [name, description || null]);
    return result.rows[0];
  },

  // دریافت همه دسته‌ها همراه با تعداد کتاب‌ها
  async findAllWithBookCount(onlyActive = false) {
    const query = `
      SELECT c.*,
             COUNT(b.id) AS "bookCount"
      FROM "Category" c
      LEFT JOIN "Book" b ON b."categoryId" = c.id
      ${onlyActive ? 'WHERE c."isActive" = true' : ""}
      GROUP BY c.id
      ORDER BY c.name;
    `;
    const result = await db.query(query);
    return result.rows.map((row) => ({
      ...row,
      isactive: row.isactive, // lowercase برای consistency فرانت
      bookcount: parseInt(row.bookCount, 10),
    }));
  },

  // دریافت یک دسته‌بندی بر اساس id
  async findById(id) {
    const query = `
      SELECT * FROM "Category"
      WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // ویرایش نام و توضیح دسته‌بندی
  async update(id, { name, description }) {
    const query = `
      UPDATE "Category"
      SET name = $1,
          description = $2,
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [name, description || null, id]);
    return result.rows[0];
  },

  // تغییر وضعیت فعال/غیرفعال
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
