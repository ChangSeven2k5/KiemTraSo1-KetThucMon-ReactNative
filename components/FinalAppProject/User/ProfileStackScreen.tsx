// ProfileStackScreen.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ProfileScreen from './ProfileScreen';
import OrderHistoryScreen from '@/components/FinalAppProject/User/OrderHistoryScreen';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  OrderHistoryScreen: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackScreen;
