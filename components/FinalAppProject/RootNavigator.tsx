import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSqlite from './LoginSqlite';
import SignupSqlite from './SignupSqlite';
import AppTabs from './AppTabs';
import AdminTabs from './Admin/AdminTabs';
import Welcome from './Welcome';

export type AuthStackParamList = {
    Welcome: undefined;
    Signup: undefined;
    Login: undefined;
    Main: undefined;
    Admin: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();
const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name='Login' component={LoginSqlite}></Stack.Screen>
      <Stack.Screen name='Signup' component={SignupSqlite}></Stack.Screen>
      <Stack.Screen name='Main' component={AppTabs}></Stack.Screen>
      <Stack.Screen name='Admin' component={AdminTabs}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default RootNavigator
