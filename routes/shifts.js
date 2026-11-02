const express = require("express");
const router = express.Router();
const {
  getShifts,
  getShiftById,
  postShift,
  patchCloseShift,
} = require("../controllers/shifts");

router.route("/").get(getShifts).post(postShift);

router.route("/:shift_id").get(getShiftById);

router.route("/:shift_id/close").patch(patchCloseShift);

module.exports = router;
