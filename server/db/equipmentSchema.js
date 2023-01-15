const mongoose = require("mongoose");
const { Schema } = mongoose;

const equipmentSchema = new Schema({
  name: String,
  type: String,
  amount: Number,
});

module.exports = mongoose.model("Equipment", equipmentSchema);
