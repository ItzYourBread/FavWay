const mongoose = require("mongoose");

// Generate Premium Code
const premiumCode = mongoose.Schema({
  code: {
    type: mongoose.SchemaTypes.String,
    default: null,
  },

  expiresAt: {
    type: mongoose.SchemaTypes.Number,
    default: null,
  },

  plan: {
    type: mongoose.SchemaTypes.String,
    default: null,
  },
});

module.exports = mongoose.model("premium-codes", premiumCode);