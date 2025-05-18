// src/components/Footer.js
import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/styles';
import { useNavigation } from '@react-navigation/native';


const Header = ({ heading }) => {
  const nav = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 10 }}>

  <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 10 }}>
    <Icon name="arrow-back" size={20} color="black" />
  </TouchableOpacity>

 
  <Text style={{ ...styles.heading, textAlign: 'center', flex: 1 }}>
    {heading}
  </Text>

 
  <View style={{ width: 40 }} />
</View>

  );
};



export default Header;
