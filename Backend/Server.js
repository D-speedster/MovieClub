const express = require('express');
const app = express();
const env = require('dotenv').config()
const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', (req, res, next) => {
    res.send('hello from express')
})
app.listen(process.env.PORT, () => {
    console.log(`We Are Online on localhost:${PORT}`)
})