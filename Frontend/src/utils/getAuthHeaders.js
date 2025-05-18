 import EncryptedStorage from "react-native-encrypted-storage";
 
 const getAuthHeaders = async () => {
    const token = await EncryptedStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  export default getAuthHeaders;