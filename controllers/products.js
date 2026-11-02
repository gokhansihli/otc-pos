const {
  fetchProducts,
  fetchProductByBarcode,
  updateProductByBarcode,
} = require("../models/products");

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, order } = req.query;
    const products = await fetchProducts(category, search, sort, order);
    res.status(200).send({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const product = await fetchProductByBarcode(barcode);
    res.status(200).send({ product });
  } catch (err) {
    next(err);
  }
};

exports.patchProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const { retail_price, stock_quantity } = req.body;
    const product = await updateProductByBarcode(
      barcode,
      retail_price,
      stock_quantity,
    );
    res.status(200).send({ product });
  } catch (err) {
    next(err);
  }
};
