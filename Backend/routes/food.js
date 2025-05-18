const express = require('express');
const router = express.Router();
const db = require('../config/db'); 



router.get('/getNutrition/:id', (req, res) => {
 const  { id }  = req.params;
  const foodId = parseInt(id, 10);
  const query = 'SELECT * FROM nutrition WHERE food_item_id = ?';
  db.query(query, [foodId], (err, results) => {
    if (err) {
      console.error('Error fetching Item:', err);
      return res.status(500).json({ message: 'Failed to fetch.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: ' Not found.' });
    }
    res.json(results[0]);
  });
});

router.get('/', (req, res) => {
 
  const query = 'SELECT * FROM food_items';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching :', err);
      return res.status(500).json({ message: 'Failed to fetch food items.' });
    }
    
    res.json(results);
  });
});

router.get('/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Name query is required' });
  }

  const query = 'SELECT * FROM food_items WHERE name LIKE ?';
  const searchTerm = `%${name}%`;

  db.query(query, [searchTerm], (err, results) => {
    if (err) {
      console.error('Error searching food items:', err);
      return res.status(500).json({ message: 'Failed to search food items.' });
    }
    res.json(results);
  });
});





module.exports = router;