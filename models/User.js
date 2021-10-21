const {Schema, model} = require('mongoose');
const roles = require('../config/roles');

const schema = new Schema({
  role: {type: String, required: true, enum: roles},
  email: {type: String, required: true},
  password: {type: String, required: true},
  created_date: {type: String, default: new Date().toISOString()},
});

module.exports = model('User', schema);
