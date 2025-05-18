
import React, { useState,useEffect } from 'react';
import { View, Text, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles'
import mealPic from "../images/meal.jpg";
import { useNavigation } from '@react-navigation/native';
const EachMeal = ({ meal }) => {
  
  const [containerWidth, setContainerWidth] = useState(0);
  const [calories,setCalories] = useState();
  const nav = useNavigation();

  useEffect(() => {
    const totalCalories = () => {
      let c = 0;
      meal?.items?.map((eachItem) => {
        c = eachItem.calories + c
      }
      )
      console.log("Cal",c)
      setCalories(c);
    }
    totalCalories();
  },[])
  return (
  <View
  onLayout={(event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }}
  style={{
    marginStart: 10,
    padding: 10,
    borderRadius: 10,
    width: 120,
    position: 'relative',
    backgroundColor: "white",
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 200 // You can adjust this to control height
  }}
>
  <View>
    <Image
      source={mealPic}
      style={{ ...styles.logo, ...styles.marginXAuto, borderRadius: 25 }}
    />
    <Text style={{ fontWeight: "bold", marginTop: 10 , fontSize:20 ,marginBottom:10 }}>{meal.meal_name}</Text>
    {meal?.items.map((eachFood) => (
      <View key={eachFood.id}>
        <View style={{ flexDirection: "row"  }}>
          <Text  style={{ textAlign:"left"  }}>{eachFood.quantity_gm !== 0 ? eachFood.quantity_gm * eachFood.servingSize + "g" + " x " + eachFood.name : eachFood.quantity + " x " + eachFood.name}</Text>
        </View>
      </View>
    ))}
  </View>

  {calories > 0 && (
    <View style={{ marginTop: 10 }}>
      <Text style={{ ...styles.orangeText, fontSize: 20 }}>
        {calories}
        <Text style={{ fontSize: 12, color: "black" }}> kcal</Text>
      </Text>
    </View>
  )}
</View>

  );
};

export default EachMeal;