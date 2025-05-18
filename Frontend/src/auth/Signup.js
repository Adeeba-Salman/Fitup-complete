import React, { useState,useContext } from 'react';
import { View,ScrollView,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import { AuthContext } from './AuthContext';
import Toast from '../components/Toast';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import calculateGoalCalories from '../utils/CalGoalCalories';



const SignUp = ({navigation}) => {
  const { register } = useContext(AuthContext);
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

  const handleSignUp = async () => {
    
    
    if (
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.email ||
      !formData?.password ||
      !formData?.currentWeight ||
      !formData.gender||
      !formData.activityLevel||
      !formData.goal||
      !formData?.height
    ) {
      setError({ message: 'Please fill all fields' });
      setTimeout(() => {
       setError({ message: '' });
      }, 5000);
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
     console.log("GC",formData.goalCalories);
     console.log(formData)

    try {
      const message = await register(formData);
      console.log("Inside try")
      setToastType('success');
      setToastMessage(message);
      setToastVisible(true);
     
      console.log("Passed")
      // Navigate to login after toast
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000); // Adjust the time based on your preference
    } catch (err) {
      // Show error toast
      setToastType('error');
      setToastMessage(err.message);
      setToastVisible(true);
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

       <Text style={styles.label}>Enter Age</Text>
      <TextInput
        label="Age"
        keyboardType="numeric"
        value={formData.age}
        onChangeText={value => handleChange( value,'age')}
        style={styles.inputField}
      />

<Text style={styles.label}>Enter Current Weight in KGs</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.currentWeight}
        onChangeText={(value) => handleChange(value, 'currentWeight')}
        placeholder="Enter Current Weight"
      />

      
<Text style={styles.label}>Enter Height in CMs</Text>
      <TextInput
        style={styles.inputField}
        value={formData?.height}
        onChangeText={(value) => handleChange(value, 'height')}
        placeholder="Enter Height in CMs"
      />

     

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



      
      
      {error?.message && (
       <Text style={{...styles.errorText,marginBottom:10}}>{error.message}</Text>
     )}
      

      
      <TouchableOpacity onPress={handleSignUp}  style={{ ...styles.btn, width:"75%",margin:"auto",marginTop:30,marginBottom:100 }} >
        <Text style={styles.btnText}>SignUp</Text>
      </TouchableOpacity>

       

    
      </View>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
 
    </ScrollView>
  );
};

export default SignUp;