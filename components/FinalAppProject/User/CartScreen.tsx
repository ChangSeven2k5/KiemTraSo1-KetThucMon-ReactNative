import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { fetchCartItems, updateCartQuantity, deleteCartItem } from '@/database/CakeDatabase';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps  } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeStackScreen';

type CartScreenProps = NativeStackScreenProps<HomeStackParamList, 'CartScreen'>;

export default function CartScreen({ route, navigation }: CartScreenProps) {
  // const navigation = useNavigation<CartScreenProp>();
  const { onCartUpdate } = route.params || {};
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const productImages: { [key: string]: any } = {
    'Vanilla_Pudding.jpg': require('../../../assets/images/products/Vanilla_Pudding.jpg'),
    'Gourmet_Red_Velvet_Cupcake.jpg': require('../../../assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
    'Cherry_Flan_Pudding.jpg': require('../../../assets/images/products/Cherry_Flan_Pudding.jpg'),
    'Salted_Caramel_Macarons.jpg': require('../../../assets/images/products/Salted_Caramel_Macarons.jpg'),
  };

  const loadCart = async () => {
    const result = await fetchCartItems();
    setCart(result);
    calculateTotal(result);
    if (onCartUpdate) onCartUpdate(result.length); // cập nhật Header
  };

  useEffect(() => { loadCart(); }, []);

  const calculateTotal = (items: any[]) => {
    const sum = items.reduce((acc, item) => {
      const priceNumber = parseInt(String(item.price).replace(/,/g, '')) || 0;
      return acc + priceNumber * item.quantity;
    }, 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (cartId: number, newQty: number) => {
    if (newQty <= 0) {
      Alert.alert(
        'Remove item',
        'Are you sure you want to remove this item from the cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteCartItem(cartId);
              loadCart();
            }
          }
        ]
      );
    } else {
      await updateCartQuantity(cartId, newQty);
      loadCart();
    }
  };

  const handleCheckout = () => {
    navigation.navigate('CheckoutScreen', { cart, total });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowCard} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.cartId.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.img ? productImages[item.img] : productImages['Salted_Caramel_Macarons.jpg']}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price} VND</Text>
            </View>

            <View style={styles.qtyBox}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantityChange(item.cartId, item.quantity - 1)}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantityChange(item.cartId, item.quantity + 1)}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleQuantityChange(item.cartId, 0)}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🛒 No items in cart</Text>
          </View>
        }
      />

      <View style={styles.bottom}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{total.toLocaleString()} VND</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={[styles.value, { color: 'green' }]}>Free</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={[styles.totalText, { color: '#8B4513' }]}>{total.toLocaleString()} VND</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutTxt}>Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1,
    backgroundColor:'#fff',
    padding:15,
  },
  header:{
    flexDirection: 'column',
    marginBottom:10
  },
  arrowCard: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor:'#F5E2CE',
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    marginBottom:10
  },

  backArrow:{
    fontSize:25,
    color:'#8B4513',
    textAlign:'center',
  },
  title:{
    fontSize:25,
    fontWeight:'bold',
    color:'#8B4513'
  },
  card:{
    flexDirection:'row',
    alignItems:'center',
    padding:12,
    marginBottom:12,
    borderRadius:15,
    backgroundColor:'#fff',
    elevation:3,
    borderWidth: 1,
    borderColor: '#9d464633'
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: '#eee'
  },
  imagePlaceholder:{
    width:60,
    height:60,
    borderRadius:12,
    backgroundColor:'#ddd'
  },

  info:{
    flex:1,
    marginLeft:12
  },
  name:{
    fontSize:14,
    fontWeight:'600',
    color:'#000'
  },
  price:{
    fontSize:12,
    marginTop:4,
    color:'#8B4513'
  },

  qtyBox:{
    flexDirection:'row',
    backgroundColor:'#F5E2CE',
    borderRadius:20,
    paddingVertical:4,
    paddingHorizontal:10,
    alignItems:'center'
  },
  qtyBtn:{
    backgroundColor:'#8B4513',
    borderRadius:50,
    width:25, height:25,
    alignItems:'center',
    justifyContent:'center'
  },
  qtyText:{
    color:'#fff',
    fontSize:15,
    fontWeight:'bold'
  },
  quantity:{
    fontSize:15,
    marginHorizontal:8
  },
  deleteBtn: {
    marginLeft: 10,
    backgroundColor:'#9C4E2C22',
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteIcon: {
    fontSize: 20,
    color: '#8B4513'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  bottom:{
    backgroundColor:'#F2D8C0',
    padding:15,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    marginTop:10
  },
  rowBetween:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:4
  },
  label:{
    fontSize:15,
    color:'#444'
  },
  value:{
    fontSize:15,
    fontWeight:'500'
  },
  totalText:{
    fontSize:18,
    fontWeight:'bold'
  },

  checkoutBtn:{
    backgroundColor:'#8B4513',
    padding:10,
    borderRadius:15,
    marginTop:10
  },
  checkoutTxt:{
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center'
  },

});
