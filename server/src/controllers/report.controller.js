const Report = require("../models/report.model");
const UserActivityLog = require("../models/userActivityLog.model");

const getOrderStatusReport = async (req, res) => {
  try {
    let { userName, status, page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const report = await Report.getOrderStatusReport({
      userName,
      status,
      page,
      limit,
    });

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error fetching order status report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBookStockReport = async (req, res) => {
  try {
    let { bookId, page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const report = await Report.getBookStockReport({
      bookId,
      page,
      limit,
    });

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error fetching book stock report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserActivityReport = async (req, res) => {
  try {
    const { actorId, targetUserId, page = 1, limit = 10 } = req.query;

    // تبدیل page و limit به عدد صحیح
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const logs = await UserActivityLog.findAll({
      actorId: actorId ? parseInt(actorId, 10) : undefined,
      targetUserId: targetUserId ? parseInt(targetUserId, 10) : undefined,
      page: pageNumber,
      limit: limitNumber,
    });

    res
      .status(200)
      .json({ logs, pagination: { page: pageNumber, limit: limitNumber } });
  } catch (error) {
    console.error("Error fetching user activity report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getOrderStatusReport,
  getBookStockReport,
  getUserActivityReport,
};
