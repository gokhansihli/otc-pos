const db = require("../connection");

async function dropTables() {
  await db.query(`DROP TABLE IF EXISTS inventory_adjustments;`);
  await db.query(`DROP TABLE IF EXISTS transaction_items;`);
  await db.query(`DROP TABLE IF EXISTS transactions;`);
  await db.query(`DROP TABLE IF EXISTS shifts;`);
  await db.query(`DROP TABLE IF EXISTS products;`);
}

module.exports = dropTables;
