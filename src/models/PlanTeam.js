var mongoose = require('mongoose');
var Schema = mongoose.Schema;





var schemaPlayerEntry = new Schema({
  _id: String,
  
  mmrStandard: {
    NA: Number,
    EU: Number,
    KR: Number,
    CN: Number 
  },
  
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
  region: String,
  

  listGroup: [String],
  
  listPlayerEntry: [schemaPlayerEntry],
  listResult: [schemaResultTeam],
  
  option: String
  
}, { collection: 'cPlanTeam', versionKey: false});



module.exports = mongoose.model('PlanTeam', schemaPlanTeam);