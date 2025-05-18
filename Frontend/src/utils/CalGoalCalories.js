const calculateGoalCalories = (formData) => {
  const { age, height, currentWeight, gender, activityLevel, goal } = formData;

  // Convert age, height, and weight to numbers
  const parsedAge = parseInt(age, 10);
  const parsedHeight = parseFloat(height);  // Assuming height is in cm or meters, so we use parseFloat
  const parsedWeight = parseFloat(currentWeight);  // Assuming weight is in kg, so we use parseFloat

  // Log input values for debugging
  console.log('Age:', parsedAge);
  console.log('Height:', parsedHeight);
  console.log('Weight:', parsedWeight);
  console.log('Gender:', gender);
  console.log('Activity Level:', activityLevel);
  console.log('Goal:', goal);

  // Check if all values are valid numbers (except gender and goal)
  if (
    isNaN(parsedAge) || 
    isNaN(parsedHeight) || 
    isNaN(parsedWeight) || 
    !['male', 'female'].includes(gender) || 
    !['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activityLevel) ||
    !['lose_weight', 'gain_weight', 'maintain_weight'].includes(goal)
  ) {
    console.error('Invalid input values');
    return NaN;  // Return NaN if any value is invalid
  }

  // Calculate BMR (using Mifflin-St Jeor Equation)
  let BMR;
  if (gender === 'male') {
    BMR = 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + 5; // for male
  } else {
    BMR = 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge - 161; // for female
  }

  // Calculate TDEE based on activity level
  let TDEE;
  switch (activityLevel) {
    case 'sedentary':
      TDEE = BMR * 1.2;
      break;
    case 'light':
      TDEE = BMR * 1.375;
      break;
    case 'moderate':
      TDEE = BMR * 1.55;
      break;
    case 'active':
      TDEE = BMR * 1.725;
      break;
    case 'very_active':
      TDEE = BMR * 1.9;
      break;
    default:
      TDEE = BMR * 1.2; // default to sedentary if no level is selected
  }

  // Adjust TDEE based on the goal
  let goalCalories;
  if (goal === 'lose_weight') {
    goalCalories = TDEE - 500; // Calorie deficit for weight loss
  } else if (goal === 'gain_weight') {
    goalCalories = TDEE + 500; // Calorie surplus for weight gain
  } else {
    goalCalories = TDEE; // Maintain weight
  }

  console.log("Calculated Goal Calories:", goalCalories);
  const calories = parseInt(goalCalories)
  return calories;
};

export default calculateGoalCalories;
