import React, { useState,useContext, useEffect } from 'react';
import { View,ScrollView,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import Toast from '../components/Toast';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import calculateGoalCalories from '../utils/CalGoalCalories';
import getAuthHeaders from '../utils/getAuthHeaders';



const Profile = ({navigation}) => {
  
   const [formData, setFormData] = useState({});
  const [error,setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityItems, setActivityItems] = useState([
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'light' },
    { label: 'Moderately Active', value: 'moderate' },
    { label: 'Very Active', value: 'active' },
    { label: 'Extra Active', value: 'very_active' },
  ]);
  const [isEditable,setIsEditable] = useState(false);
  

 const getUserInfo = async () => {
  
  console.log("hi")
 

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`http://10.0.2.2:3000/api/users/getUserInfo`, {
      headers,
    });

    if (!res.ok) {

      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log("R",res)

    const data = await res.json(); // lowercase json()
    console.log("Data",data)
    const fd = {
      id:data.id,
      firstName:data.firstname,
      lastName:data.lastName,
    age: data.age?.toString(),
      height:data.height_cm,
      currentWeight:data.weight_kg,
      email:data.email,
      password:data.password,
      activityLevel:data.activity_level,
      gender:data.gender,
      goal:data.goal
    }
    console.log("Form",fd)
    setFormData(fd)
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    
  } finally {
    setLoading(false);
  }
};
   const handleUpdate = async () => {
    if(!isEditable){
      setIsEditable((prev) => !prev)
      return
    }
    const headers = await getAuthHeaders();
    if (
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.email ||
      !formData?.password ||
      !formData?.currentWeight |
      !formData.gender||
      !formData.activityLevel||
      !formData.goal||
      !formData?.height
    ) {
      setError({ message: 'Please fill all fields' });
      return;
    }

    formData.goalCalories = calculateGoalCalories(formData)

    console.log("F",formData)

    try {
      
      const response = await fetch(`http://10.0.2.2:3000/api/users/updateAccount`, {
        method: 'PUT',
       headers,
        body: JSON.stringify(formData),
      });
      const data = response.json();
      console.log("R",response)
      if (response.ok) {
      console.log("done")
      setToastVisible(true)
      setToastMessage("Updated Succesfuly!")
      setToastType("success")
      } 
    } catch (error) {
      console.log(error);
      setToastVisible(true)
      setToastMessage("Failed to update!")
      setToastType("error")
    }finally{
      setIsEditable(false)
    }
  };

  const handleChange = (value, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value, 
    }));
  };

  useEffect(() => {
    getUserInfo();
  },[])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{gap:10}}>
      
      <View style={{justifyContent:"space-between",flexDirection:"row",marginTop:50,marginHorizontal:20}}>
      <Text style={{fontSize:30}} >Profile</Text>
      <TouchableOpacity onPress={handleUpdate} style={{ ...styles.btn, width:"25%",marginTop:10 }} >
        <Text style={styles.btnText}>{!isEditable ? "Edit" : "Save"}</Text>
      </TouchableOpacity>
    
      </View>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

     
     
      <View style={{padding:20,marginTop:30}}>
      <Text style={styles.label}>Enter FirstName</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.firstName}
        name="firstName"
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'firstName')}
        placeholder="Enter First Name"
      />

<Text style={styles.label}>Enter LastName</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.lastName}
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'lastName')}
        placeholder="Enter Last Name"
      />

      <Text style={styles.label}>Enter Email</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.email}
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'email')}
        placeholder="Enter Email"
      />

<Text style={styles.label}>Enter Password</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.password}
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'password')}
        placeholder="Enter password"
      />

       <Text style={styles.label}>Enter Age</Text>
      <TextInput
        label="Age"
        keyboardType="numeric"
        value={formData?.age}
         editable={isEditable}
        onChangeText={value => handleChange( value,'age')}
        style={styles.inputField}
      />

<Text style={styles.label}>Enter Current Weight in KGs</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.currentWeight}
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'currentWeight')}
        placeholder="Enter Current Weight"
      />

      
<Text style={styles.label}>Enter Height in CMs</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.height}
         editable={isEditable}
        onChangeText={(value) => handleChange(value, 'height')}
        placeholder="Enter Height in CMs"
      />

     

      
     {isEditable ? ( <>
     <Text style={styles.label}>Gender</Text>
     <RadioButton.Group
  onValueChange={value => handleChange(value,'gender')}
  value={formData.gender}
>
  <RadioButton.Item label="Male" value="male" />
  <RadioButton.Item label="Female" value="female" />
</RadioButton.Group>

<Text style={styles.label}>Goal</Text>
      <RadioButton.Group
        onValueChange={value => handleChange(value,'goal')}
        value={formData.goal}
      >
        <View style={styles.radioRow}>
          <RadioButton value="lose_weight" />
          <Text>Lose Weight</Text>
          <RadioButton value="maintain_weight" />
          <Text>Maintain</Text>
          <RadioButton value="gain_weight" />
          <Text>Gain Weight</Text>
        </View>
      </RadioButton.Group>

      <Text style={styles.label}>Activity Level</Text>
      <DropDownPicker
        open={activityOpen}
        value={formData.activityLevel}
        items={activityItems}
        setOpen={setActivityOpen}
        setValue={value => handleChange( value(),'activityLevel')}
        setItems={setActivityItems}
        placeholder="Select activity level"
        style={styles.dropdown}
        zIndex={1000}
        zIndexInverse={3000}
      />
     </>
) : (
 <>
  <Text style={styles.label}>Gender</Text>
<TextInput
        style={styles.inputField}
        value={formData?.gender}
         editable={false}
      />

      <Text style={styles.label}>Goal</Text>
<TextInput
        style={styles.inputField}
        value={formData?.goal}
         editable={false}
      />

      <Text style={styles.label}>Activity</Text>
<TextInput
        style={styles.inputField}
        value={formData?.activityLevel}
         editable={false}
      />
 </>

)}
    
      </View>

      
 
    </ScrollView>
  );
};

export default Profile;