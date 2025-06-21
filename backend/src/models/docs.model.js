const mongoose = require("mongoose");

const docsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL'],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        try {
          new URL(v);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  department: {
    type: String,
    required: [true, 'Please select a department'],
    enum: ['dev', 'marketing', 'outreach', 'social media', 'other'],
    default: 'other'
  },
  addedOn: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Docs', docsSchema);