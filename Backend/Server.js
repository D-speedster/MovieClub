const express = require('express');
const connectDB = require('./utils/db');
const AuthPage = require('./router/Auth')
const contentPage = require('./router/Content');
const trailerPage = require('./router/Trailer');
var session = require('express-session')
const multer = require('multer');
const cookieParser = require('cookie-parser');
const isAuth = require('./middlewares/isAuth');
const env = require('dotenv').config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
let filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(new Error('invalid file'))
    }
}
const upload = multer({ storage, filefilter });
const app = express();
const PORT = process.env.PORT;
app.use((req, res, next) => {
    const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    res.header('Access-Control-Allow-Origin', allowedOrigin)
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))

app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/auth', AuthPage)
app.use('/content', upload.single('poster'), contentPage)
app.use('/trailers', trailerPage)
app.get('/', (req, res, next) => {
    res.send('hello from express')
})
app.get('/profile', isAuth, (req, res) => {
    res.json({
        message: 'Protected route',
        user: req.user
    });
});
connectDB()
app.listen(process.env.PORT, () => {
    console.log(`We Are Online on localhost:${PORT}`)
})
