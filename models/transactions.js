const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");

exports.fetchTransactions = async () => {
  const queryStr = `
    SELECT * FROM transactions
    ORDER BY created_at DESC;
  `;
  const { rows: transactions } = await db.query(queryStr);
  return transactions;
};

exports.fetchTransactionById = async (transaction_id) => {
  await checkExists(
    "transactions",
    "transaction_id",
    transaction_id,
    "Transaction not found!",
  );

  const queryStr = `
    SELECT t.*, 
           COALESCE(
             JSON_AGG(
               JSON_BUILD_OBJECT(
                 'item_id', ti.item_id,
                 'product_id', ti.product_id,
                 'quantity', ti.quantity,
                 'unit_price', ti.unit_price
               )
             ) FILTER (WHERE ti.item_id IS NOT NULL), '[]'
           ) AS items
    FROM transactions t
    LEFT JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
    WHERE t.transaction_id = $1
    GROUP BY t.transaction_id;
  `;
  const {
    rows: [transaction],
  } = await db.query(queryStr, [transaction_id]);
  return transaction;
};

exports.insertTransaction = async (
  shift_id,
  payment_method,
  total_amount,
  items,
) => {
  if (
    !shift_id ||
    !payment_method ||
    total_amount === undefined ||
    !items ||
    !items.length
  ) {
    return Promise.reject({
      status: 400,
      msg: "Missing required transaction or item fields",
    });
  }

  await checkExists("shifts", "shift_id", shift_id, "Shift not found!");

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert main transaction record
    const insertTransactionQuery = `
      INSERT INTO transactions (shift_id, payment_method, total_amount, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const {
      rows: [newTransaction],
    } = await client.query(insertTransactionQuery, [
      shift_id,
      payment_method,
      total_amount,
    ]);

    // 2. Insert transaction items and update stock for each item
    for (const item of items) {
      const { product_id, quantity, unit_price } = item;

      const insertItemQuery = `
        INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(insertItemQuery, [
        newTransaction.transaction_id,
        product_id,
        quantity,
        unit_price,
      ]);

      const updateStockQuery = `
        UPDATE products
        SET stock_quantity = stock_quantity - $1
        WHERE product_id = $2;
      `;
      await client.query(updateStockQuery, [quantity, product_id]);
    }

    await client.query("COMMIT");
    return newTransaction;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
