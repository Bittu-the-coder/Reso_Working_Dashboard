const mongoose = require("mongoose");

const docsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  addedOn: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

const Docs = mongoose.model("Docs", docsSchema);

module.exports = Docs;
