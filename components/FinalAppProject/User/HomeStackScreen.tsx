import { Product } from '@/database/CakeDatabase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './HomeScreen';
import ProductDetailScreen from './ProductDetailsScreen';
import ProductsByCategoryScreen from './ProductsByCategoryScreen';
import CartScreen from './CartScreen';
import SuccessScreen from './SuccessScreen';
import CheckoutScreen from './CheckoutScreen';


export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName?: string };
  CartScreen: { onCartUpdate?: React.Dispatch<React.SetStateAction<number>> };
  CheckoutScreen: { cart: any[]; total: number };
  SuccessScreen: { items: any[]; total: number; address: string, phone: string; paymentMethod: string; };
}

const Stack = createNativeStackNavigator<HomeStackParamList >();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen