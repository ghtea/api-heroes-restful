var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schemaMmr = new Schema({
  _id: String,
  
  standard: {
    NA: Number,
    EU: Number,
    KR: Number,
    CN: Number 
  },
  
  manual: {
    NA: Number,
    EU: Number,
    KR: Number,
    CN: Number 
  },
  
  updated: Date
  
});



var schemaPlayerEntry = new Schema({
  _id: String,
  name: String,
  
  status: String,
  
  mmr: schemaMmr,
  
  roleGame: {
    auto: [String],
    manual: [String]
  },
  
  roleReal: [String],
  
  group: [String],
  
  language: [String],
  
  tag: [String]
  
});




var schemaTeamGenerated = new Schema({
  _id: String,
  listPlayerBattletag: [String],
  name: String,
  group: String
});

var schemaResultTeam = new Schema({
  _id: String,
  listTeam: [schemaTeamGenerated]
});
 

var schemaPlanTeam = new Schema({
  _id: String,
  password: String,
  title: String,
  
  region: String,
  

  listGroup: [String],
  
  listPlayerEntry: [schemaPlayerEntry],
  listResult: [schemaResultTeam],
  
  option: String
  
}, { collection: 'cPlanTeam', versionKey: false});



module.exports = mongoose.model('PlanTeam', schemaPlanTeam);