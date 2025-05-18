import React, { createContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from '../components/Toast';

export const AuthContext = createContext({
  userToken: null,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await EncryptedStorage.getItem('token');
      if (token) setUserToken(token);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    console.log("Hi")
    try {
      const res = await fetch('http://10.0.2.2:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login",res);
      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      const token = data.token;

      await EncryptedStorage.setItem('token', token);
      setUserToken(token);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  const logout = async () => {
    try {
      const token = await EncryptedStorage.getItem('token');

      if (!token) {
        setUserToken(null);

        return;
      }

      const response = await fetch('http://10.0.2.2:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok || response.status === 400 || response.status === 401) {
        await EncryptedStorage.removeItem('token');
        setUserToken(null);


      } else {

      }
    } catch (error) {

    }
  };

  const register = async (formData) => {
    console.log("REgister",formData);
   const res = await fetch('http://10.0.2.2:3000/api/auth/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(formData),
   });

   const data = await res.json();

   if (!res.ok) {
     const errorMsg = data?.message || 'Registration failed. Please try again.';
     throw new Error(errorMsg);
   }

   return data.message || 'Registration successful';
  };


  return (
    <AuthContext.Provider value={{ userToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};