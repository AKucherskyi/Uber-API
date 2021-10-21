const {Schema, model} = require('mongoose');
const types = require('../config/truckTypes');
const status = require('../config/truckStatus');

const schema = new Schema({
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: null},
  type: {type: String, enum: types, required: true},
  status: {type: String, enum: status, required: true},
  created_date: {type: String, default: new Date().toISOString()},
});

module.exports = model('Truck', schema);
