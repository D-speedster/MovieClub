const ContentSchema = require('../models/content')

exports.PostContent = (req, res, next) => {

    res.json({ message: 'you can successfuly send post request' })
    const { title, type, actors, director, countries, writer, genres, rate, duration, description } = req.body
    const poster = req.file.filename;
    ContentSchema.create({ title, type, actors, director, countries, writer, genres, rate, duration, description, poster })
}

