import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from './HomeStackScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { checkoutOrder } from '@/database/CakeDatabase';

type CheckoutScreenProp = NativeStackNavigationProp<HomeStackParamList, 'CheckoutScreen'>;
type CheckoutRouteProp = RouteProp<HomeStackParamList, 'CheckoutScreen'>;

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenProp>();
  const route = useRoute<CheckoutRouteProp>();
  const { cart, total } = route.params;

  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('COD');

  const handleCheckout = async () => {
    if (!address || !phone) {
      Alert.alert('Missing info', 'Please enter your address and phone number.');
      return;
    }

    const success = await checkoutOrder(phone, paymentMethod);
    if (success) {
      navigation.navigate('SuccessScreen', {
        items: cart,
        total,
        address,
        phone,
        paymentMethod,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.arrowCard} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#8B4513" />
      </TouchableOpacity>

      <Text style={styles.title}>Checkout</Text>

      <TextInput
        style={styles.input}
        placeholder="Shipping address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="number-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={{ marginTop: 10, marginBottom: 5 }}>Payment Method</Text>

      {/* COD */}
      <TouchableOpacity
        style={[styles.paymentBtn, paymentMethod === 'COD' && styles.selected]}
        onPress={() => setPaymentMethod('COD')}
      >
        <Text style={styles.paymentTxt}>Cash on Delivery (COD)</Text>
      </TouchableOpacity>

      {/* Banking */}
      <TouchableOpacity
        style={[styles.paymentBtn, paymentMethod === 'Banking' && styles.selected]}
        onPress={() => setPaymentMethod('Banking')}
      >
        <Text style={styles.paymentTxt}>Banking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
        <Text style={styles.btnTxt}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  arrowCard:{
    width:30, height:30, borderRadius:8, backgroundColor:'#F5E2CE',
    justifyContent:'center', alignItems:'center', marginBottom:10, marginTop:10
  },
  title:{
    fontSize:25, fontWeight:'bold', color:'#8B4513', marginBottom:15
  },
  input:{
    borderWidth:1, padding:10, borderRadius:10, marginBottom:15
  },
  paymentBtn:{
    padding:12,
    borderRadius:10,
    borderWidth:1,
    borderColor:'#ccc',
    marginBottom:10
  },
  selected:{
    borderColor:'#8B4513',
    backgroundColor:'#F5E2CE'
  },
  paymentTxt:{ fontSize:16 },
  btn:{
    backgroundColor:'#8B4513',
    padding:15,
    borderRadius:10,
    marginTop:20
  },
  btnTxt:{ 
    color:'#fff', 
    textAlign:'center', 
    fontSize:16, 
    fontWeight:'bold' 
  }
});
