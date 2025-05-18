import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView ,Modal,TextInput,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import styles from '../Styles/styles';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import getAuthHeaders from '../utils/getAuthHeaders';
import FoodForm from '../components/FoodForm';
import WorkoutForm from '../components/WorkoutForm';
import Toast from '../components/Toast';

const AddWorkout = ({ navigation,route }) => {

  const { date } = route.params;
  const [loading,setLoading] = useState(false)
   const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

 const handleSubmit = async (FD) => {
  console.log("inside handle submit")
  const headers = await getAuthHeaders();
  console.log(headers)
  setLoading(true); 

  try {
    
    const formData = {...FD, workout_date:date }
    console.log(formData);
    const res2 = await fetch('http://10.0.2.2:3000/api/workouts/addWorkout', {
      method: 'POST',
      headers,
      body: JSON.stringify(formData)
    });

    if (!res2.ok) {
      throw new Error('Failed to add food to meal');
    }
      setToastType('success');
      setToastMessage("Added Workout");
      setToastVisible(true);
 
  } catch (err) {
      setToastType('error');
      setToastMessage(err.message);
      setToastVisible(true);
    console.error('Error:', err.message || err);
  } finally {
    setLoading(false);
    setTimeout(() => {
      navigation.navigate('MainApp', {
          screen: 'WorkoutList',
          
        })
    },[2000])
  }
};

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Adding Workout...</Text>
    </View>
  );
}






  
 

  return (
   
     <View contentContainerStyle={{ flexGrow: 1 }} style={{marginTop:40,height:100,margin:20,gap:10}}>

<View style={{height:800}}>
  <Header heading={"Add Workout"}></Header>
<WorkoutForm newWorkout={handleSubmit}></WorkoutForm>
</View>


{toastVisible && (
  <View style={{ marginBottom:200}}>
  
<Toast
      message={toastMessage}
      type={toastType}
      visible={toastVisible}
      onDismiss={() => setToastVisible(false)}
    />
</View>
)}
</View>

  );
};

export default AddWorkout;