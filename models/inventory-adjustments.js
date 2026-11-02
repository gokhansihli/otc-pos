const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");

exports.fetchInventoryAdjustments = async () => {
  const queryStr = `
    SELECT ia.*, p.name AS product_name, p.barcode
    FROM inventory_adjustments ia
    JOIN products p ON ia.product_id = p.product_id
    ORDER BY ia.created_at DESC;
  `;
  const { rows: adjustments } = await db.query(queryStr);
  return adjustments;
};

exports.insertInventoryAdjustment = async (
  product_id,
  change_quantity,
  reason,
  notes,
) => {
  if (!product_id || change_quantity === undefined || !reason) {
    return Promise.reject({
      status: 400,
      msg: "Missing required adjustment fields",
    });
  }

  await checkExists("products", "product_id", product_id, "Product not found!");

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const queryStr = `
      INSERT INTO inventory_adjustments (product_id, change_quantity, reason, notes, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const {
      rows: [adjustment],
    } = await client.query(queryStr, [
      product_id,
      change_quantity,
      reason,
      notes || null,
    ]);

    const updateStockStr = `
      UPDATE products
      SET stock_quantity = stock_quantity + $1
      WHERE product_id = $2;
    `;
    await client.query(updateStockStr, [change_quantity, product_id]);

    await client.query("COMMIT");
    return adjustment;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
