const db = require("../connection");
const format = require("pg-format");

async function insertProducts(productsData) {
  const formattedProducts = productsData.map((p) => [
    p.barcode,
    p.name,
    p.category,
    p.cost_price,
    p.retail_price,
    p.vat_rate,
    p.stock_quantity,
    p.min_stock_level,
    p.is_p_medicine,
  ]);

  const result = await db.query(
    format(
      `INSERT INTO products 
      (barcode, name, category, cost_price, retail_price, vat_rate, stock_quantity, min_stock_level, is_p_medicine)
      VALUES %L RETURNING *;`,
      formattedProducts,
    ),
  );
  return result.rows;
}

async function insertShifts(shiftsData) {
  const formattedShifts = shiftsData.map((s) => [
    s.cashier_name,
    s.opening_float,
    s.expected_cash,
    s.closing_actual_cash,
    s.total_cash_sales,
    s.total_card_sales,
    s.cash_discrepancy,
    s.is_closed,
  ]);

  const result = await db.query(
    format(
      `INSERT INTO shifts 
      (cashier_name, opening_float, expected_cash, closing_actual_cash, total_cash_sales, total_card_sales, cash_discrepancy, is_closed)
      VALUES %L RETURNING *;`,
      formattedShifts,
    ),
  );
  return result.rows;
}

async function insertTransactions(
  transactionsData,
  insertedShifts,
  insertedProducts,
) {
  for (const t of transactionsData) {
    const shiftId = insertedShifts[t.shift_index].shift_id;

    // 1. Insert Transaction Header
    const txnResult = await db.query(
      `INSERT INTO transactions (shift_id, subtotal, vat_total, discount_total, total_amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        shiftId,
        t.subtotal,
        t.vat_total,
        t.discount_total,
        t.total_amount,
        t.payment_method,
        t.status,
      ],
    );
    const transactionId = txnResult.rows[0].transaction_id;

    // 2. Insert Transaction Items
    for (const item of t.items) {
      const product = insertedProducts[item.product_index];
      await db.query(
        `INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, vat_rate, line_total)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          transactionId,
          product.product_id,
          product.name,
          item.quantity,
          item.unit_price,
          item.vat_rate,
          item.line_total,
        ],
      );
    }
  }
}

async function insertAdjustments(adjustmentsData, insertedProducts) {
  const formattedAdjustments = adjustmentsData.map((a) => [
    insertedProducts[a.product_index].product_id,
    a.change_quantity,
    a.reason,
    a.notes,
  ]);

  if (formattedAdjustments.length > 0) {
    await db.query(
      format(
        `INSERT INTO inventory_adjustments (product_id, change_quantity, reason, notes)
         VALUES %L;`,
        formattedAdjustments,
      ),
    );
  }
}

module.exports = {
  insertProducts,
  insertShifts,
  insertTransactions,
  insertAdjustments,
};
