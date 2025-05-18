// src/components/Footer.js
import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/styles';
import { useNavigation } from '@react-navigation/native';


const Footer = () => {
  const nav = useNavigation();
  return (
    <View style={{height: 80,
      ...styles.backGround,flexDirection:"row",
      justifyContent: 'space-evenly',
      alignItems:"flex-start"}}>

<TouchableOpacity onPress={() => nav.navigate('MainApp', {
  screen: 'Settings'
})}>
          <Icon name="settings" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.navigate('MainApp', {
  screen: 'Home'
}) }>
          <Icon name="radio-button-off" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.navigate('MainApp', {
  screen: 'About'
})}>
          <Icon name="person" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};



export default Footer;
