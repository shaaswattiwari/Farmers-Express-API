const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  cmdtyName: { type: String },
  cmdtyID: { type: String, required: true },
  marketID: { type: String, required: true },
  marketName: { type: String },
  marketType: { type: String },
  users: [{ type: String }],
  priceUnit: { type: String, default: "Kg" },
  price: { type: Number, required: true },
});

const reports = mongoose.model("reports", reportSchema);

module.exports = reports;
