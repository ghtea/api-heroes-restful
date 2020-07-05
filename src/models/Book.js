var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: String
    //published_date: { type: Date, default: Date.now  }
}, { collection: 'books', versionKey: false});

module.exports = mongoose.model('Book', bookSchema);