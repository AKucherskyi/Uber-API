const express = require("express")
const {login, register} = require("../controllers/authController");
const { validateUser } = require("../middleware/validationService");
const router = express.Router()

router.post("/login", login);
router.post("/register",validateUser, register)

module.exports = router