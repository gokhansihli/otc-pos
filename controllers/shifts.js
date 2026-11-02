const {
  fetchShifts,
  fetchShiftById,
  insertShift,
  updateShiftClose,
} = require("../models/shifts");

exports.getShifts = async (req, res, next) => {
  try {
    const shifts = await fetchShifts();
    res.status(200).send({ shifts });
  } catch (err) {
    next(err);
  }
};

exports.getShiftById = async (req, res, next) => {
  try {
    const { shift_id } = req.params;
    const shift = await fetchShiftById(shift_id);
    res.status(200).send({ shift });
  } catch (err) {
    next(err);
  }
};

exports.postShift = async (req, res, next) => {
  try {
    const { cashier_name, float_amount } = req.body;
    const shift = await insertShift(cashier_name, float_amount);
    res.status(201).send({ shift });
  } catch (err) {
    next(err);
  }
};

exports.patchCloseShift = async (req, res, next) => {
  try {
    const { shift_id } = req.params;
    const { actual_cash } = req.body;
    const shift = await updateShiftClose(shift_id, actual_cash);
    res.status(200).send({ shift });
  } catch (err) {
    next(err);
  }
};
