import express from 'express';

import PlayerMmr from '../models/PlayerMmr';
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




// ADD OR UPDATE PlayerMmr   생성 수정은 이걸로 모두 해결
router.put('/', async (req, res, next) => {
  try {
  
    if (req.body.filter) {
      
      
      
      const objPlayerMmr = await readPlayerMmr( req.body.filter._id );
      
      const filter = req.body.filter;
      
      const update = putMmrStandardToPlayerMmr(objPlayerMmr, 0);
      
      const option = {returnNewDocument: true, upsert: true }; // upser -> add if not exist
      
      const result = await PlayerMmr.findOneAndUpdate(filter, update, option);
      
      
      res.send("ahr working"); // res 에 아무것도 안주면 응답 없다고 에러 발생!
      
      return new Promise((resolve, reject)=> {
        if (!result) { console.log('not updated') }
        else { console.log('sucessfully updated'); resolve(result); }
      })
      
    } else { res.json( { error: 'filter & update obj are necessary' }) }
    
  } catch (error) {next(error)}
  
});






module.exports = router;
