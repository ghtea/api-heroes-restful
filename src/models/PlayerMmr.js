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
  SL: schemaModeMmr, 
  STANDARD: Number
});


var schemaPlayerMmr = new Schema({
  _id: String,
  updated: Date,
  NA: schemaRegionMmr,
  EU: schemaRegionMmr,
  KR: schemaRegionMmr,
  CN: schemaRegionMmr
}, { collection: 'cPlayerMmr', versionKey: false});

module.exports = mongoose.model('PlayerMmr', schemaPlayerMmr);