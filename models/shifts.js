const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");

exports.fetchShifts = async () => {
  const queryStr = `
    SELECT * FROM shifts 
    ORDER BY opened_at DESC;
  `;
  const { rows: shifts } = await db.query(queryStr);
  return shifts;
};

exports.fetchShiftById = async (shift_id) => {
  await checkExists("shifts", "shift_id", shift_id, "Shift not found!");

  const queryStr = `SELECT * FROM shifts WHERE shift_id = $1;`;
  const {
    rows: [shift],
  } = await db.query(queryStr, [shift_id]);
  return shift;
};

exports.insertShift = async (cashier_name, float_amount) => {
  if (!cashier_name || float_amount === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Missing required shift fields",
    });
  }

  const queryStr = `
    INSERT INTO shifts (cashier_name, float_amount, status, opened_at)
    VALUES ($1, $2, 'open', NOW())
    RETURNING *;
  `;
  const {
    rows: [newShift],
  } = await db.query(queryStr, [cashier_name, float_amount]);
  return newShift;
};

exports.updateShiftClose = async (shift_id, actual_cash) => {
  await checkExists("shifts", "shift_id", shift_id, "Shift not found!");

  const queryStr = `
    UPDATE shifts
    SET actual_cash = $1,
        status = 'closed',
        closed_at = NOW()
    WHERE shift_id = $2
    RETURNING *;
  `;
  const {
    rows: [closedShift],
  } = await db.query(queryStr, [actual_cash, shift_id]);
  return closedShift;
};
