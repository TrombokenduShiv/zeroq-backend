require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectSQLite } = require('./config/sqlite');

// Routes & Middleware
const queueRoutes = require('./routes/queueRoutes'); // Assume existing
const authRoutes = require('./routes/authRoutes');
const { verifyPoW, getChallenge } = require('./middleware/powMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Database Connections
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeroq')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

connectSQLite(); // Initialize SQLite

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Login/Register
app.get('/api/pow/challenge', getChallenge); // Get Puzzle

// Protect Queue Joins with PoW (Rate Limiting)
// Note: You need to update your queueRoutes to separate the /join endpoint if you want to apply middleware specifically, 
// or apply it globally to /api/queues if acceptable for now.
app.use('/api/queues', queueRoutes); 

// Socket.IO Logic (Keep your existing logic)
io.on('connection', (socket) => {
  console.log('Socket Connected:', socket.id);
  // ... existing socket logic ...
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 ZeroQ Backend running on port ${PORT}`));