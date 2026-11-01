const dropTables = require("../queries/drops");
const createTables = require("../queries/creates");
const {
  insertProducts,
  insertShifts,
  insertTransactions,
  insertAdjustments,
} = require("../queries/inserts");

async function seed({
  productsData,
  shiftsData,
  transactionsData,
  adjustmentsData,
}) {
  await dropTables();
  await createTables();

  const insertedProducts = await insertProducts(productsData);
  const insertedShifts = await insertShifts(shiftsData);
  await insertTransactions(transactionsData, insertedShifts, insertedProducts);
  await insertAdjustments(adjustmentsData, insertedProducts);
}

module.exports = seed;
