import express from 'express';


import PlanTeam from '../models/PlanTeam';

var router = express.Router();


/*
// GET ALL PlanTeam
router.get('/', (req, res) => {
  PlanTeam.find((err, listPlanTeam) => {
    if (err) return res.status(500).send({
      error: 'database failure'
    });
    res.json(listPlanTeam);
  })
});


// GET SINGLE PlanTeam
router.get('/:idPlanTeam', (req, res) => {
  PlanTeam.findOne({_id: req.params.idPlanTeam}, (err, planTeam) => {
    if(err) return res.status(500).json({error: err});
    if(!planTeam) return res.status(404).json({error: 'planTeam not found'});
    res.json(planTeam);
  })
});
  
  
*/

// READ PlanTeam
router.get('/:idPlanTeam', async (req, res, next) => {
  
  try {
  
    const filter = { _id: req.params.idPlanTeam };
    
    PlanTeam.findOne(filter, (err, planTeam) => {
      if(err) return res.status(500).json({error: err});
      else if(!planTeam) { return res.status(404).json({error: 'PlanTeam not found'}); }
      else { res.json(planTeam); }
    });

    
  } catch(error) { next(error) }
  
});


// ADD OR UPDATE PlanTeam   생성 수정은 이걸로 모두 해결
router.put('/', async (req, res, next) => {
  try {
  
    if (req.body.filter && req.body.update) {
      
      const filter = req.body.filter;
      const update = req.body.update;
      const option = {returnNewDocument: true, upsert: true };
      
      const result = await PlanTeam.findOneAndUpdate(filter, update, option);
      
      res.send("ahr working");  // res 에 아무것도 안주면 응답 없다고 에러 발생!
      
      return new Promise((resolve, reject)=> {
        if (!result) { console.log('already exists or error'); return;}
        else { console.log('sucessfully updated'); resolve(result); }
      })
      
    } else { res.json( { error: 'filter & update obj are necessary' }) }
    
  } catch(error) {next(error)}
  
});




module.exports = router;
