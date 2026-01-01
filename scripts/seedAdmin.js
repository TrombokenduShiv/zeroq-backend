const bcrypt = require('bcryptjs');
const { connectSQLite } = require('../src/config/sqlite');
const Admin = require('../src/models/sql/Admin');

const seed = async () => {
  await connectSQLite();
  
  const hashedPassword = await bcrypt.hash('ZeroQMaster2025!', 10);
  
  try {
    await Admin.create({
      username: 'superadmin',
      password_hash: hashedPassword,
      role: 'SUPER_ADMIN',
      organization_name: 'ZeroQ HQ'
    });
    console.log('✅ Super Admin Created successfully');
  } catch (e) {
    console.log('ℹ️ Admin likely exists or error:', e.message);
  }
};

seed();