require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const ADMIN = {
    name: 'مدیر سیستم',
    username: 'admin',
    email: 'admin@movieclub.ir',
    password: 'Admin@1234',
    role: 'Owner'
};

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const exists = await User.findOne({ username: ADMIN.username });
        if (exists) {
            console.log('Admin already exists — updating role to Owner...');
            exists.role = 'Owner';
            await exists.save();
            console.log('Role updated.');
            process.exit(0);
        }

        const hashed = await bcrypt.hash(ADMIN.password, 10);
        await User.create({
            name: ADMIN.name,
            username: ADMIN.username,
            email: ADMIN.email,
            password: hashed,
            role: ADMIN.role
        });

        console.log('Admin user created!');
        console.log('Username:', ADMIN.username);
        console.log('Password:', ADMIN.password);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

createAdmin();

