const ContentSchema = require('../models/content')

exports.PostContent = (req, res, next) => {

    res.json({ message: 'you can successfuly send post request' })
    let { title, type, actors, director, countries, writer, genres, rate, duration, description } = req.body
    const poster = req.file.filename;
    const geners = genres.split(',').map((e) => e.trim());
    ContentSchema.create({ title, type, actors, director, countries, writer, genres: geners, rate, duration, description, poster })
}
exports.GetContent = async (req, res, next) => {
    const Movies = await ContentSchema.find({})
    // if (Movies.length === 0) {
    //     res.send('oooops,we cant find any movie')
    // }
    // console.log(Movies);

    res.json(Movies)
}
exports.DeleteContent = async (req, res, next) => {
    const { id } = req.params;
}
exports.EditContent = async (req, res, next) => {
    const { id } = req.params;
    const { title, type, actors, director, countries, writer, genres, rate, duration, description } = req.body;
};

