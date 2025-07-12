import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AddPaymentScreen from '../screens/AddPaymentScreen';
import TransactionsListScreen from '../screens/TransactionsListScreen';
import LogoutScreen from '../screens/LogoutScreen';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Add Payment" component={AddPaymentScreen} />
      <Tab.Screen name="Transactions" component={TransactionsListScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
