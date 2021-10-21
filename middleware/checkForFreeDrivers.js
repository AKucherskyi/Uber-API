const Truck = require('../models/Truck');

module.exports = async (req, res, next) => {
  const trucks = await Truck.find({status: 'IS', assigned_to: {$nin: [null]}});
  if (trucks.length === 0) {
    return res.status(400).json({message: 'No free drivers'});
  }
  req.trucks = trucks;
  next();
};
