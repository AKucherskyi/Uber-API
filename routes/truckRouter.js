const express = require("express");
const { verifyToken } = require("../controllers/authController");
const controller = require("../controllers/truckController");
const checkDriverRole = require("../middleware/checkDriverRole");
const router = express.Router()

router.post("/",verifyToken, checkDriverRole, controller.addTruck);
router.get("/",verifyToken, checkDriverRole, controller.getTrucks);
router.get("/:id",verifyToken, checkDriverRole, controller.getTruck);
router.put("/:id",verifyToken, checkDriverRole, controller.updateTruck);
router.delete("/:id",verifyToken, checkDriverRole, controller.deleteTruck);
router.post("/:id/assign",verifyToken, checkDriverRole, controller.assignTruck);

module.exports = router