var express = require('express');
var Book = require('../models/Book');

var router = express.Router();

// GET ALL BOOKS
router.get('/', (req, res) => {
  Book.find({},(err, books) => {
    if (err) return res.status(500).send({
      error: 'database failure'
    });
    res.json(books);
  })
});


// GET SINGLE BOOK
router.get('/:idBook', (req, res) => {
  Book.findOne({_id: req.params.idBook}, (err, book) => {
    if(err) return res.status(500).json({error: err});
    if(!book) return res.status(404).json({error: 'book not found'});
    res.json(book);
  })
});
  


// GET BOOKS BY AUTHOR
router.get('/author/:author', (req, res) => {
  Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  (err, books) => {
    if(err) return res.status(500).json({error: err});
    if(books.length === 0) return res.status(404).json({error: 'book not found'});
    res.json(books);
  })
});
  


// CREATE BOOK
router.post('/', (req, res) => {
  let book = new Book();
  book.title = req.body.title;
  book.author = req.body.author;
  //book.published_date = new Date(req.body.published_date);

  book.save((err) => {

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


// UPDATE THE BOOK
router.put('/:idBook', (req, res) => {
  Book.findById(req.params.idBook, (err, book) => {
    if(err) return res.status(500).json({ error: 'database failure' });
    if(!book) return res.status(404).json({ error: 'book not found' });

    if(req.body.title) book.title = req.body.title;
    if(req.body.author) book.author = req.body.author;

    book.save((err) => {
      if(err) res.status(500).json({error: 'failed to update'});
      res.json({message: 'book updated'});
    });

  });

});


// DELETE BOOK
router.delete('/:idBook', (req, res) => {
  Book.remove({ _id: req.params.idBook }, (err, output) => {
    if(err) return res.status(500).json({ error: "database failure" });

    /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
    if(!output.result.n) return res.status(404).json({ error: "book not found" });
    res.json({ message: "book deleted" });
    */

    res.status(204).end();
  })
});
  

module.exports = router;
