const crypto = require('crypto');

// Difficulty: Number of leading zeros required in hash (start low for testing)
const DIFFICULTY = 1; // e.g., Hash must start with '0'

// 1. Generate a challenge for the client
const getChallenge = (req, res) => {
  const challenge = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  // Sign the challenge to prevent spoofing
  const signature = crypto.createHmac('sha256', 'pow_secret').update(challenge + timestamp).digest('hex');
  
  res.json({ challenge, timestamp, signature, difficulty: DIFFICULTY });
};

// 2. Verify the client's solution
const verifyPoW = (req, res, next) => {
  // Skip PoW for simple GET requests if desired, or strictly enforce for /join
  if (req.method === 'GET') return next();

  const { pow } = req.body; // Expect { challenge, nonce, solution, timestamp, signature }

  if (!pow) return res.status(400).json({ error: 'Proof of Work required' });

  // A. Verify server signature (ensure we issued this challenge)
  const expectedSig = crypto.createHmac('sha256', 'pow_secret').update(pow.challenge + pow.timestamp).digest('hex');
  if (expectedSig !== pow.signature) return res.status(403).json({ error: 'Invalid challenge signature' });

  // B. Verify time window (challenge expires in 60s)
  if (Date.now() - pow.timestamp > 60000) return res.status(403).json({ error: 'Challenge expired' });

  // C. Verify the Hash work
  const input = pow.challenge + pow.nonce;
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  const prefix = '0'.repeat(DIFFICULTY);
  if (!hash.startsWith(prefix)) {
    return res.status(403).json({ error: 'Incorrect Proof of Work solution' });
  }

  next();
};

module.exports = { getChallenge, verifyPoW };