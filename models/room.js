const mongoose = require('mongoose');

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
  // }
});

RoomSchema.index({ name: 1, type: -1 });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
