import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';


const HeroBasic = require('./models/HeroBasic');
const PlanTeam = require('./models/PlanTeam');
const PlayerMmr = require('./models/PlayerMmr');



dotenv.config({ 
  path: './.env' 
});
const app = express();

/*
// still show error, but works in database
app.use( (req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/

app.use(cors());

//const corsOptions = {credentials: true, origin: true}
//app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/PlanTeam', require('./routes/PlanTeam'));
app.use('/PlayerMmr', require('./routes/PlayerMmr'));

mongoose
.connect(process.env.DB_URL, {
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});



const port = parseInt(process.env.PORT);
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);



/*
useFindAndModify: false
https://mongoosejs.com/docs/deprecations.html#findandmodify
*/