import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from './AdminDashboardScreen';
import UserManagementScreen from './UserManagementScreen';
import ProductManagementScreen from './ProductManagementScreen';
import CategoryManagementScreen from './CategoryManagementScreen';
import { Text } from 'react-native';
import OrderManagementScreen from './OrderManagementScreen';

export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  ProductManagement: { defaultCategoryId?: number }; 
  CategoryManagement: undefined;
  OrderManagement: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="UserManagement" component={UserManagementScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
      <Tab.Screen name="ProductManagement" component={ProductManagementScreen} options={{ tabBarIcon: () => <Text>🍰</Text> }} />
      <Tab.Screen name="CategoryManagement" component={CategoryManagementScreen} options={{ tabBarIcon: () => <Text>📂</Text> }} />
      <Tab.Screen name="OrderManagement" component={OrderManagementScreen} options={{ tabBarIcon: () => <Text>🎁</Text> }} />
    </Tab.Navigator>
  );
};

export default AdminTabs;
