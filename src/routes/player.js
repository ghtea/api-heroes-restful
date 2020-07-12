import express from 'express';

import PlayerMmr from '../models/PlayerMmr';
import PlanTeam from '../models/PlanTeam';

import readPlayerMmr from '../works/readPlayerMmr'
import putMmrStandardToPlayerMmr from '../works/putMmrStandardToPlayerMmr'

var router = express.Router();



/*
// GET SINGLE PlayerMmr
router.get('/', (req, res) => {
  PlayerMmr.findOne({_id: req.params.idPlanTeam}, (err, planTeam) => {
    if(err) return res.status(500).json({error: err});
    if(!planTeam) return res.status(404).json({error: 'planTeam not found'});
    res.json(planTeam);
  })
});
*/


// READ PlayerMmr
router.get('/read-mmr', async (req, res, next) => {
  
  try {
    const battletag = req.body.battletag;
    const filter = { _id: battletag };
    
    PlayerMmr.findOne(filter, (err, playerMmr) => {
      if(err) return res.status(500).json({error: err});
      else if(!playerMmr) { return res.status(404).json({error: 'PlayerMmr not found'}); }
      else { res.json(playerMmr); }
    });

    
  } catch(error) { next(error) }
  
});


// 우선 add 버튼 누를 때 할 작업 모두 다...
// first add to planTeam (only Name, Battletag, idPlanTeam + status)
// heroesprofile api 에서 battletag 확인

//ex: ahr.avantwing.com/plan-team/1234465646313/addPlayer
router.put('/add', async (req, res, next) => {
  try {
    
    
    if ( !(req.body.idPlanTeam) ) { }
    else if ( !(req.body.battlelog) ) { }
    else if ( !(req.body.name) ) { }
    else if ( !(req.body.status) ) { }
    
    
    const idPlanTeam = req.body.idPlanTeam;
    const battletag = req.body.battletag;
    const name = req.body.name;
    const status = req.body.status;
    
    console.log(idPlanTeam, battletag, name, status)
    
    // add/replace to cPlayerMmr
    const filter1 = {_id: battletag};
    
    const dateUpdated = Date.now();
    
    let objPlayerMmr;
    
    
    objPlayerMmr = await readPlayerMmr( battletag ); // read from heroesprofile
    
    const newPlayerMmr = putMmrStandardToPlayerMmr(objPlayerMmr, 0); // including mmr standard
    newPlayerMmr['updated'] = dateUpdated;
    
    const update1 = newPlayerMmr // including update date
      
    console.log(update1)
    const option1 = {upsert: true }; // upser -> add if not exist
    
    
    await PlayerMmr.findOneAndUpdate(filter1, update1, option1);   // add to cPlayerMmr
    
    
    ////////////////
    
  
    const filter2 = {
      _id: idPlanTeam
      , "listPlayerEntry._id" : {$ne: battletag}  // 이미 목록에 있는 상태라면 건디리지 않는다.
    };
    
    const update2 = {
      $push: {
        listPlayerEntry: 
        {
          _id : battletag 
          , name : name 
          , status : status 
        }
      }
    }
  	// 더 공부하자
  	// https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
  	
    await PlanTeam.updateOne(filter2, update2);
      
    
    //////////////
    
    
    let mmrForPlayerEntry = {
      standard: {}
      ,manual: {}
    };
    
    mmrForPlayerEntry["standard"]["NA"] = newPlayerMmr["NA"]["STANDARD"]; // newPlayerMmr["NA"]["STANDARD"]
    mmrForPlayerEntry["standard"]["EU"] = newPlayerMmr["EU"]["STANDARD"];
    mmrForPlayerEntry["standard"]["KR"] = newPlayerMmr["KR"]["STANDARD"];
    mmrForPlayerEntry["standard"]["CN"] = newPlayerMmr["CN"]["STANDARD"];
    
    
    const filter3 = {
      _id: idPlanTeam
      ,"listPlayerEntry._id" : battletag
    };
    
    const update3 = { 
      $set: { 
        "listPlayerEntry.$.mmr" : mmrForPlayerEntry 
      } 
    }
    
    await PlanTeam.updateOne(filter3, update3);  
   
    
    res.send("successfully added")
    
  } catch(error) { next(error) }
})
      
// refs
// https://stackoverflow.com/questions/26328891/push-value-to-array-if-key-does-not-exist-mongoose
// https://stackoverflow.com/questions/15921700/mongoose-unique-values-in-nested-array-of-objects














// 즉 read from heroes profile + update in cPlanTeam
// 이미 추가된걸 알고 있는 플레이어에 대해서 mmr 추가/업데이트
// 방안 1    // 다른 정보는 update-others 로 따로 하나만 더 만들자!
router.put('/update-mmr', async (req, res, next) => {
  try {
    
    
    if ( !(req.body.idPlanTeam) ) { }
    else if ( !(req.body.battlelog) ) { }
   
    
    
    const idPlanTeam = req.body.idPlanTeam;
    const battletag = req.body.battletag;
    
    
    const dateUpdated = Date.now();
    const objPlayerMmr = await readPlayerMmr( battletag ); // read from heroesprofile
    
    const newPlayerMmr = putMmrStandardToPlayerMmr(objPlayerMmr, 0); // including mmr standard
    newPlayerMmr['updated'] = dateUpdated;
    
    
    const filter1 = {_id: battletag};
    const update1 = newPlayerMmr // including update date
      
    
    await PlayerMmr.findOneAndUpdate(filter1, update1);   // add to cPlayerMmr
    
    
    ////////////////
    
  
       
    
    const filter2 = {
      _id: idPlanTeam
      , "listPlayerEntry._id" : {$ne: battletag}  // 이미 목록에 있는 상태라면 건디리지 않는다.
    };
    
    const update2 = {
      $push: {
        listPlayerEntry: 
        {
          _id : battletag 
          , name : name 
          , status : status 
        }
      }
    }
  	// 더 공부하자
  	// https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
  	
    //const option2 = {upsert: true }; // upser -> add if not exist
    
    /*
   
      await PlanTeam.updateOne(filter2, update2);   // add to cPlanTeam (can be updating too)
    */
    
    await PlanTeam.updateOne(filter2, update2);
    
      
    res.send("successfully added")
    
    
  } catch(error) { next(error) }
})
   


