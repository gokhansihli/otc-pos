const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");

exports.fetchProducts = async (
  category,
  search,
  sort = "name",
  order = "ASC",
) => {
  const orderBy = order.toUpperCase();
  const validSorts = ["name", "retail_price", "stock_quantity", "created_at"];
  const validOrders = ["ASC", "DESC"];

  if (!validSorts.includes(sort) || !validOrders.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort or order query" });
  }

  let queryStr = `SELECT * FROM products`;
  const queryValues = [];
  const whereConditions = [];

  if (category) {
    queryValues.push(category);
    whereConditions.push(`category = $${queryValues.length}`);
  }

  if (search) {
    queryValues.push(`%${search}%`);
    whereConditions.push(
      `(name ILIKE $${queryValues.length} OR barcode ILIKE $${queryValues.length})`,
    );
  }

  if (whereConditions.length) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  queryStr += ` ORDER BY ${sort} ${orderBy};`;

  const { rows: products } = await db.query(queryStr, queryValues);
  return products;
};

exports.fetchProductByBarcode = async (barcode) => {
  await checkExists("products", "barcode", barcode, "Product not found!");

  const queryStr = `SELECT * FROM products WHERE barcode = $1;`;
  const {
    rows: [product],
  } = await db.query(queryStr, [barcode]);

  return product;
};

exports.updateProductByBarcode = async (
  barcode,
  retail_price,
  stock_quantity,
) => {
  await checkExists("products", "barcode", barcode, "Product not found!");

  const queryStr = `
    UPDATE products
    SET retail_price = COALESCE($1, retail_price),
        stock_quantity = COALESCE($2, stock_quantity)
    WHERE barcode = $3
    RETURNING *;
  `;

  const {
    rows: [product],
  } = await db.query(queryStr, [retail_price, stock_quantity, barcode]);
  return product;
};
