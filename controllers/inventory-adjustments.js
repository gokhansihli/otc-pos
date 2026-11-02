const {
  fetchInventoryAdjustments,
  insertInventoryAdjustment,
} = require("../models/inventory-adjustments");

exports.getInventoryAdjustments = async (req, res, next) => {
  try {
    const adjustments = await fetchInventoryAdjustments();
    res.status(200).send({ adjustments });
  } catch (err) {
    next(err);
  }
};

exports.postInventoryAdjustment = async (req, res, next) => {
  try {
    const { product_id, change_quantity, reason, notes } = req.body;
    const adjustment = await insertInventoryAdjustment(
      product_id,
      change_quantity,
      reason,
      notes,
    );
    res.status(201).send({ adjustment });
  } catch (err) {
    next(err);
  }
};
