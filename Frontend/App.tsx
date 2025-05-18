import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './src/auth/AuthContext';
import FoodList from './src/Pages/FoodList';
import AddFood from './src/Pages/AddFood';
import Login from './src/auth/Login';
import HomePage from './src/Pages/HomePage';
import Footer from './src/components/Footer';
import About from './src/Pages/About';
import SignUp from './src/auth/Signup';
import MealDetails from './src/Pages/MealDetails';
import WorkoutList from './src/Pages/WorkoutList';
import AddWorkout from './src/Pages/AddWorkout';
import Profile from './src/Pages/Profile'
import Settings from './src/Pages/Settings';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

// ✅ Moved this into a separate component if needed
function MainAppScreens() {
  return (
    <View style={{ flex: 1 }}>
      {/* Screens */}
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#E7F5E8',
            },
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          
          <Stack.Screen name="About" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="FoodList" component={FoodList} />
          <Stack.Screen name="AddFood" component={AddFood} />
          <Stack.Screen name="MealDetails" component={MealDetails} />
          <Stack.Screen name="WorkoutList" component={WorkoutList} />
          <Stack.Screen name="AddWorkout" component={AddWorkout} />
        </Stack.Navigator>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={MainAppScreens} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#E7F5E8',
          flexGrow: 1,
        },
        headerShown: false,
      }}
      initialRouteName="Signup"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { userToken } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
