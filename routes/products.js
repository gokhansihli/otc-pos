const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductByBarcode,
  patchProductByBarcode,
} = require("../controllers/products");

router.route("/").get(getProducts);

router.route("/:barcode").get(getProductByBarcode).patch(patchProductByBarcode);

module.exports = router;
