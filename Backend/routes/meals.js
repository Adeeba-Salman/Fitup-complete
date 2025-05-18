const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();


router.post('/createMeal', async (req, res) => {
    const userId = req.user.id;
    const { meal_name,date } = req.body;
const today = new Date(date).toISOString().split('T')[0]; 
    console.log("In create meal");

    // Step 1: Check if meal already exists
    const checkQuery = `SELECT meal_id FROM meals WHERE user_id = ? AND meal_name = ? AND date = ?`;

    db.query(checkQuery, [userId, meal_name, today], (err, results) => {
        if (err) {
            console.error("Check meal error:", err);
            return res.status(500).json({ message: 'Error checking meal', error: err });
        }

        if (results.length > 0) {
            // Meal already exists
            return res.status(200).json({ message: 'Meal already exists', mealId: results[0].meal_id });
        }

        // Step 2: Create meal
        const insertQuery = `INSERT INTO meals (meal_name, user_id, date) VALUES (?, ?, ?)`;

        db.query(insertQuery, [meal_name, userId, today], (insertErr, insertResults) => {
            if (insertErr) {
                console.error("Insert meal error:", insertErr);
                return res.status(500).json({ message: 'Error creating meal', error: insertErr });
            }

            const mealId = insertResults.insertId;

            console.log("Meal created");
            return res.status(201).json({ message: 'Meal created successfully', mealId });
        });
    });
});

router.post('/addMeal', async (req, res) => {
  const {
    meal_id,
    food_id,
    calories,
    protein,
    carbs,
    fats,
    quantity_gm,
    quantity,
    servingSize
  } = req.body;


  try {

    db.query(
      `INSERT INTO meal_food_items (meal_id, food_id, calories, protein, carbs, fats, quantity_gm, quantity,servingSize)
       VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)`,
      [meal_id, food_id, calories, protein, carbs, fats, quantity_gm, quantity,servingSize]
    );

    res.status(200).json({ message: 'Food item added successfully', meal_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add food item' });
  }
});


router.post('/dayMeals', (req, res) => {
  const user_id = req.user.id;
  const { date } = req.body;

  const query = `
    SELECT 
      m.meal_id,
      m.meal_name,
      m.date,
      mfi.id,
      fi.name,
      fi.id as food_id,
      fi.measurement_type,
      fi.average_grams_per_unit,
      mfi.calories,
      mfi.protein,
      mfi.carbs,
      mfi.fats,
      mfi.quantity_gm,
      mfi.quantity,
      mfi.servingSize
    FROM 
      meals m
    JOIN 
      meal_food_items mfi ON m.meal_id = mfi.meal_id
    JOIN
      food_items fi ON mfi.food_id = fi.id
    WHERE 
      m.user_id = ? AND m.date = ?
    ORDER BY 
      m.meal_name
  `;

  db.query(query, [user_id, date], (err, results) => {
    if (err) {
      console.error('Error fetching meals:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const mealsMap = {};

    results.forEach(row => {
      const {
        id,
        meal_id,
        meal_name,
        food_id,
        date,
        name,
        measurement_type,
        average_grams_per_unit,
        calories,
        protein,
        carbs,
        fats,
        quantity_gm,
        quantity,
        servingSize
      } = row;

      if (!mealsMap[meal_id]) {
        mealsMap[meal_id] = {
          meal_id,
          meal_name,
          date,
          items: []
        };
      }

      mealsMap[meal_id].items.push({
        id,
        name,
        measurement_type,
        average_grams_per_unit,
        food_id,
        calories,
        protein,
        carbs,
        fats,
        quantity_gm,
        quantity,
        servingSize
      });
    });

    const meals = Object.values(mealsMap);
    res.status(200).json({ meals });
  });
});

router.put('/updateMeals/:id', (req, res) => {
  console.log("Inside put")
  const  id  = req.params.id;
 
 const {
    meal_id,
    food_id,
    calories,
    protein,
    carbs,
    fats,
    quantity_gm,
    quantity,
    servingSize
  } = req.body;

  const query = 'UPDATE meal_food_items SET meal_id = ?, food_id = ?, calories = ?, protein = ?, carbs = ?, fats = ?,quantity_gm  = ? , quantity = ?, servingSize = ?   WHERE id = ?';
  db.query(query, [meal_id,food_id,calories,protein,carbs,fats,quantity_gm,quantity,servingSize,id], (err, results) => {
    if (err) {
      console.error('Error updating meal:', err);
      return res.status(500).json({ message: 'Failed to update.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Meal Food not found.' });
    }
    res.json({ 
      success:true,
      updatedInfo : results[0] 
    });
  });
});

router.delete('/deleteMeal/:id', (req, res) => {
 const  id  = req.params.id;
  const userId = parseInt(id, 10);
  const query = 'DELETE FROM meal_food_items WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Failed to delete .' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Meal not found.' });
    }
    res.json({ message: 'Meal deleted successfully.' });
  });
});


module.exports = router;