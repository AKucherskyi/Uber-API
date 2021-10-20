const User = require("../models/User");
const bcrypt = require("bcrypt");

async function getUserInfo(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }
  res.status(200).json({
    user: {
      _id: user.id,
      role: user.role,
      email: user.email,
      created_date: user.created_date,
    },
  });
}

async function deleteUser(req, res) {
  await User.deleteOne({ _id: req.userId });
  res.status(200).json({ message: "Success" });
}

async function changePassword(req, res) {
  const user = await User.findById(req.userId);
  if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
    return res.status(400).json({ message: "Wrong password!" });
  }

  await User.updateOne(
    { _id: req.userId },
    { password: bcrypt.hashSync(req.body.newPassword, 7) }
  );
  res.status(200).json({ message: "Success" });
}

module.exports = {
  getUserInfo,
  deleteUser,
  changePassword,
};
