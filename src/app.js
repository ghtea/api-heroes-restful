import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import Book from './models/Book';

const HeroBasic = require('./models/HeroBasic');
const PlanTeam = require('./models/PlanTeam');
const PlayerMmr = require('./models/PlayerMmr');



dotenv.config({ 
  path: './.env' 
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/books', require('./routes/books'));
app.use('/PlanTeam', require('./routes/PlanTeam'));

mongoose
.connect(process.env.DB_URL, {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});





const port = parseInt(process.env.PORT);
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);