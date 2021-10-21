/* eslint-disable require-jsdoc */
const Load = require('../models/Load');
const dimensionsOk = require('../services/dimensionsOk');
const loadStates = require('../config/loadStates');
const Truck = require('../models/Truck');
const User = require('../models/User');

async function addLoad(req, res) {
  try {
    await Load.create({
      ...req.body,
      created_by: req.userId,
      status: 'NEW',
      logs: [{message: 'Load created, status NEW'}],
    });
    res.status(200).json({message: 'Load created successfully'});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function getLoads(req, res) {
  let {status, limit, offset} = req.query;
  limit = limit || 10;
  offset = offset || 0;
  try {
    const user = await User.findById(req.userId);
    let loads = null;

    if (user.role === 'SHIPPER') {
      loads = await Load.find({created_by: req.userId});
    } else {
      loads = await Load.find({assigned_to: req.userId});
    }

    if (status) {
      loads = loads.filter((load) => load.status === status);
    }
    loads = loads.splice(offset, limit);
    res.status(200).json({loads});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function postLoad(req, res) {
  const load = await Load.findById(req.params.id);
  try {
    load.status = 'POSTED';
    load.logs = [...load.logs, {message: 'Load status POSTED'}];
    await load.save();

    for (const truck of req.trucks) {
      if (dimensionsOk(load, truck)) {
        truck.status = 'OL';
        load.status = 'ASSIGNED';
        load.state = 'En route to Pick Up';
        load.assigned_to = truck.assigned_to;
        load.logs = [...load.logs, {message: 'Load status ASSIGNED'}];
        await load.save();
        await truck.save();
        return res.status(200).json({
          message: 'Load posted successfully',
          driver_found: true,
        });
      } else {
        res.status(400).json({message: 'Dimensions are not ok'});
        load.status = 'NEW';
        load.logs = [...load.logs, {message: 'Load status NEW'}];
        await load.save();
      }
    }
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function getActiveLoad(req, res) {
  try {
    const load = await Load.findOne({
      assigned_to: req.userId,
      status: {$nin: ['SHIPPED']},
    });
    res.status(200).json({load});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function iterateLoadState(req, res) {
  try {
    const load = await Load.findOne({
      assigned_to: req.userId,
      status: {$nin: ['SHIPPED']},
    });
    let loadState = load.state;

    if (loadState === 'Arrived to delivery') {
      return res
          .status(400)
          .json({message: 'Load already arrived to delivery'});
    }

    const i = loadStates.indexOf(loadState);
    loadState = loadStates[i + 1];
    load.state = loadState;

    if (loadState === 'Arrived to delivery') {
      load.status = 'SHIPPED';
      load.logs = [...load.logs, {message: 'Load successfully SHIPPED'}];
      await Truck.updateOne({assigned_to: req.userId}, {status: 'IS'});
    }

    await load.save();
    res.status(200).json({message: `Load state changed to ${loadState}`});
  } catch (e) {
    console.log(e);
    res.status(500).json({message: 'Server error'});
  }
}

async function getLoad(req, res) {
  try {
    const load = await Load.findById(req.params.id);
    if (!load) {
      res.status(400).json({message: 'Bad load id'});
    }
    res.status(200).json({load});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function updateLoad(req, res) {
  try {
    await Load.updateOne({_id: req.params.id}, {...req.body});
    res.status(200).json({message: 'Load details changed successfully'});
  } catch (e) {
    console.log(e);
    res.status(500).json({message: 'Server error'});
  }
}

async function deleteLoad(req, res) {
  try {
    await Load.deleteOne({_id: req.params.id});
    res.status(200).json({message: 'Load deleted successfully'});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

async function getLoadInfo(req, res) {
  try {
    const load = await Load.findById(req.params.id);

    if (load.assigned_to === null) {
      res.status(200).json({load});
    }

    const truck = await Truck.findOne({assigned_to: load.assigned_to});
    res.status(200).json({load, truck});
  } catch (e) {
    res.status(500).json({message: 'Server error'});
  }
}

module.exports = {
  addLoad,
  postLoad,
  getLoads,
  getActiveLoad,
  iterateLoadState,
  getLoad,
  deleteLoad,
  updateLoad,
  getLoadInfo,
};
