const mongoose = require("mongoose");


const withdrawCode = mongoose.Schema({
    
  code: {
    type: mongoose.SchemaTypes.String,
    default: null,
  },

  expiresAt: {
    type: mongoose.SchemaTypes.Number,
    default: null,
  },
});

module.exports = mongoose.model("withdrawCode", withdrawCode);