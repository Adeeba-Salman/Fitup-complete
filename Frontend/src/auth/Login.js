import React, { useContext, useState } from 'react';
import { View, Text, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from './AuthContext';
import Toast from '../components/Toast';

const Login = ({navigation}) => {
  const { login } = useContext(AuthContext)
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  

  const handleLogin = async () => {
    console.log("Inside Login")
    if (!email || !password) {
      setError({ message: 'Please fill all fields' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

     try {
      const res = await login(email, password);
      console.log("R",res)
      if(res.status === 401){
      setToastType('error');
      setToastMessage('User not found');
      setToastVisible(true);
      }
      

      
      setTimeout(() => {
        navigation.navigate('MainApp', {
  screen: 'About'
      })
      }, 3000); 
    } catch (err) {
      
      setToastType('error');
      setToastMessage('Invalid credentials. Please try again.');
      setToastVisible(true);
    }
  };


  return (
    <View>

      <View style={{height:900}}>
         <View style={styles.loginHeader}>
      <Text style={{fontSize:40,color:"#FF7D05",fontWeight:'bold'}} >FitUp!</Text>
      <Text style={{fontSize:20}}>Don't Hesitate, Just <Text style={{color:"#FF7D05",fontWeight:'bold'}}>FitUp</Text></Text>
      </View>

      <Text style={{textAlign:"center",marginTop:50,fontSize:30,color:"#FF7D05",fontWeight:'bold'}}>Hello</Text>
      <Text style={{textAlign:"center",fontSize:20}} >SignIn to your Account</Text>
       <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
      <Text>New to our platform? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
      <Text style={{...styles.orangeText}}>Signup</Text>
      </TouchableOpacity>
      </View>
      <View style={{padding:20,marginTop:30}}>
      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        style={styles.inputField}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />

<Text style={styles.label}>Enter Password</Text>
      <TextInput
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />

     {error?.message && (
       <Text style={{...styles.errorText,marginBottom:10}}>{error.message}</Text>
     )}
     

      <Text style={{fontSize:15,textAlign:"right"}}>Forgot Password?</Text>

      
      <TouchableOpacity onPress={handleLogin}  style={{ ...styles.btn, width:"75%",margin:"auto",marginTop:30 }} >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      
      </View>
      </View>

       <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
       
    </View>
  );
};

export default Login;