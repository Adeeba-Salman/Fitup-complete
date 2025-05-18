import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import getAuthHeaders from '../utils/getAuthHeaders';
import Icon from 'react-native-vector-icons/Ionicons';
import EditModal from '../components/EditModal';
import FoodForm from '../components/FoodForm';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import { ActivityIndicator } from 'react-native';


const MealDetails = ({ navigation, route }) => {
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [flatListData, setFlatListData] = useState([]);
  const [editModal,setEditModal] = useState(false)
  const [deleteModal,setDeleteModal] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [foodObject,setFoodObject] = useState(null) ;
  const [refresh,setRefresh] = useState(false)
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [toastVisible,setToastVisible] = useState(false)
  const [loading,setLoading] = useState(false)

  const getFormattedDate = (date) => date.toISOString().split('T')[0];

  const today = getFormattedDate(new Date());
  const selected = getFormattedDate(selectedDate);

  const goToPreviousDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const goToNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const flattenMeals = (meals) => {
    const flatList = [];
    meals.forEach((meal) => {
      flatList.push({
        type: 'header',
        meal_id: meal.meal_id,
        meal_name: meal.meal_name,
      });
      meal.items.forEach((item) => {
        flatList.push({ type: 'item',meal_name:meal.meal_name, ...item });
      });
    });
    return flatList;
  };

  const closeModal = () => setEditModal(false);

  const getMeals = async (customDate) => {
    try {
      setLoading(true)
      const date = customDate ? getFormattedDate(customDate) : getFormattedDate(new Date());
      const headers = await getAuthHeaders();

      const response = await fetch('http://10.0.2.2:3000/api/meals/dayMeals', {
        method: 'POST',
        headers,
        body: JSON.stringify({ date }),
      });

     
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
        setLoading(false)
        const data = await response.json();
        const flattened = flattenMeals(data.meals);
        setFlatListData(flattened);
    } catch (error) {
      console.error('Error fetching:', error.message);
      setLoading(false)
    }
  };

  const handleEdit = async (meal,FD) => {
  const headers = await getAuthHeaders();
  

  console.log(selectedItem);
  console.log(foodObject);

  let mId;

  try {
    const res1 = await fetch('http://10.0.2.2:3000/api/meals/createMeal', {
      method: "POST",
      headers,
      body: JSON.stringify({ meal_name: meal,date: selectedDate }),
    });

    if (!res1.ok) {
      throw new Error('Failed to create meal');
    }

    const data = await res1.json();
    console.log("Meal creation response:", data);
    mId = data.mealId;

  } catch (error) {
    console.log("Error creating meal:", error);
    return;
  }

  const formData = { ...FD, meal_id: mId };
  console.log("Final Form Data:", formData);

  try {
    const response = await fetch(`http://10.0.2.2:3000/api/meals/updateMeals/${selectedItem.id}`, {
      method: "PUT", 
      headers,
      body: JSON.stringify(formData),
    });

    if (response.ok) {
    setEditModal(false)
    setRefresh((prev) => !prev)
    setTimeout(() => {
      setToastVisible(true)
    setToastMessage("Updated Succesfuly!")
    setToastType("success")
    },[2000])

    } else {
      console.log("Update failed with status", response.status);
    }
  } catch (error) {
    console.log("Error updating workout:", error);
    setTimeout(() => {
      setToastVisible(true)
    setToastMessage("Failed")
    setToastType("error")
    },[2000])
  }
};

const openModal = (item) => {
    setEditModal(true);
    setSelectedItem(item);
    const food = {
      id : item.food_id,
      name:item.name,
      measurement_type: item.measurement_type,
      average_grams_per_unit : item.average_grams_per_unit
    }
    setFoodObject(food);
  };

  const onDelete = (item) => {
    setSelectedItem(item);
    setDeleteModal(true)
  }

const handleDelete = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`http://10.0.2.2:3000/api/meals/deleteMeal/${selectedItem.id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Delete failed: ${errText}`);
    }
    setDeleteModal(false)
    getMeals(selectedDate);
    setTimeout(() => {
      setToastVisible(true)
    setToastMessage("Deleted Succesfully!")
    setToastType("success")
    },[2000])
  } catch (err) {
    console.error('Delete error:', err.message);
    setTimeout(() => {
      setToastVisible(true)
    setToastMessage("Deletion Failed")
    setToastType("error")
    },[2000])
  }
};

  useEffect(() => {
    getMeals(selectedDate);
  }, [selectedDate,refresh]);

  const renderItem = ({ item }) => {
  if (item.type === 'header') {
    return (
      <View
        style={{
          backgroundColor: '#d1e7dd',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          marginTop: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f5132' }}>
          {item.meal_name.toUpperCase()}
        </Text>
       
      </View>
    );
  }

  if (item.type === 'item') {
    return (
      <View
        style={{
          backgroundColor: '#f8f9fa',
          padding: 8,
          borderRadius: 6,
          marginBottom: 6,
        }}
      >
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
         <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={{
              
              paddingVertical: 4,
              paddingHorizontal: 10,
              
            }}
          >
             <Icon name="pencil" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item)}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              
              
            }}
          >
             <Icon name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
        </View>
        <Text style={{ fontSize: 14, color: '#495057' }}>
          Calories: {item.calories} kcal | Protein: {item.protein}g | Fats: {item.fats}g | Carbs: {item.carbs}g
        </Text>
       
      </View>
    );
  }

  return null;
};
  if(editModal){
    return(
      <EditModal onClose={closeModal} visible={editModal} >
        <FoodForm food={foodObject} existingValues={selectedItem} isEdit={true} editMeal={handleEdit} ></FoodForm>
      </EditModal>
    )
  }

  if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>{"Loading..."}</Text>
        </View>
      );
    }

  


  return (
    <View style={{ flex: 1, marginTop: 40, marginHorizontal: 20 }}>
      <Header heading={'Daily Meals Breakdown'} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={goToPreviousDate}>
          <Text style={{ fontSize: 28 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>{selected === today ? 'Today' : selected}</Text>
        <TouchableOpacity onPress={goToNextDate}>
          <Text style={{ fontSize: 28 }}>→</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={flatListData}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.meal_id}` : `item-${item.id}-${index}`
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
         ListEmptyComponent={
            <View style={{ backgroundColor: "white", marginVertical: 20, borderRadius: 30 }}>
              <Text style={{ textAlign: "center", fontSize: 20, padding: 10 }}>No Meals Logged</Text>
            </View>
          }
          ListFooterComponent={
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}
                 onPress={() => navigation.navigate('MainApp', {
    screen: 'FoodList',
    params: { mealName : '',date : selectedDate }
  }) }
              >
                <Icon name="add-circle-outline" size={30} color="black" />
              </TouchableOpacity>
              
            }
      />

      {toastVisible && (
  <Toast
      message={toastMessage}
      type={toastType}
      visible={toastVisible}
      onDismiss={() => setToastVisible(false)}
    />
)}
      {deleteModal && (
        <DeleteModal visible={deleteModal} onConfirm={handleDelete} onCancel={() => setDeleteModal(false)}></DeleteModal>
      )}
    </View>
  );
};

export default MealDetails;
