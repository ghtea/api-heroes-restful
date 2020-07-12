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
*/


// CREATE PlanTeam   항상 배틀태그와 함께 시작함에 주의 or 배틀태그 없이 시작해도?
// new PlanTeam 이 가능해진다 (쉬워진다)
router.post('/', async (req, res, next) => {
  
  try {
    
    let planTeam = new PlanTeam(
      { 
        _id: req.body._id
        , password: req.body.password
        , title: req.body.title
        
      });
    
    await planTeam.save();
    
    res.send("new plan has been created!");
    
  } catch(error) { next(error) }
  
});





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




//UPDATE
// ?: promise 반환할 필요없이 response 만 반환하면 될듯?
// 이미 존재 확실한, planTeam, player(battletag) 에 대해서 업데이트
// 예: 특정 플레이어 mmr planTeam 에 넣기
router.put('/:idPlanTeam', async (req, res, next) => {
  try {
  
    if (req.body.filter && req.body.update) {
      
      const filter = req.body.filter;
      const update = req.body.update;
      
      await PlanTeam.updateOne(filter, update);
      
      res.send("plan has been updated!");  // res 에 아무것도 안주면 응답 없다고 에러 발생!
      
      
    } else { res.send('filter & update obj are necessary')  }
    
  } catch(error) {next(error)}
  
});


/*
예를 들어, planteam 에 player 추가 할때!
유력 한 방법
PlanTeam.updateOne(
   { _id: idPlanTeam, "listPlayerEntry._id": battletag },
   { $set: { "listPlayerEntry.$.mmr" : 6 } }
)
*/



// DELETE
// READ PlanTeam
router.delete('/:idPlanTeam', async (req, res, next) => {
  
  try {
  
    const filter = { _id: req.params.idPlanTeam };
    
    PlanTeam.deleteOne(filter, (err, planTeam) => {
      if(err) return res.status(500).json({error: err});
      else if(!planTeam) { return res.status(404).json({error: 'PlanTeam not found'}); }
      else { res.send("plan has been deleted");}
    });
    
  } catch(error) { next(error) }
  
});



module.exports = router;









/*
// ADD OR UPDATE PlanTeam   없을 때 생성해야 하는 가능성을 포함

// 그냥 생성과 수정 나눠서 하는게 나을듯? upsert가 생각보다 좋지만은 않은듯...  
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

*/








/*

let planTeam = await PlanTeam.findOne({_id : idPlanTeam});
const playerEntry = planTeam.listPlayerEntry.id(battletag); // ? 이거는 그냥 promise 반환하는게 아니라 비동기로 해도 되는듯?
playerEntry.set({mmrStandard: newMmrStandard});
await planTeam.save();

        .then((home) => {
          
            const tes=home.post.id("5a3fe65546c99208b8cc75b1");
            tes.set({"title" : "it workssdfg"});
            home.save();
        })
        .catch((err)=>{
            console.log("error");
        });
        
*/

/*
HomeModel.findOne({name : "tiger"})
        .then((home) => {
            console.log("findone")
            const tes=home.post.id("5a3fe65546c99208b8cc75b1");
            tes.set({"title" : "it workssdfg"});
            home.save();
        })
        .catch((err)=>{
            console.log("error");
        });
        */
