const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/sql/Admin');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) return res.status(404).json({ error: 'User not found' });

    const validPass = await bcrypt.compare(password, admin.password_hash);
    if (!validPass) return res.status(401).json({ error: 'Invalid password' });

    // Issue JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role, org: admin.organization_name },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '12h' }
    );

    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  // In a real app, protect this route! Only Super Admin should create Org Admins.
  try {
    const { username, password, orgName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = await Admin.create({
      username,
      password_hash: hashedPassword,
      role: 'ORG_ADMIN',
      organization_name: orgName
    });

    res.json({ message: 'Admin created', id: newAdmin.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;