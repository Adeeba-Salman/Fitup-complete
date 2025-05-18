import React, { useState } from 'react';
import { View, Text, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import EncryptedStorage from 'react-native-encrypted-storage';

const Login = ({navigation}) => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);

  

  const handleLogin = async () => {
    if (!email || !password) {
      setError({ message: 'Please fill all fields' });
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          console.log('User ID saved:', data.userId);
          console.log('User Name saved:', data.userName);
          await EncryptedStorage.setItem(
            "user_session",
            JSON.stringify({
              userId: data.userId,
              userName:data.userName
            })
          );
          navigation.navigate('Home');
        } else {
          setError(data.error || { message: 'An unexpected error occurred' });
        }
      } else {
        const data = await response.json();
        setError(data.error ? { message: data.error } : { message: 'Login failed, please try again' });
      }
    } catch (error) {
      console.log(error);
      setError({ message: 'Something went wrong. Please try again later.' });
    }
  };


  return (
    <View>

       <View style={styles.loginHeader}>
      <Text style={{fontSize:40,color:"#FF7D05",fontWeight:'bold'}} >FitUp!</Text>
      <Text style={{fontSize:20}}>Don't Hesitate, Just <Text style={{color:"#FF7D05",fontWeight:'bold'}}>FitUp</Text></Text>
      </View>

      <Text style={{textAlign:"center",marginTop:50,fontSize:30,color:"#FF7D05",fontWeight:'bold'}}>Hello</Text>
      <Text style={{textAlign:"center",fontSize:20}} >SignIn to your Account</Text>
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

      <View style={{flexDirection:"row",margin:"auto",marginTop:30,gap:20}}>

      <Image
      source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} 
      style={styles.logo} 
      ></Image>

<Image
      source={{ uri: 'https://img.freepik.com/premium-vector/vector-facebook-social-media-icon-illustration_534308-21672.jpg?semt=ais_hybrid&w=740' }} 
      style={styles.logo} 
      ></Image>

<Image
      source={{ uri: 'https://e7.pngegg.com/pngimages/708/311/png-clipart-icon-logo-twitter-logo-twitter-logo-blue-social-media-thumbnail.png' }} 
      style={styles.logo} 
      ></Image>

      </View>
      </View>
    </View>
  );
};

export default Login;