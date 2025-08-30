const router = require("express").Router();
const { getClientToken, checkout } = require("../controller/paymentController");
const auth = require("../middleware/auth"); // you already have this

router.get("/client-token", auth, getClientToken);
router.post("/checkout", auth, checkout);

module.exports = router;
