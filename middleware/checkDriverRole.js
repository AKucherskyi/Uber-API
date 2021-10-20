const User = require("../models/User");

module.exports = async (req, res, next) => {
    
  const user = await User.findById(req.userId);

  if (user.role !== "DRIVER") {
    return res.status(400).json({ message: "You have to be a driver to do this" });
  }
  next()
}