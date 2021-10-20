const express = require("express");
const { verifyToken } = require("../controllers/authController");
const {
  getUserInfo,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const router = express.Router();

router.get("/me", verifyToken, getUserInfo);
router.delete("/me", verifyToken, deleteUser);
router.patch("/me/password", verifyToken, changePassword);

module.exports = router;