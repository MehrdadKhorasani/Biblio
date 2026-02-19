const Report = require("../models/report.model");

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

module.exports = {
  getOrderStatusReport,
};
