import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// -------------------- MODELS --------------------

// Ticket model
const ticketSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: "Queue", required: true },
  joinedAt: { type: Date, default: Date.now },
});
const Ticket = mongoose.model("Ticket", ticketSchema);

// Queue model
const queueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Queue = mongoose.model("Queue", queueSchema);

// -------------------- EXPRESS APP SETUP --------------------

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4000;

// -------------------- ROUTES --------------------

// Root test route
app.get("/", (req, res) => {
  res.send("✅ ZeroQ Backend is Running Successfully!");
});

// Join queue route
app.post("/api/queues/:queueName/join", async (req, res) => {
  try {
    const { queueName } = req.params;
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ error: "userName is required" });
    }

    // Find or create the queue
    let queue = await Queue.findOne({ name: queueName });
    if (!queue) {
      queue = await Queue.create({ name: queueName });
    }

    // Create a ticket for the user
    const ticket = await Ticket.create({
      userName,
      queueId: queue._id,
    });

    res.status(201).json({
      message: `User ${userName} joined queue '${queueName}'`,
      ticket,
    });
  } catch (err) {
    console.error("❌ Error in join route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------------------- DATABASE CONNECTION --------------------

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://zeroqadmin:ZeroQ123!@clusterparvv.vnlytgv.mongodb.net/?appName=Clusterparvv"
    );
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

startServer();
