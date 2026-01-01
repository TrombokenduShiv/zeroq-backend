const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Queue = require('../models/Queue'); // Assuming you have this
const { verifyToken } = require('../middleware/authMiddleware');

// Store active QR tokens in memory (Simple for MVP)
// In production, use Redis.
// Format: { 'queueId': 'random_token_string' }
const activeQRTokens = new Map();

// 1. Org generates a new QR Token (Called every 30 seconds by Org Frontend)
router.post('/generate-qr', verifyToken, async (req, res) => {
  const { queueId } = req.body;
  // Security: Check if req.user owns this queue (Skipped for brevity)
  
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  activeQRTokens.set(queueId, token);
  
  res.json({ qrToken: token });
});

// 2. User Scans QR -> Sends Request to Check In
router.post('/verify', async (req, res) => {
  const { ticketId, queueId, qrToken, userLocation } = req.body;

  // A. Verify QR Code (The "Presence" Check)
  const currentValidToken = activeQRTokens.get(queueId);
  if (!currentValidToken || currentValidToken !== qrToken) {
    return res.status(400).json({ error: 'QR Code expired or invalid. Please scan again.' });
  }

  // B. Verify Location (Optional - The "Geofence" Check)
  // if (calculateDistance(userLocation, queueLocation) > 0.5) return error...

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.status = 'verified';
    ticket.checkInTime = Date.now();
    
    // Reward Logic (Phase 3 Hook)
    // ticket.priorityScore += 5; 

    await ticket.save();

    // Trigger Socket update to Organization Dashboard
    // io.to(queueId).emit('user_verified', ticket);

    res.json({ success: true, message: "You are checked in!", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;