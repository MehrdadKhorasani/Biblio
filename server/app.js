const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

const authRoutes = require("./src/routes/auth.route");
app.use("/api/auth", authRoutes);

const orderRoutes = require("./src/routes/order.route");
app.use("/api/orders", orderRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const userRoutes = require("./src/routes/user.route");
app.use("/api/users", userRoutes);

const bookRoutes = require("./src/routes/book.route");
app.use("/api/books", bookRoutes);

const categoryRoutes = require("./src/routes/category.route");
app.use("/api/categories", categoryRoutes);

const dashboardRoutes = require("./src/routes/dashboard.route");
app.use("/api/dashboard", dashboardRoutes);
