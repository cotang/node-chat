const mongoose = require('mongoose');

const HistoryMessageSchema = new mongoose.Schema({
  author: {
    type: String
  },
  className: {
    type: String
  },
  message: {
    type: String
  }
},
  { timestamps: { createdAt: 'created_at' } }
);
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  url: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  // id: {
  //   type: Number,
  //   unique: true,
  //   required: true
  // },
  messages: [HistoryMessageSchema]
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;