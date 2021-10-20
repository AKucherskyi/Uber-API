const Truck = require("../models/Truck");
const types = require("../config/truckTypes");
const truckStatus = require("../config/truckStatus");

async function addTruck(req, res) {
  const { type } = req.body;
  if (!types.includes(type)) {
    res.status(400).json({ message: "Wrong truck type" });
  }

  try {
    await Truck.create({ type, status: "IS", created_by: req.userId });
    res.status(200).json({ message: "Truck created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTrucks(req, res) {
  try {
    const trucks = await Truck.find({ created_by: req.userId });
    res.status(200).json({ trucks });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getTruck(req, res) {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      res.status(400).json({message: "Truck doesn't exist"})
    }
    res.status(200).json({ truck });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updateTruck(req, res) {
  const { type } = req.body;
  if (!types.includes(type)) {
    res.status(400).json({ message: "Wrong truck type" });
  }
  try {
    const truck = await Truck.updateOne(
      { _id: req.params.id },
      { type: req.body.type }
    );
    res.status(200).json({ message: "Truck details changed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteTruck(req, res) {
  try {
    await Truck.deleteOne({ _id: req.params.id });
    res.status(200).json({message: "Truck deleted successfully"})
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function assignTruck (req, res) {
  try {
    const assignedTrucks = await Truck.find({assigned_to: req.userId})
    if (assignedTrucks.length !== 0) {
      res.status(400).json({message: "You already have assigned truck"})
    }

    const truck = await Truck.updateOne(
      { _id: req.params.id },
      { assigned_to: req.userId }
    );
    res.status(200).json({ message: "Truck details changed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addTruck,
  getTrucks,
  getTruck,
  updateTruck,
  deleteTruck,
  assignTruck
};