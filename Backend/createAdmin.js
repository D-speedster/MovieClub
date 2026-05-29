const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = require('./models/user');

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const existing = await UserSchema.findOne({ username: 'admin' });
    if (existing) {
        console.log('Admin already exists. Updating role...');
        existing.role = 'Admin';
        await existing.save();
        console.log('Role updated to Admin');
        process.exit(0);
    }

    const hashpass = await bcrypt.hash('admin1234', 10);
    await UserSchema.create({
        name: 'Administrator',
        username: 'admin',
        password: hashpass,
        email: 'admin@movieclub.com',
        role: 'Admin'
    });

    console.log('✅ Admin created successfully');
    console.log('   Username: admin');
    console.log('   Password: admin1234');
    process.exit(0);
}

createAdmin().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
