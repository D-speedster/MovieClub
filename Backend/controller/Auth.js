const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltpass = 10;
const cookieParser = require('cookie-parser');
const env = require('dotenv').config()
exports.PostLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const finduser = await UserSchema.findOne({ username });

        if (!finduser) {
            return res.status(401).json({ error: 'User not found' })
        };
        const checkpassword = await bcrypt.compare(password, finduser.password);
        if (!checkpassword) {
            return res.status(401).json({ error: 'Incorrect password' })
        }
        let token = jwt.sign({
            userId: finduser._id,
            name: finduser.name
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        res.json({ message: 'Login successful' })
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.PostRegister = async (req, res) => {
    try {
        const { name, username, password, email, phone } = req.body;

        const existUser = await UserSchema.findOne({
            $or: [{ username }, { email }]
        });

        if (existUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashpass = await bcrypt.hash(password, saltpass);

        await UserSchema.create({
            name,
            username,
            password: hashpass,
            email,
            phone
        });

        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Register failed' });
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};
