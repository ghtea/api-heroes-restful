var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schemaRoleGames = new Schema({
  _id: String,
  
  Tank: Number,
  Bruiser: Number,
  "Melee Assassin": Number,
  "Ranged Assassin": Number,
  Healer: Number,
  Support: Number,

  updated: Date
  
});


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
  regions:[String], // 특정 게임 이상 지역, 그 이하면 그나마 게임한 지역 1개
  
  roles: [String],
  
  groups: [String],
  
  tags: [String]
  
});




var schemaTeamGenerated = new Schema({
  _id: String,
  listPlayerBattletag: [String],
  name: String,
  group: String
});

var schemaResultTeam = new Schema({
  _id: String,
  added: Date,
  listGroup: [String],
  listTeam: [schemaTeamGenerated]
});
 
 
var schemaOptionTeam = new Schema({
  _id: String,
  region: String,
  numberTeams: Number,
  
  numberGroups: Number,
  listGroup: [String],
});


var schemaPlanTeam = new Schema({
  _id: String,
  password: String,
  title: String,
  
  listPlayerEntry: [schemaPlayerEntry],
  
  listResult: [schemaResultTeam],
  
  option: schemaOptionTeam
  
}, { collection: 'cPlanTeam', versionKey: false});



module.exports = mongoose.model('PlanTeam', schemaPlanTeam);