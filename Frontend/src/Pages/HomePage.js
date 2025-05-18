import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView, Button,TextInput,TouchableOpacity,Image } from 'react-native';
import styles from '../Styles/styles';
import bell from '../images/bell.jpg';
import home from '../images/home.jpg';
import dumbell from "../images/dumbell.jpg"
import EachMeal from '../components/EachMeal';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../components/Footer';
import EncryptedStorage from 'react-native-encrypted-storage';
import getAuthHeaders from '../utils/getAuthHeaders';
import { useNavigation } from '@react-navigation/native';
import Toast from '../components/Toast';



const Home = () => {
  const [userName,setUserName]= useState("");
  const [calories,setCalories] = useState("");
  const [meals,setMeals] = useState([]);
  const [loading,setLoading] = useState(false)
  const nav = useNavigation();
  const [totals,setTotals] = useState({})

  const getUserInfo = async () => {
  setLoading(true);
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`http://10.0.2.2:3000/api/users/getUserInfo`, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json(); // lowercase json()
    console.log("Data",data)
    setUserName(data.firstname);
    setCalories(data.daily_calorie_goal)
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    
  } finally {
    setLoading(false);
  }
};
 useEffect(() => {
  if (meals.length > 0) {
    calculateMacros();
  }
}, [meals]);

  useEffect(() => {
   
  getUserInfo();
   getMeals();
   
  },[])

  const getMeals = async () => {
  try {
    const date =  new Date().toISOString().split('T')[0];
    const headers = await getAuthHeaders();

    const response = await fetch('http://10.0.2.2:3000/api/meals/dayMeals', { 
      method: "POST",
      headers,
      body: JSON.stringify({ date })
    });

    // Check if response is OK and is JSON
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const text = await response.text(); // read error body
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      setMeals(data.meals);
      console.log(data.meals);
    } else {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text}`);
    }

  } catch (error) {
    console.error('Error fetching:', error.message);
  }
  
};
  const calculateMacros = () => {
  const t = meals.reduce(
    (acc, meal) => {
      meal.items.forEach(item => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.fats += item.fats;
        acc.carbs += item.carbs;
      });
      
      return acc;
    },
    { calories: 0, protein: 0, fats: 0, carbs: 0 }
  );

  // Round to 1 decimal place
  const rounded = {
    calories: parseFloat(t.calories.toFixed(1)),
    protein: parseFloat(t.protein.toFixed(1)),
    fats: parseFloat(t.fats.toFixed(1)),
    carbs: parseFloat(t.carbs.toFixed(1)),
  };

  console.log("rounded macros", rounded);
  setTotals(rounded);
  setCalories((prev) => Number(prev) - Number(totals.calories) )
};



  return (
    
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{marginTop:30,margin:20,gap:10}}>

<Text style={{fontSize:20}}>11 April 2025</Text>

<View style={{flexDirection:"row",justifyContent:"space-between"}}>
  <Text style={{fontSize:30,fontWeight:"bold"}}>My Diary</Text>

  


 


</View>

<View style={{flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",padding:20,paddingHorizontal:30,fontSize:20,alignItems:"center",...styles.borderRounded,marginVertical:20}}>

  <View style={{width:"50%"}}>
  <Text style={{fontSize:15}}>Welcome</Text>
  <Text style={{...styles.orangeText,fontSize:30}}>{userName}</Text>
  <Text>Are you ready to start your day?</Text>
  </View>

  <Image
  source={home}
  style={{height:140,width:150}} 
  ></Image>
</View>

<View style={{flexDirection:"row",justifyContent:"space-evenly",...styles.borderRounded}}>

<TouchableOpacity onPress={() => nav.navigate('MainApp', {
    screen: 'WorkoutList',
    params: { date : new Date }
  }) }  style={{backgroundColor:"white",padding:20,...styles.borderRounded,width:"48%"}}>
  <Image 
  source={{ uri: 'https://st2.depositphotos.com/2131499/7654/v/450/depositphotos_76546799-stock-illustration-running-shoes-icon.jpg'  }} 
  style={{height:70,width:100,margin:"auto"}}
  ></Image>
  <Text style={{...styles.orangeText,fontSize:20,textAlign:"center",marginTop:10}}>Workout Logs</Text>
</TouchableOpacity>

<View style={{backgroundColor:"white",padding:20,...styles.borderRounded,width:"48%"}}>
<Text style={{...styles.orangeText,textAlign:"center",fontSize:20}}>Fact of the day</Text>
<Text style={{fontSize:15,fontWeight:"bold",textAlign:"center"}}>Did You Know?</Text>
<Text style={{textAlign:"center"}}>Physical activity helps manage stress. </Text>
  <Image 
  source={dumbell} 
  style={{...styles.logo,margin:"auto"}}
  ></Image>
</View>
</View>

<View>
  <View style={{...styles.borderRounded,width:"100%"}}>
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginVertical:20}}>
      <Text style={{fontWeight:"bold",fontSize:20}}>Meals Today</Text>
    <TouchableOpacity
      style={{...styles.btn}}
      onPress={() => nav.navigate('MainApp', {
    screen: 'MealDetails',
    params: { todayMeals : meals }
  }) }>
            <Text style={{...styles.btnText}}>View Details</Text>
        </TouchableOpacity>
    </View>
  <ScrollView
  horizontal={true} 
  showsHorizontalScrollIndicator={false}
 >
  {meals?.map((eachMeal)=> (
    <EachMeal key={eachMeal.meal_id} meal={eachMeal}></EachMeal>
  ))}
  {meals?.length < 4 && (
    <View
  style={{
    marginStart: 10,
    padding: 10,
    borderRadius: 10,
    width: 120,
    position: 'relative',
    backgroundColor: "white",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:"center",
    height: 200 // You can adjust this to control height
  }}
>
  <TouchableOpacity onPress={() => nav.navigate('MainApp', {
    screen: 'FoodList',
    params: { mealName : '',date : new Date }
  }) }>
            <Icon name="add" size={30} color="black" />
        </TouchableOpacity>
  
</View>
  )}
  </ScrollView>

  </View>
 
</View>

<View style={{flexDirection:"row",justifyContent:"space-around",backgroundColor:"white",padding:20,paddingHorizontal:30,fontSize:20,alignItems:"center",...styles.borderRounded,marginVertical:20}}>

  <View style={{...styles.borderr,padding:30,maxWidth:"50%"}}>
    <Text style={{fontSize:30,fontWeight:"bold",textAlign:"center"}}>{totals.calories}<Text style={{fontSize:15,margin:"auto"}}>kcal consumed</Text></Text>
    <Text style={{fontSize:30,fontWeight:"bold",textAlign:"center"}}>{calories}<Text style={{fontSize:15,margin:"auto"}}> remaining</Text></Text>
  </View>

  <View style={{padding:30,gap:10}}>
  {Object.entries(totals).filter(([key]) => key !== 'calories').map(([key, value]) => (
  <View key={key} style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:5}}>
  <View>
  <Text style={{fontSize:20,fontWeight:"bold"}}>{key}</Text>
  </View>
   <View style={{borderWidth:2,padding:10,borderRadius:40}}>
     <Text style={{...styles.orangeText}}>{value + "g"}</Text>
   </View>
 </View>
))}
  </View>


</View>



</ScrollView>

    
  );
};

export default Home;