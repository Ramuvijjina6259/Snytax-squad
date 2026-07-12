const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const test = async () => {
  await connectDB();
  const admin = await Admin.findOne({ email: 'admin@syntaxsquad.dev' });
  console.log('Admin found:', admin);
  if (admin) {
    const isMatch = await admin.matchPassword('Admin@123456');
    console.log('Password Match for Admin@123456:', isMatch);
  } else {
    console.log('Admin not found!');
  }
  process.exit(0);
};

test();
