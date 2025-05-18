import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView ,Modal,TextInput,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import styles from '../Styles/styles';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import getAuthHeaders from '../utils/getAuthHeaders';
import FoodForm from '../components/FoodForm';
import Toast from '../components/Toast';

const AddFood = ({ navigation,route }) => {

  const { food,date } = route.params;
  const [loading,setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

 const handleSubmit = async (meal,FD) => {
  console.log(meal);
  const headers = await getAuthHeaders();
  console.log(headers)
  setLoading(true); 

  try {
    // Step 1: Create Meal
    const res1 = await fetch('http://10.0.2.2:3000/api/meals/createMeal', {
        method:"POST",
        headers,
        body: JSON.stringify({ meal_name:meal,date:date }),
      });
    console.log(res1);
    if (!res1.ok) {
      throw new Error('Failed to create meal');
    }

    const data = await res1.json(); 

    const mId = data.mealId; 
    const formData = {...FD,meal_id:mId}
    console.log(formData)
    const res2 = await fetch('http://10.0.2.2:3000/api/meals/addMeal', {
      method: 'POST',
      headers,
      body: JSON.stringify(formData)
    });

    if (!res2.ok) {
      throw new Error('Failed to add food to meal');
    }
    setToastType('success');
    setToastMessage("Meal Added");
    setToastVisible(true);
   

    console.log('Meal and food added successfully');
  } catch (err) {
    console.error('Error:', err.message || err);
     setToastType('error');
    setToastMessage(err.message);
    setToastVisible(true);
  } finally {
    setLoading(false); // stop loading
   setTimeout(() => {
      navigation.navigate('MainApp', {
          screen: 'MealDetails',
          
        })
    },[1000])
  }
};

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Adding Food...</Text>
    </View>
  );
}






  
 

  return (
   
     <View contentContainerStyle={{ flexGrow: 1 }} style={{marginTop:40,margin:20,gap:10}}>

<View style={{height:800}}>
  <Header heading={"Add Food"}></Header>

 <FoodForm addMeal={handleSubmit} food={food} isEdit={false} ></FoodForm>
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

export default AddFood;