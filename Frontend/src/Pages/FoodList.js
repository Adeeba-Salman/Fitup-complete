import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView, Button,TextInput,TouchableOpacity,Image,FlatList } from 'react-native';
import styles from '../Styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import getAuthHeaders from '../utils/getAuthHeaders';


const FoodList = ({ navigation,route }) => {

  const [searchInput,setSearchInput] = useState("")
  const [foods,setFoods] = useState([]);
  const { mealName,date } = route.params;

useEffect(() => {
  const getFoods = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('http://10.0.2.2:3000/api/foodItems', { headers });

      const text = await response.text();
      console.log("Raw response:", text); // ✅ print it

      try {
        const data = JSON.parse(text);
        setFoods(data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', text); // 👈 this helps you see the actual error
      }
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  getFoods();
}, []);

const searchFoods = async () => {
  const headers = await getAuthHeaders();
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(`http://10.0.2.2:3000/api/foodItems/search?name=${searchInput}`,{ headers });
      const data = await response.json();
      console.log("Search",data)
      setFoods(data);
    } catch (error) {
      console.error('Error searching food:', error);
    }
  };


  return (
   
      <View contentContainerStyle={{ flexGrow: 1 }} style={{marginTop:40,margin:20,gap:10}}>
       <Header heading={ "Add " + mealName}></Header>


<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
  <TextInput
  style={{marginTop:20,height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    width: '90%',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor:"white"}}
  value={searchInput}
  onChangeText={setSearchInput}
  placeholder="Search for foods.."
/>
<TouchableOpacity onPress={searchFoods}>
 <Icon style={{backgroundColor:"white",padding:10,borderColor: '#ccc',
    borderWidth: 2,borderRadius: 5,}} name="search" size={20}></Icon>
</TouchableOpacity>
</View>

<View style={{gap:20}}>
 <FlatList
  data={foods}
  keyExtractor={(item) => item.name}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("AddFood", { food: item,date:date })}
      style={{ padding: 10,margin:10, backgroundColor: "white" }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
</View>

</View>
    
  );
};

export default FoodList;