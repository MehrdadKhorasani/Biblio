const express = require("express");
const app = express();

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
