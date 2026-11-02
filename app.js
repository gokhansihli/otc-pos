const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const shiftsRouter = require("./routes/shifts");
const transactionsRouter = require("./routes/transactions");
const inventoryAdjustmentsRouter = require("./routes/inventory-adjustments");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/products", productsRouter);
app.use("/api/shifts", shiftsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/inventory-adjustments", inventoryAdjustmentsRouter);

app.get("/api/health", (req, res) => {
  res.status(200).send({ msg: "OTC POS API is up and running" });
});

// Handle 404 for invalid endpoints
app.all(/(.*)/, (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

// Error handling middleware (must be registered last)
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
