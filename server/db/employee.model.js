// https://mongoosejs.com/
const mongoose = require("mongoose");
const EquipmentModel = require("./equipmentSchema");
const ColorSchema = require("../db/favColorModel");
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  created: {
    type: Date,
    default: Date.now,
  },
  presence: Boolean,
  map: Boolean,
  equipment: [Schema.Types.ObjectId],
  color: [Schema.Types.ObjectId],
});

module.exports = mongoose.model("Employee", EmployeeSchema);
