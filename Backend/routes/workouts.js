const express = require('express');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config();

// Add Workout
router.post('/addWorkout', (req, res) => {
  const user_id = req.user.id;
  const { duration_minutes, workout_date, workout_type, calories_burned } = req.body;
  const date = new Date(workout_date).toISOString().split('T')[0]; 
  const query = `INSERT INTO workouts (user_id, duration_minutes, workout_date, workout_type, calories_burned)
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [user_id, duration_minutes, date, workout_type, calories_burned], (err, results) => {
    if (err) {
      console.error('Error adding workout record:', err);
      return res.status(500).json({ message: 'Failed to add workout.' });
    }
    // Return inserted workout ID
    res.status(201).json({ workout_id: results.insertId });
  });
});

// Update Workout by ID
router.put('/updateWorkout/:id', (req, res) => {
  const {  duration_minutes, workout_date, workout_type, calories_burned } = req.body;
   
  const workoutId = req.params.id;

  const query = `UPDATE workouts SET  duration_minutes = ?, workout_date = ?, workout_type = ?, calories_burned = ? WHERE workout_id = ?`;

  db.query(query, [ duration_minutes, workout_date, workout_type, calories_burned, workoutId], (err, results) => {
    if (err) {
      console.error('Error updating workout record:', err);
      return res.status(500).json({ message: 'Failed to update workout.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Workout not found.' });
    }
    res.json({ message: 'Workout updated successfully.' });
  });
});

// Delete Workout by ID
router.delete('/deleteWorkout/:id', (req, res) => {
  const workoutId = req.params.id;
  const query = `DELETE FROM workouts WHERE workout_id = ?`;

  db.query(query, [workoutId], (err, results) => {
    if (err) {
      console.error('Error deleting workout:', err);
      return res.status(500).json({ message: 'Failed to delete workout.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Workout not found.' });
    }
    res.json({ message: 'Workout deleted successfully.' });
  });
});

router.post('/getUserWorkouts', (req, res) => {
  const user_id = req.user.id
  const { date } = req.body;

  if (!user_id || !date) {
    return res.status(400).json({ message: 'Missing user_id or date.' });
  }

  const formattedDate = new Date(date).toISOString().split('T')[0];
  const query = 'SELECT * FROM workouts WHERE user_id = ? AND workout_date = ?';

  db.query(query, [user_id, formattedDate], (err, results) => {
    if (err) {
      console.error('Error fetching workouts:', err);
      return res.status(500).json({ message: 'Failed to fetch workouts.' });
    }
    res.json(results);
  });
});

module.exports = router;
