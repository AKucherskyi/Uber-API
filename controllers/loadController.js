const Load = require("../models/Load");

async function addLoad(req, res) {
  try {
    await Load.create({ ...req.body, created_by: req.userId, status: "NEW" });
    res.status(200).json({ message: "Load created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function postLoad(req, res) {
    const load = await Load.findById(req.params.id)
  try {
    await Load.create({ ...req.body, created_by: req.userId, status: "NEW" });
    res.status(200).json({
      message: "Load posted successfully",
      driver_found: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addLoad,
  postLoad,
};
