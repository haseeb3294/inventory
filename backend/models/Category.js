const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String }, // Custom string ID
    name: { type: String, required: true, unique: true },
  },
  {
    _id: false,
  }
);

module.exports = mongoose.model("Category", categorySchema);
