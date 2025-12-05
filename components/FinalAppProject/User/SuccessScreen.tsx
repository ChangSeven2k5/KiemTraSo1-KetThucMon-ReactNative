import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from './HomeStackScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SuccessScreenProp = NativeStackNavigationProp<HomeStackParamList, 'SuccessScreen'>;
type SuccessRouteProp = RouteProp<HomeStackParamList, 'SuccessScreen'>;

const productImages: { [key: string]: any } = {
  'Vanilla_Pudding.jpg': require('../../../assets/images/products/Vanilla_Pudding.jpg'),
  'Gourmet_Red_Velvet_Cupcake.jpg': require('../../../assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
  'Cherry_Flan_Pudding.jpg': require('../../../assets/images/products/Cherry_Flan_Pudding.jpg'),
  'Salted_Caramel_Macarons.jpg': require('../../../assets/images/products/Salted_Caramel_Macarons.jpg'),
};

export default function SuccessScreen() {
  const navigation = useNavigation<SuccessScreenProp>();
  const route = useRoute<SuccessRouteProp>();

  const { items, total, address, phone, paymentMethod } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Successful!</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Shipping Information</Text>
        <Text style={styles.infoText}>📍 Address: {address}</Text>
        <Text style={styles.infoText}>📞 Phone: {phone}</Text>
        <Text style={styles.infoText}>💳 Payment: {paymentMethod}</Text>
      </View>

      <Text style={styles.subtitle}>Order Details:</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.cartId.toString()}
        renderItem={({ item }) => {
          const priceNumber = parseInt(String(item.price).replace(/,/g, ''));

          return (
            <View style={styles.item}>
              <Image
                source={
                  item.img && productImages[item.img]
                    ? productImages[item.img]
                    : require('../../../assets/images/products/Salted_Caramel_Macarons.jpg')
                }
                style={styles.image}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.qty}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.price}>
                {(priceNumber * item.quantity).toLocaleString()} VND
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total: {total.toLocaleString()} VND</Text>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex:1,
    padding:20, 
    backgroundColor:'#fff' 
  },
  title:{ 
    fontSize:24, 
    fontWeight:'bold', 
    color:'#8B4513', 
    textAlign:'center', 
    marginBottom:20 
  },

  infoBox:{
    backgroundColor:'#F9EFE5',
    padding:15,
    borderRadius:12,
    marginBottom:15
  },
  infoTitle:{ 
    fontSize:18, 
    fontWeight:'600', 
    color:'#8B4513', 
    marginBottom:5
   },
  infoText:{ 
    fontSize:15, 
    marginVertical:2, 
    color:'#333' 
  },

  subtitle:{ 
    fontSize:18, 
    fontWeight:'600', 
    marginVertical:10 
  },

  item:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:12,
    backgroundColor:'#F9F1ED',
    padding:10,
    borderRadius:15
  },
  image:{ 
    width:60, 
    height:60, 
    borderRadius:10 
  },
  itemInfo:{ 
    flex:1, 
    marginLeft:10 
  },
  name:{ 
    fontSize:16, 
    fontWeight:'600' 
  },
  qty:{ 
    fontSize:14, 
    color:'#555', 
    marginTop:4 },
  price:{ 
    fontSize:15, 
    fontWeight:'bold', 
    color:'#8B4513' 
  },

  totalBox:{ 
    marginTop:20, 
    padding:15, 
    backgroundColor:'#F2D8C0', 
    borderRadius:15 
  },
  totalText:{ 
    fontSize:18, 
    fontWeight:'bold', 
    color:'#8B4513', 
    textAlign:'right' 
  },

  homeBtn:{
    marginTop:20, 
    backgroundColor:'#8B4513', 
    padding:15, borderRadius:15 
  },
  homeBtnText:{ 
    textAlign:'center', 
    fontSize:16, 
    fontWeight:'bold', 
    color:'#fff' 
  }
});
