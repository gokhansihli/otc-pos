const {
  fetchTransactions,
  fetchTransactionById,
  insertTransaction,
} = require("../models/transactions");

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await fetchTransactions();
    res.status(200).send({ transactions });
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const transaction = await fetchTransactionById(transaction_id);
    res.status(200).send({ transaction });
  } catch (err) {
    next(err);
  }
};

exports.postTransaction = async (req, res, next) => {
  try {
    const { shift_id, payment_method, total_amount, items } = req.body;
    const transaction = await insertTransaction(
      shift_id,
      payment_method,
      total_amount,
      items,
    );
    res.status(201).send({ transaction });
  } catch (err) {
    next(err);
  }
};
