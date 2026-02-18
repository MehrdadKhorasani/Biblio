const db = require("../config/db");

const getAdminStats = async (req, res) => {
  try {
    const booksCount = await db.query(`SELECT COUNT(*) FROM "Book"`);
    const ordersCount = await db.query(`SELECT COUNT(*) FROM "Order"`);
    const usersCount = await db.query(`SELECT COUNT(*) FROM "User"`);

    res.status(200).json({
      stats: {
        books: parseInt(booksCount.rows[0].count),
        orders: parseInt(ordersCount.rows[0].count),
        users: parseInt(usersCount.rows[0].count),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAdminStats };
