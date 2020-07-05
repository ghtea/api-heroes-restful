var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schemaModeMmr = new Schema({
  mmr: Number,
  games_played: Number,
  league_tier: String
});


var schemaRegionMmr = new Schema({
  QM: schemaModeMmr,
  UD: schemaModeMmr,
  HL: schemaModeMmr,
  TL: schemaModeMmr,
  SL: schemaModeMmr
});


var schemaPlayerMmr = new Schema({
  _id: String,
  
  NA: schemaRegionMmr,
  EU: schemaRegionMmr,
  KR: schemaRegionMmr,
  CN: schemaRegionMmr
}, { collection: 'playerMmrs', versionKey: false});

module.exports = mongoose.model('PlayerMmr', schemaPlayerMmr);