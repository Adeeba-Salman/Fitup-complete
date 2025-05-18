const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const foodItemRoutes = require('./routes/food');
const mealRoutes = require('./routes/meals')
const workoutRoutes = require('./routes/workouts')
const authenticateToken = require('./middleware/auth');

const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/foodItems', authenticateToken, foodItemRoutes);
app.use('/api/meals', authenticateToken, mealRoutes);
app.use('/api/workouts', authenticateToken, workoutRoutes);
// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});