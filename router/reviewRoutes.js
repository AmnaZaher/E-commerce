const express = require("express");
const router = express.Router();
const { reviewOrder } = require("../controllers/reviewController");

router.post("/orders/:orderId/review", reviewOrder);

module.exports = router;