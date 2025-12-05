import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import LoginSqlite from './LoginSqlite';
import ProfileStackScreen from './User/ProfileStackScreen';
import SignupSqlite from './SignupSqlite';
import HomeStackScreen from './User/HomeStackScreen';


export type BottomTabParamList = {
    HomeTab: undefined,
    ProfileTab: undefined,
    SignupSqlite: undefined;
    LoginSqlite: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

const AppTabs = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>

      <Tab.Screen 
        name='HomeTab' 
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen 
        name='SignupSqlite' 
        component={SignupSqlite}
        options={{
          title: 'Signup',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>➕</Text>
          ),
        }}
      />

      <Tab.Screen 
        name='LoginSqlite' 
        component={LoginSqlite}
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔒</Text>
          ),
        }}
      />

      <Tab.Screen 
        name='ProfileTab' 
        component={ProfileStackScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👨‍🎓</Text>
          ),
        }}
      />

    </Tab.Navigator>
  );
};


export default AppTabs

