import React from 'react';
import { Modal, View, Button,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const EditModal = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
       <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, position: 'relative' }}>
 <TouchableOpacity style={{marginBottom:7}} onPress={onClose}>
   <Icon 
    name="close-circle-outline" 
    size={30} 
    style={{ 
      position: 'absolute', 
      top: 0, 
      right: 10, 
      zIndex: 1 
    }} 
  />
 </TouchableOpacity>
  {children}
</View>

      </View>
    </Modal>
  );
};

export default EditModal;