import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminDashboardScreen from './Admin/AdminDashboardScreen';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';
import HomeStackScreen, { HomeStackParamList } from './User/HomeStackScreen';

export type RootStackParamList  = {
  SignupSqlite: undefined;
  LoginSqlite: undefined;
  HomeStack: { screen?: keyof HomeStackParamList } | undefined;
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const App = () => {
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginSqlite" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignupSqlite" component={SignupSqlite} />
        <Stack.Screen name="LoginSqlite" component={LoginSqlite} />
        <Stack.Screen name="HomeStack" component={HomeStackScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    // </NavigationContainer>
  )
}

