const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: "Queue" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
