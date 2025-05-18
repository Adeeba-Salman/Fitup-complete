import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView ,Modal,TextInput,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import styles from '../Styles/styles';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import getAuthHeaders from '../utils/getAuthHeaders';

const FoodForm = ({ addMeal,food,existingValues,isEdit,editMeal  }) => {
  
  const [nutrition,setNutrition] = useState({});
  const [calories,setCalories] = useState();
  const [quantity,setQuantity] = useState('1');
  const [servingSize,setServingSize] =useState('100');
  const [loading,setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '100g', value: '100' },
    { label: '1g', value: '1' },
  ]);
  const [mealItems, setMealItems] = useState([
    { label: 'breakfast', value: 'breakfast' },
    { label: 'lunch', value: 'lunch' },
    { label: 'snacks', value: 'snacks' },
    { label: 'dinner', value: 'dinner' },
  ]);
  const [meal,setMeal] = useState("breakfast")
  const [openMeals, setOpenMeals] = useState(false);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

 useEffect(() => {
  getFoodDetails();
  if(existingValues){
    setExistingValues();
  }
}, []);

const setExistingValues = () => {
  setServingSize(existingValues.servingSize)
  setQuantity(existingValues.quantity == 0 ? existingValues.quantity_gm.toString() : existingValues.quantity.toString() )
  setMeal(existingValues.meal_name)
}

const getFoodDetails = async () => {
    try {
      setLoading(true); 
      const headers = await getAuthHeaders();
      
      const res = await fetch(`http://10.0.2.2:3000/api/foodItems/getNutrition/${food.id},`,{ headers } );
      const d = await res.json();
      const data = existingValues ? existingValues : d;
     setProtein(parseFloat(data.protein).toFixed(1));
    setCarbs(parseFloat(data.carbs).toFixed(1));
    setFats(parseFloat(data.fats).toFixed(1));
    setCalories(parseFloat(data.calories).toFixed(1));
      setNutrition({
        protein_g:data.protein,
        carbohydrates_total_g:data.carbs,
        fat_total_g:data.fats,
        calories:data.calories
      })

    } catch (error) {
      console.error("Error fetching food details:", error);
    } finally {
      setLoading(false); 
    }
  };

const calculateCalories = (q,servingSize) => {
  let grams = 0;
  const qty = Number(q);
  if (food.measurement_type === 'grams') {
    // If serving size is "100g" or "1g"
    grams = Number(servingSize) * qty;
  } else if (food.measurement_type === 'quantity') {
    // If serving size is "unit" → use average_grams_per_unit
    if (servingSize === 'unit') {
      grams = food.average_grams_per_unit * qty;
    } else {
      grams = Number(servingSize) * qty;
    }
  }

  const factor = grams / 100;

  setCalories((nutrition.calories * factor).toFixed(1));
  setProtein((nutrition.protein_g * factor).toFixed(1));
  setCarbs((nutrition.carbohydrates_total_g * factor).toFixed(1));
  setFats((nutrition.fat_total_g * factor).toFixed(1));
};

useEffect(() => {
    if (food?.measurement_type === 'quantity') {
      setItems([
        { label: '100g', value: '100' },
        { label: '1g', value: '1' },
        { label: 'Per Unit', value: 'unit' },
      ]);
    } else {
      setItems([
        { label: '100g', value: '100' },
        { label: '1g', value: '1' },
      ]);
    }
  }, [food]);

  useEffect(() => {
    calculateCalories(quantity, servingSize);
  }, [servingSize, quantity]);

  const handlePress = () => {
    const formData = {
      food_id: food.id,
      calories: Number(parseFloat(calories).toFixed(1)),
      protein: Number(parseFloat(protein).toFixed(1)),
      carbs: Number(parseFloat(carbs).toFixed(1)),
      fats: Number(parseFloat(fats).toFixed(1)),
      quantity_gm: servingSize !== 'unit' ? quantity : 0,
      quantity: servingSize === 'unit' ? quantity : 0,
      servingSize:servingSize
    };
    if(!isEdit){
      addMeal(meal,formData)
    }else{
      editMeal(meal,formData);
    }
  }




if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading food details...</Text>
    </View>
  );
}


  
 

  return (
   
     <View style={{backgroundColor:"white",padding:10,marginTop:20,gap:10}}>

   <Text style={{fontSize:20,fontWeight:"bold"}}>{food?.name}</Text>

   <View style={{padding:10,gap:10}}>

   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray"
   }}>
   <Text style={{fontSize:18}}>Serving Size</Text>
   <DropDownPicker
      open={open}
      value={servingSize}
      items={items}
      setOpen={setOpen}
      setValue={setServingSize}
      setItems={setItems}
      placeholder="Select Serving Size"
      containerStyle={{ marginBottom: 20, zIndex: 1000,width:200 }}
    />
   </View>

   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray"
   }}>
   <Text style={{fontSize:18}}>Quantity</Text>
   <TextInput 
   value={quantity}
   onChangeText={(text) => {
  if (/^\d*$/.test(text)) {
    const val = text === '' ? 0 : Number(text);
    setQuantity(val);
  }
}}
   style={{maxWidth:60,...styles.inputField,marginBottom:0}}></TextInput>
   </View>

   <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:50,alignItems:"baseline",borderBlockColor:"gray"
   }}>
    <Text style={{fontSize:18}}>Meal</Text>
   <DropDownPicker
      open={openMeals}
      value={meal}
      items={mealItems}
      setOpen={setOpenMeals}
      setValue={setMeal}
      setItems={setMealItems}
      placeholder="Select Meal"
      containerStyle={{ marginBottom: 20, zIndex: 1000,width:200 }}
    />
   </View>

   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray"
   }}>
   <View style={{...styles.borderr,paddingVertical:20,paddingHorizontal:5,width:120}}>
     <Text style={{fontSize:20,textAlign:"center"}}>{calories}</Text>
     <Text style={{fontSize:11,textAlign:"center"}}>kcal</Text>
   </View>

   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline",borderBlockColor:"gray",gap:2
   }}>

   <View style={{padding:10,maxWidth:80}}>
     <Text style={{fontSize:20,textAlign:"center"}}>{protein + "g"}</Text>
     <Text style={{fontSize:11,textAlign:"center"}}>Protein</Text>
   </View>

   <View style={{padding:10,maxWidth:80}}>
     <Text style={{fontSize:20,textAlign:"center"}}>{carbs + "g"}</Text>
     <Text style={{fontSize:11,textAlign:"center"}}>Carbs</Text>
   </View>

   <View style={{padding:10,maxWidth:80}}>
     <Text style={{fontSize:20,textAlign:"center"}}>{fats + "g"}</Text>
     <Text style={{fontSize:11,textAlign:"center"}}>Fat</Text>
   </View>
   
   </View>
   
   </View>



   </View>

   <TouchableOpacity onPress={handlePress} style={{...styles.btn,width:100,margin:"auto"}}>
     <Text style={{...styles.btnText}}>{isEdit ? "Update Food" : "Add Food"}</Text>
   </TouchableOpacity>



 </View>

  );
};

export default FoodForm;