const express = require("express");
const router = express.Router();
const {
  getInventoryAdjustments,
  postInventoryAdjustment,
} = require("../controllers/inventory-adjustments");

router.route("/").get(getInventoryAdjustments).post(postInventoryAdjustment);

module.exports = router;