// 방안 2
//ex: ahr.avantwing.com/plan-team/1234465646313/addPlayer
router.put('/update-mmr', async (req, res, next) => {
  try {
    
    const idPlanTeam = req.body.idPlanTeam;
    const battletag = req.body.battletag;
    const status = req.body.status;
    
    
    const playerMmr = await axios.get( `https://ahr.avantwing.com/player/${battletag}` ); // read from my database
    
    
    //newPlayerMmr['updated'] = dateUpdated;
    
    let mmrForPlayerEntry = {
      standard: {}
      ,manual: {}
    };
    
    mmrForPlayerEntry["standard"]["NA"] = 1111; // objPlayerMmr["NA"]["STANDARD"]
    mmrForPlayerEntry["standard"]["EU"] = 2222;
    mmrForPlayerEntry["standard"]["KR"] = 3333;
    mmrForPlayerEntry["standard"]["CN"] = 4444;
    
    
    const filter = {
      _id: idPlanTeam
      ,"listPlayerEntry._id" : battletag
    };
    
    const update = 
      { 
        $set: { 
          "listPlayerEntry.$.mmr" : mmrForPlayerEntry 
        } 
      }
    
    await PlanTeam.updateOne(filter, update);
    
    res.send("successfully updated")
    
  } catch(error) { next(error) }
})
      
      
      
module.exports = router;

    
    
    
    
    
    
    
    
        
        /*
        
        let mmrForPlayerEntry = {
          standard: {}
          ,manual: {}
        };
        
        
        mmrForPlayerEntry["standard"]["NA"] = 1111; // objPlayerMmr["NA"]["STANDARD"]
        mmrForPlayerEntry["standard"]["EU"] = 2222;
        mmrForPlayerEntry["standard"]["KR"] = 3333;
        mmrForPlayerEntry["standard"]["CN"] = 4444;
        
        
        const filterPlanTeamPut = {
          _id: idPlanTeam
          , "listPlayerEntry._id": battletag
        };
        
        const updatePlanTeamPut = {
          $set: { 
            "listPlayerEntry.$.mmr" : newMmr 
            ,
          }
      	}
        
        
         _id: battletag
          , name: name
          , status: status
          
          
        await PlanTeam.updateOne(filter, update);
      }


{
    
      filter: {
        _id: idPlanTeam
        , "listPlayerEntry._id": battletag
      }		
      
      ,update: {
        $set: { "listPlayerEntry.$.mmr" : newMmr }
    	}
  	
    }




          res.json("player's mmr has benn added/updated"); // res 에 아무것도 안주면 응답 없다고 에러 발생!
      
    } else { res.json( { error: 'filter & update obj are necessary' }) }
    
  } catch (error) {next(error)}
  
});


// 1. heroes profile 에서 정보읽기 -> ->  update 정보, mmr standard 추가 -> my database "cPlayerMmr" 에 저장  -> my database "cPlanTeam" 의 listPlayerEntry 에 저장 

// ADD OR UPDATE PlayerMmr on cPlayerMmr   생성 수정은 이걸로 모두 해결
router.put('/:battletag', async (req, res, next) => {
  try {
    
  
    if (req.body.battletag) {
      
      const filter1 = {_id: req.body.battletag};
      
      const objPlayerMmr = await readPlayerMmr( req.body.filter._id );
      const newPlayerMmr = putMmrStandardToPlayerMmr(objPlayerMmr, 0);
      const update1 = {...newPlayerMmr, updated:Date.now() }
      
      const option1 = {upsert: true }; // upser -> add if not exist
      
      await PlayerMmr.findOneAndUpdate(filter1, update1, option1);
      
      
      if (req.body.idPlanTeam) {
        
        const idPlanTeam = req.body.idPlanTeam;
        
        let mmrForPlayerEntry = {
          standard: {}
          ,manual: {}
        };
        
        
        mmrForPlayerEntry["standard"]["NA"] = 1111; // objPlayerMmr["NA"]["STANDARD"]
        mmrForPlayerEntry["standard"]["EU"] = 2222;
        mmrForPlayerEntry["standard"]["KR"] = 3333;
        mmrForPlayerEntry["standard"]["CN"] = 4444;
        
        
        const filterPlanTeamPut = {
          _id: idPlanTeam
          , "listPlayerEntry._id": battletag
        };
        
        const updatePlanTeamPut = {
          $set: { 
            "listPlayerEntry.$.mmr" : newMmr 
            ,
          }
      	}
        
        
         _id: battletag
          , name: name
          , status: status
          
          
        await PlanTeam.updateOne(filter, update);
      }


{
    
      filter: {
        _id: idPlanTeam
        , "listPlayerEntry._id": battletag
      }		
      
      ,update: {
        $set: { "listPlayerEntry.$.mmr" : newMmr }
    	}
  	
    }




          res.json("player's mmr has benn added/updated"); // res 에 아무것도 안주면 응답 없다고 에러 발생!
      
    } else { res.json( { error: 'filter & update obj are necessary' }) }
    
  } catch (error) {next(error)}
  
});


*/



