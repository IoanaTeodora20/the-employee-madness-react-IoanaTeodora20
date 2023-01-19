const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Company", companySchema);
