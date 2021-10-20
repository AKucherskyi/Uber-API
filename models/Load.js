const { Schema, model } = require("mongoose");
const status = require("../config/loadStatus");
const state = require("../config/loadState");

const schema = new Schema({
  name: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: null },
  payload: { type: Number, required: true },
  pickup_address: { type: String, required: true },
  delivery_address: { type: String, required: true },
  dimensions: {
    width: Number,
    length: Number,
    height: Number,
  },
  status: { type: String, enum: status, default: "NEW" },
  state: { type: String, enum: state },
  logs: [
    {
      message: String,
      time: { type: String, default: new Date().toISOString() },
    },
  ],
});

module.exports = model("Load", schema);
