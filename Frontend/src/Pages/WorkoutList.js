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
import styles from '../Styles/styles';
import WorkoutForm from '../components/WorkoutForm';
import Toast from '../components/Toast';
import { ActivityIndicator } from 'react-native';


const WorkoutList = ({ navigation, route }) => {

  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editModal,setEditModal] = useState(false)
  const [deleteModal,setDeleteModal] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [refresh,setRefresh] = useState(false)
  const [workouts,setWorkouts] = useState([])
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
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

  

  

  const closeModal = () => setEditModal(false);

  const getWorkouts = async (customDate) => {
    try {
      const date = customDate ? getFormattedDate(customDate) : getFormattedDate(new Date());
      const headers = await getAuthHeaders();
      setLoading(true)
      const response = await fetch('http://10.0.2.2:3000/api/workouts/getUserWorkouts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ date }),
      });


      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log(data)
      setWorkouts(data);
      
    } catch (error) {
      console.error('Error fetching:', error.message);
    }finally{
      setLoading(false)
    }
  };

  const handleEdit = async (FD) => {
  const headers = await getAuthHeaders();
  console.log(selectedItem);
  const date = getFormattedDate(selectedDate)
  const formData = { ...FD, workout_date:date };
  console.log("Final Form Data:", formData);

  try {
    const response = await fetch(`http://10.0.2.2:3000/api/workouts/updateWorkout/${selectedItem.workout_id}`, {
      method: "PUT", 
      headers,
      body: JSON.stringify(formData),
    });

    if (response.ok) {
    console.log("Updated")
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
   setSelectedItem(item);
   console.log("open Modal",item)
    setEditModal(true);
   
    
  };

  const onDelete = (item) => {
    setSelectedItem(item);
    setDeleteModal(true)
  }

const handleDelete = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`http://10.0.2.2:3000/api/workouts/deleteWorkout/${selectedItem.workout_id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Delete failed: ${errText}`);
    }
    setDeleteModal(false)
    setSelectedItem(null)
   setRefresh((prev) => !prev)
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
    getWorkouts(selectedDate);
  }, [selectedDate,refresh]);

  

   const renderItem = ({ item }) => (
  <View style={[styles.itemContainer, { position: 'relative',  }]}>
    

    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
      <View>
        <Text style={styles.name}>{item.workout_type}</Text>
        <Text style={styles.duration}>{item.duration_minutes + " minutes"}</Text>
         <Text style={{ fontSize: 20, fontWeight: "bold",marginTop:10 }}>{item.calories_burned + " kcal 🔥"}</Text>
      </View>
     <View style={{flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity onPress={() => {
  console.log("Pressed Edit Icon");
  openModal(item);
}}>
        <Icon name="create-outline" size={30} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item)}>
        <Icon name="trash-outline" size={30} color="#F44336" />
      </TouchableOpacity>
    </View>
    </View>
  </View>
);


  if (editModal && selectedItem) {
  return (
    <EditModal onClose={closeModal} visible={editModal}>
      <WorkoutForm
        existingValues={selectedItem}
        isEdit={true}
        editWorkout={handleEdit}
      />
    </EditModal>
  );
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
      <Header heading={'Daily Exercise Breakdown'} />

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
  data={workouts}
  keyExtractor={(item) => item.workout_id}
  renderItem={renderItem}
  ListEmptyComponent={
    <View style={{ backgroundColor: "white", marginVertical: 20, borderRadius: 30 }}>
      <Text style={{ textAlign: "center", fontSize: 20, padding: 10 }}>No Workout Logged Yet</Text>
    </View>
  }
  ListFooterComponent={
    <TouchableOpacity
      style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}
      onPress={() =>
        navigation.navigate('MainApp', {
          screen: 'AddWorkout',
          params: { date: selectedDate },
        })
      }
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

export default WorkoutList;
