import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import styles from '../Styles/styles';
import getAuthHeaders from '../utils/getAuthHeaders';
import { ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';



export default function WorkoutForm({ newWorkout,isEdit,editWorkout,existingValues }) {
  const [weight, setWeight] = useState('80');
  const [duration, setDuration] = useState('20');
  const [selectedMet, setSelectedMet] = useState(3.5); // 
  const [calories, setCalories] = useState(0);
  const [loading,setLoading] = useState(false);
  const [loadingMsg,setLoadingMsg] = useState("");
  const [open,setOpen] = useState(false)
  const [workoutOptions,setWorkoutOptions] = useState([
  { label: 'Walking (slow)', value: 2.5 },
  { label: 'Walking (brisk)', value: 3.5 },
  { label: 'Running (slow)', value: 8.0 },
  { label: 'Cycling (light)', value: 4.0 },
  { label: 'Strength Training', value: 6.0 },
  { label: 'Yoga', value: 2.0 },
  { label: 'Jumping Rope', value: 10.0 },
])

  const getUserInfo = async () => {
  setLoading(true);
  setLoadingMsg("Getting User Information")
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`http://10.0.2.2:3000/api/users/getUserInfo`, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json(); // lowercase json()
    setWeight(data.weight_kg);
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    
  } finally {
    setLoading(false);
  }
};

  const setExistingValues = () => {
    console.log("Existing",existingValues)
    setCalories(existingValues.calories_burned)
    setDuration(existingValues.duration_minutes.toString())
    const option = workoutOptions.find((each) => each.label === existingValues.workout_type);
    setSelectedMet(option.value)
  }

  const calculateCalories = () => {
    const weightKg = parseFloat(weight);
    const durationMinutes = parseFloat(duration);


    const durationHours = durationMinutes / 60;
    const burned = selectedMet * weightKg * durationHours;
    setCalories(Math.round(burned));
  };

  const handleSubmit = () => {
    const option = workoutOptions.find((each) => each.value === selectedMet);
    const formData = {
      duration_minutes : duration,
      workout_type : option.label, 
      calories_burned : calories
    }
    if(isEdit){
      editWorkout(formData);
    }else{
      newWorkout(formData);
    }
    
  }

  useEffect(() => {
    calculateCalories();
  },[selectedMet,duration])

 useEffect(() => {
  if (isEdit && existingValues && workoutOptions.length > 0) {
    setExistingValues();
  }
}, [existingValues, workoutOptions, isEdit]);

  useEffect(() => {
    getUserInfo();
  },[])

useEffect(() => {
  console.log("existingValues updated:", existingValues);
  console.log("workoutOptions ready:", workoutOptions);
}, [existingValues, workoutOptions]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{loadingMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>


      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray",padding:5}}>
        <Text style={styles.label}>Duration (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 30"
      />

      </View>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray",padding:5}}>
        <Text style={styles.label}>Workout Type:</Text>
      <DropDownPicker
      open={open}
      value={selectedMet}
      items={workoutOptions}
      setOpen={setOpen}
      setValue={setSelectedMet}
      setItems={setWorkoutOptions}
      placeholder="Select Workout"
      containerStyle={{ marginBottom: 10, zIndex: 1000,width:200 }}
    />
      </View>
      
      {calories !== 0 && (
        <Text style={styles.result}>  {calories  + " Kcal" } Calories Burned  </Text>
      )}

      <TouchableOpacity onPress={handleSubmit} style={{...styles.btn,width:100,margin:"auto"}}>
     <Text style={{...styles.btnText}}>{isEdit ? "Update Record" : "Add Record"}</Text>
   </TouchableOpacity>

    </View>
  );
}


