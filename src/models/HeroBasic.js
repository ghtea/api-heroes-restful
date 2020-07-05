var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaHeroBasic = new Schema({
  _id: String,
  idHeroesTalents: String,
  
  name: String,
  role: String,
  type: String,
  
  tags: [String]
}, { collection: 'heroBasics', versionKey: false});

module.exports = mongoose.model('HeroBasic', schemaHeroBasic);