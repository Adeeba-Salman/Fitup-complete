import React, { useEffect, useState,useContext } from 'react';
import { View, Text,ScrollView, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import { AuthContext } from '../auth/AuthContext';
import getAuthHeaders from '../utils/getAuthHeaders';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Icon } from 'react-native-paper';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import Header from '../components/Header';

const Settings = ({navigation}) => {

  const { logout } = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deleteModal,setDeleteModal] = useState(false)
 


  const deleteAccount = async() => {
    const headers = await getAuthHeaders();
    const res = await fetch( `http://10.0.2.2:3000/api/users/deleteAccount`,{
      headers,
      method:"DELETE"
    })

    if(res.ok){
      logout();
    }

    if(!res.ok){
     setToastVisible(true)
     setToastType("error")
     setToastMessage("Unable to delete account,please try again later")
    }
  }

  
 

 



  if(loading){
    return(
     <View style={{justifyContent:"center",alignItems:"center"}}>
       <Text style={{fontSize:30,...styles.orangeText}} >Loading</Text>
     </View>
    )
  }

  if(deleteModal){
    return(
      <DeleteModal 
      visible={deleteModal}
      onCancel={() => setDeleteModal(false)}
      onConfirm={deleteAccount}
      ></DeleteModal>
    )
  }

  return (
 <View style={{ marginTop: 60, paddingHorizontal: 20 }}>
  <Header  heading={"Settings"}></Header>
  <View style={{ marginTop: 20 }}>
    <TouchableOpacity 
    style={{
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: '#ccc'
    }}
    onPress={logout}
  >
    <Text style={{ fontSize: 18, color: '#333' }}>
      Logout
    </Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={{
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: '#ccc'
    }}
    onPress={() => setDeleteModal(true)}
  >
    <Text style={{ fontSize: 18, color: 'red' }}>
      Delete Account
    </Text>
  </TouchableOpacity>
  </View>
</View>
  );
};

export default Settings;