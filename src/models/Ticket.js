const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
  
  // New Fields for Hybrid System
  status: { 
    type: String, 
    enum: ['provisional', 'arriving', 'verified', 'served', 'abandoned', 'cancelled'], 
    default: 'provisional' 
  },
  
  priorityScore: { type: Number, default: 0 }, // 0 = Normal, 10 = Paid/Staked
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  checkInTime: { type: Date }, // When they scan the QR
  estimatedWaitTime: { type: Number },
  
  // Geofence Data (Optional snapshot)
  arrivalDistance: { type: Number } 
});

module.exports = mongoose.model('Ticket', ticketSchema);