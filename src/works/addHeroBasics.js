
// have not test here yet

import mongoose from 'mongoose';
import dotenv from "dotenv"
import axios from 'axios'


let HeroBasic = require('../models/HeroBasic');

dotenv.config({ 
  path: './.env' 
});



// mongo db 와 연결
mongoose
.connect(process.env.DB_URL, {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});



const getHeroIds = async () => {
  try {
    const response = await axios.get(`https://api.heroesprofile.com/openApi/Heroes`)
    const objHeroes = response.data;
    
    const listHeroNames = Object.keys(objHeroes) ;
    const listHeroId = listHeroNames.map((name, i)=>  objHeroes[listHeroNames[i]]["short_name"] )
    
    console.log(listHeroId);
    
    return new Promise(function(resolve, reject) {
      resolve(listHeroId);
    });
    
  } catch (error) {
      console.log("heroesprofile api isn't working");
      console.error(error);
  }
};
    


// thelostvikings => lostvikings, thebutcher => butcher
const idIntoIdHeroesTalents = (id) => {
  let idHeroesTalents;
  
  switch (id){
    case "thelostvikings" :
    idHeroesTalents = "lostvikings";
    break;
   case "cho" :
    idHeroesTalents = "chogall";
    break;
    
    default :
    idHeroesTalents = id;
  }
    return idHeroesTalents
}



// 모든 문서 삭제후 다시 올리기
const addHeroBasic = async (_id) => {
  
	try {
	  
	  const idHeroesTalents = idIntoIdHeroesTalents(_id);
    const res = await axios.get(`https://heroes-talents.avantwing.com/hero/${idHeroesTalents}.json`);
	  const hero = res.data;
		
		let newHeroBasic = {
			_id: _id
			,idHeroesTalents: idHeroesTalents
			
			,name: hero["name"]
			,role: hero["expandedRole"]
			,type: hero["type"]
			
			,tags: hero["tags"]
	  }
	  
    const heroBasic = new HeroBasic(newHeroBasic);
    
    await heroBasic.save();
    //await HeroBasic.update({_id: _id}, heroBasic, { upsert: true });
    
  	return new Promise(function(resolve, reject) {
      resolve();
    });
  
  } catch (error) {
  		console.error(error);
  }

}



const entire = async () => {
  let listHeroId = await getHeroIds();
  await HeroBasic.deleteMany({}, function(err) {})
  await Promise.all( listHeroId.map((element, i) => addHeroBasic(element)) )
  console.log("succeeded!");
}

  
  
entire();
