const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  link: {
    type: String,
    required: [true, 'Please add a link'],
    validate: {
      validator: function (v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  department: {
    type: String,
    enum: ['dev', 'marketing', 'outreach', 'social media', 'other']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
