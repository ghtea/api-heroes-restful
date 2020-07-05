import express from 'express';


import PlanTeam from '../models/PlanTeam';

var router = express.Router();



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
  



// CREATE PlanTeam
router.post('/', (req, res) => {
  let planTeam = new PlanTeam();
  planTeam.title = req.body.title;
  planTeam.author = req.body.author;
  //PlanTeam.published_date = new Date(req.body.published_date);

  planTeam.save((err) => {

    if (err) {
      console.error(err);
      res.json({
        result: 0
      });
      return;
    }

    res.json({
      result: 1
    });

  });
});


// UPDATE THE PlanTeam
router.put('/:idPlanTeam', async (req, res, next) => {
  try {
  
    if (req.body.filter && req.body.update) {
      
      const filter = req.body.filter;
      const update = req.body.update;
      const option = {returnNewDocument: true};
      
      const result = await PlanTeam.findOneAndUpdate(filter, update, option);
      
      return new Promise((resolve, reject)=> {
        if (!result) { console.log('already exists or error'); return;}
        else { console.log('sucessfully updated'); resolve(result); }
      })
      
    } else { res.json( { error: 'filter & update obj are needed' }) }
    
  } catch(error) {next(error)}
  
});




// DELETE PlanTeam
router.delete('/:idPlanTeam', (req, res) => {
  PlanTeam.remove({ _id: req.params.idPlanTeam }, (err, output) => {
    if(err) return res.status(500).json({ error: "database failure" });

    /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
    if(!output.result.n) return res.status(404).json({ error: "PlanTeam not found" });
    res.json({ message: "PlanTeam deleted" });
    */

    res.status(204).end();
  })
});


module.exports = router;
/*
router.put('/:idPlanTeam', (req, res) => {
  
  PlanTeam.findById(req.params.idPlanTeam, (err, planTeam) => {
    if(err) return res.status(500).json({ error: 'database failure' });
    if(!planTeam) return res.status(404).json({ error: 'planTeam not found' });

    if(req.body.title) planTeam.title = req.body.title;
    if(req.body.author) planTeam.author = req.body.author;

    planTeam.save((err) => {
      if(err) res.status(500).json({error: 'failed to update'});
      res.json({message: 'planTeam updated'});
    });

  });

});
*/