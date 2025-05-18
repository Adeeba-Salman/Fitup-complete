const express = require('express');
const router = express.Router();
const db = require('../config/db'); 


router.get('/getUserInfo', (req, res) => {
 const  id  = req.user.id;
  const userId = parseInt(id, 10);
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Failed to fetch User.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(results[0]);
  });
});

// Update a product (U)
router.put('/updateAccount', (req, res) => {
  console.log("Inside put")
  const  id  = req.user.id;
  const userId = parseInt(id, 10);
  const { firstName, lastName, email,password,currentWeight,height,goalCalories,age,gender,goal,activityLevel } = req.body;


  const query = 'UPDATE users SET firstname = ?, lastName = ?, email = ?, password = ?,weight_kg = ?,age = ?,height_cm = ? , daily_calorie_goal = ?,goal = ? , activity_level = ? , gender = ?  WHERE id = ?';
  db.query(query, [firstName, lastName, email,password,currentWeight,age,height,goalCalories,goal,activityLevel,gender,userId], (err, results) => {
    if (err) {
      console.error('Error updating User:', err);
      return res.status(500).json({ message: 'Failed to update.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ success:true,
      updatedInfo : results[0] 
    });
  });
});

// Delete a product (D)
router.delete('/deleteAccount', (req, res) => {
 const  id  = req.user.id;
  const userId = parseInt(id, 10);
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Failed to delete product.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  });
});

module.exports = router;