const express = require("express");
const { verifyToken } = require("../controllers/authController");
const controller = require("../controllers/loadController");
const checkForFreeDrivers = require("../middleware/checkForFreeDrivers");
const router = express.Router();

router.post("/", verifyToken,  controller.addLoad);
router.post("/:id/post", verifyToken, checkForFreeDrivers,  controller.addLoad);

module.exports = router;
