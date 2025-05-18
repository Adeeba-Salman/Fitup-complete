import React, { useEffect, useState,useContext } from 'react';
import { View, Text,ScrollView, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../auth/AuthContext';


const About = ({navigation}) => {
  const { logout } = useContext(AuthContext)
  const[formData,setFormData] = useState(null);
  const [error,setError] = useState(null);
  const [isEditable,setIsEditable] = useState(false);
  const [loading,setLoading] = useState(false);
  const [userId,setUserId] = useState("");


  const handleUpdate = async () => {
    console.log(formData)
    if (
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.email ||
      !formData?.password ||
      !formData?.currentWeight ||
      !formData?.goalWeight ||
      !formData?.goalCalories ||
      !formData?.height
    ) {
      setError({ message: 'Please fill all fields' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
       setError({ message: 'Please enter a valid email address.' });
     setTimeout(() => {
       setError({ message: '' });
      }, 5000);
      return;
    }

    formData.goalCalories = calculateGoalCalories(formData)

    try {
      console.log("Id",userId)
      const response = await fetch(`http://10.0.2.2:3000/api/users/updateUser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("d",data)
        if (data.success) {
         getUserInfo();
          
        } else {
          setError(data.error || { message: 'An unexpected error occurred' });
        }
      } else {
        const data = await response.json();
        setError(data.error ? { message: data.error } : { message: 'SignUp failed, please try again' });
      }
    } catch (error) {
      console.log(error);
      setError({ message: 'Something went wrong. Please try again later.' });
    }
  };

  const handleChange = (value, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value, 
    }));
  };
 

  useEffect(()=>{
       getUserInfo();
  },[])

  
    const handlePress = () => {
      if (isEditable) {
        handleUpdate();
      } 
        setIsEditable(!isEditable);
    };
  

  if(loading){
    return(
     <View style={{justifyContent:"center",alignItems:"center"}}>
       <Text style={{fontSize:30,...styles.orangeText}} >Loading</Text>
     </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{gap:10}}>
     

     
     
      <View style={{justifyContent:"space-between",flexDirection:"row",marginTop:50,marginHorizontal:20}}>
      <Text style={{fontSize:30}} >Profile</Text>
      <TouchableOpacity onPress={handlePress} style={{ ...styles.btn, width:"25%",marginTop:10 }} >
        <Text style={styles.btnText}>{!isEditable ? "Edit" : "Save"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => logout()} style={{ ...styles.btn, width:"25%",marginTop:10 }} >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
      </View>
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
        editable={isEditable}
        value={formData?.lastName}
        onChangeText={(value) => handleChange(value, 'lastName')}
        placeholder="Enter Last Name"
      />

      <Text style={styles.label}>Enter Email</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={formData?.email}
        onChangeText={(value) => handleChange(value, 'email')}
        placeholder="Enter Email"
      />

<Text style={styles.label}>Enter Password</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={formData?.password}
        onChangeText={(value) => handleChange(value, 'password')}
        placeholder="Enter your username"
      />

<Text style={styles.label}>Enter Current Weight in Pounds</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={String(formData?.currentWeight || "")}
        onChangeText={(value) => handleChange(value, 'currentWeight')}
        placeholder="Enter Current Weight"
        
      />

<Text style={styles.label}>Enter Goal Weight in Pounds</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={String(formData?.goalWeight || "")}
        onChangeText={(value) => handleChange(value, 'goalWeight')}
        placeholder="Enter Goal Weight"
      />
<Text style={styles.label}>Enter Calories Goal</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={String(formData?.goalCalories || "")}
        onChangeText={(value) => handleChange(value, 'goalCalories')}
        placeholder="Enter Calories Goal"
      />

<Text style={styles.label}>Enter Height in CMs</Text>
      <TextInput
        style={styles.inputField}
        editable={isEditable}
        value={String(formData?.height || "")}
        onChangeText={(value) => handleChange(value, 'height')}
        placeholder="Enter Height in CMs"
      />
      
      
      {error?.message && (
       <Text style={{...styles.errorText,marginBottom:10}}>{error.message}</Text>
     )}
      </View>
 
    </ScrollView>
  );
};

export default About;