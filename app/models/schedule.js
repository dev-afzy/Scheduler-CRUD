const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('mongoose-url-slugs');

const ScheduleSchema = new Schema({
  insight: {
    agenda: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    additionalDetails: {
      type: String,
    },
  },
  location: {
    type: String,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  conferenceType: {
    type: {
      type: String,
      enum: ['offline', 'online'],
    },
    url: {
      type: String,
      trim: true,
    },
  },
  repeat: {
    type: String,
    enum: ['never', 'daily', 'weekly', 'monthly', 'yearly'],
  },
  status: {
    type: String,
    enum: ['Ended', 'Scheduled', 'Canceled'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Always `populate()` after `find()` calls. Useful if you want to selectively populate
// based on the docs found.
ScheduleSchema.post('find', async function (docs) {
  for (let doc of docs) {
    if (doc.user) {
      await doc.populate('user').execPopulate();
    }
  }
});

ScheduleSchema.plugin(slug('insight.agenda'));
module.exports = mongoose.model('Schedule', ScheduleSchema, 'schedules');
