// 1. Handle Custom / Model Errors (e.g., { status: 404, msg: 'Not found' })
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

// 2. Handle PostgreSQL Database Errors
exports.handlePsqlErrors = (err, req, res, next) => {
  // Invalid cast / syntax (e.g., passing letters where an INT is expected)
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request: Invalid input or missing data" });
  }
  // Foreign key violation (e.g., referencing a product_id that doesn't exist)
  else if (err.code === "23503") {
    res
      .status(404)
      .send({ msg: "Not Found: Referenced resource does not exist" });
  }
  // Unique constraint violation (e.g., duplicate barcode)
  else if (err.code === "23505") {
    res
      .status(400)
      .send({ msg: "Bad Request: Duplicate value violates unique constraint" });
  } else {
    next(err);
  }
};

// 3. Handle Server / Unexpected Errors (500)
exports.handleServerErrors = (err, req, res, next) => {
  console.error(err, "Unhandled Server Error");
  res.status(500).send({ msg: "Internal Server Error" });
};
