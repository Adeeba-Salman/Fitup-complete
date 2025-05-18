import React, { useState } from 'react';
import { View, Text,ScrollView, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'


const SignUp = ({navigation}) => {
  const[formData,setFormData] = useState(null);
  const [error,setError] = useState(null);

  const handleSignUp = async () => {
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

    try {
      const response = await fetch('http://10.0.2.2:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("d",data)
        if (data.success) {
          console.log('User ID saved:', data.userId);
          
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{gap:10}}>
      <View style={styles.loginHeader}>
      <Text style={{fontSize:40,color:"#FF7D05",fontWeight:'bold'}} >FitUp!</Text>
      <Text style={{fontSize:20}}>Don't Hesitate, Just <Text style={{color:"#FF7D05",fontWeight:'bold'}}>FitUp</Text></Text>
      </View>

     
      <Text style={{textAlign:"center",fontSize:20,marginTop:20}} >Create a new Account</Text>
      <View style={{margin:"auto",flexDirection:"row"}}>
      <Text>Already have an Account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Text style={{...styles.orangeText}}>Login</Text>
      </TouchableOpacity>
      </View>
      <View style={{padding:20,marginTop:30}}>
      <Text style={styles.label}>Enter FirstName</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.firstName}
        name="firstName"
        onChangeText={(value) => handleChange(value, 'firstName')}
        placeholder="Enter First Name"
      />

<Text style={styles.label}>Enter LastName</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.lastName}
        onChangeText={(value) => handleChange(value, 'lastName')}
        placeholder="Enter Last Name"
      />

      <Text style={styles.label}>Enter Email</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.email}
        onChangeText={(value) => handleChange(value, 'email')}
        placeholder="Enter Email"
      />

<Text style={styles.label}>Enter Password</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.password}
        onChangeText={(value) => handleChange(value, 'password')}
        placeholder="Enter password"
      />

<Text style={styles.label}>Enter Current Weight in Pounds</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.currentWeight}
        onChangeText={(value) => handleChange(value, 'currentWeight')}
        placeholder="Enter Current Weight"
      />

<Text style={styles.label}>Enter Goal Weight in Pounds</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.goalWeight}
        onChangeText={(value) => handleChange(value, 'goalWeight')}
        placeholder="Enter Goal Weight"
      />
<Text style={styles.label}>Enter Calories Goal</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.goalCalories}
        onChangeText={(value) => handleChange(value, 'goalCalories')}
        placeholder="Enter Calories Goal"
      />

<Text style={styles.label}>Enter Height in CMs</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.height}
        onChangeText={(value) => handleChange(value, 'height')}
        placeholder="Enter Height in CMs"
      />
      
      
      {error?.message && (
       <Text style={{...styles.errorText,marginBottom:10}}>{error.message}</Text>
     )}
      <Text style={{fontSize:15,textAlign:"right"}}>Forgot Password?</Text>

      
      <TouchableOpacity onPress={handleSignUp}  style={{ ...styles.btn, width:"75%",margin:"auto",marginTop:30,marginBottom:100 }} >
        <Text style={styles.btnText}>SignUp</Text>
      </TouchableOpacity>

    
      </View>
 
    </ScrollView>
  );
};

export default SignUp;