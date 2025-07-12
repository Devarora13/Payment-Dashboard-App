import React, { useState, useEffect } from "react";
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabsNavigator from "./TabsNavigator";
import * as SecureStore from "expo-secure-store";
import { getToken } from "../utils/storage";

const Stack = createNativeStackNavigator<RootStackParamList>();
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TransactionDetails: undefined;
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      //   const token = await SecureStore.getItemAsync('token');
      const token = await getToken("token");
      setIsAuthenticated(!!token);
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return null; // or splash screen
  }

  return (
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     {!isAuthenticated ? (
    //       <Stack.Screen name="Login" component={LoginScreen} />
    //     ) : (
    //       <Stack.Screen name="Main" component={TabsNavigator} />
    //     )}
    //   </Stack.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabsNavigator} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={{ title: 'Transaction', headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
