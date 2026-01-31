const express = require('express');
const connectDB = require('./utils/db');
const AuthPage = require('./router/Auth')
const contentPage = require('./router/Content');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
})
const upload = multer({ storage });
const app = express();
const env = require('dotenv').config()
const PORT = process.env.PORT;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }

    next()
})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/auth', AuthPage)
app.use('/content', upload.single('poster'), contentPage)
app.get('/', (req, res, next) => {
    res.send('hello from express')
})
connectDB()
app.listen(process.env.PORT, () => {
    console.log(`We Are Online on localhost:${PORT}`)
})
