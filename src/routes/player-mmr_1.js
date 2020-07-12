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
router.get('/:battletag', async (req, res, next) => {
  
  try {
  
    const filter = { _id: req.params.battletag };
    
    PlayerMmr.findOne(filter, (err, playerMmr) => {
      if(err) return res.status(500).json({error: err});
      else if(!playerMmr) { return res.status(404).json({error: 'PlayerMmr not found'}); }
      else { res.json(playerMmr); }
    });

    
  } catch(error) { next(error) }
  
});



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
    
    try {
      objPlayerMmr = await readPlayerMmr( battletag ); // read from heroesprofile
      
    } 
      catch (error) { 
      res.send("failed in reading from heroes profile api")
    }
    
    const newPlayerMmr = putMmrStandardToPlayerMmr(objPlayerMmr, 0); // including mmr standard
    const update1 = {...newPlayerMmr, updated: dateUpdated } // including update date
      
    
    const option1 = {upsert: true }; // upser -> add if not exist
    
    try {
      await PlayerMmr.findOneAndUpdate(filter1, update1, option1);   // add to cPlayerMmr
    }
    catch (error) {
      res.send("failed in reading from heroes profile api")
    }
    
    ////////////////
    
    // add/update to 
    const filter2 = {
      _id: idPlanTeam
      , "listPlayerEntry._id": battletag     
    };
    
    const update2 = {
      $set: { 
        "listPlayerEntry.0._id" : battletag 
        , "listPlayerEntry.0.name" : name 
        , "listPlayerEntry.0.status" : status 
      }
  	}
    
    const option2 = {upsert: true }; // upser -> add if not exist
    
    try {
      await PlanTeam.findOneAndUpdate(filter2, update2, option2);   // add to cPlanTeam (can be updating too)
      res.send("successfully added")
    }
    catch (error) {
      res.send("failed in adding my backend")
    }
    
  } catch(error) { next(error) }
})
      
// refs
// https://stackoverflow.com/questions/26328891/push-value-to-array-if-key-does-not-exist-mongoose
// https://stackoverflow.com/questions/15921700/mongoose-unique-values-in-nested-array-of-objects
    
    
        
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



module.exports = router;
