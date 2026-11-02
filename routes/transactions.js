const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  postTransaction,
} = require("../controllers/transactions");

router.route("/").get(getTransactions).post(postTransaction);

router.route("/:transaction_id").get(getTransactionById);

module.exports = router;
