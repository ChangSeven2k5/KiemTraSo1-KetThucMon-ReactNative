import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchOrdersWithItemsByUser } from '@/database/CakeDatabase';
import { Ionicons } from '@expo/vector-icons';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const navigation = useNavigation();
  

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    const data = await fetchOrdersWithItemsByUser();
    setOrders(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );
  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#8B4513" />
      </TouchableOpacity>

      <Text style={styles.title}>Order History</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const total = Number(item.totalPrice || 0);

          return (
            <View style={styles.orderCard}>
              <Text style={styles.orderCode}>ORDER ID: #{item.id}</Text>

              <Text style={styles.orderDate}>
                Order Date: {item.orderDate ? new Date(item.orderDate).toLocaleString() : "N/A"}
              </Text>
              <Text style={{
                fontWeight: 'bold',
                color:
                  item.status === "Completed" ? "green" :
                  item.status === "Canceled" ? "red" :
                  "#FFA239",
                marginBottom: 5
              }}>
                Status: {item.status}
              </Text>

              <Text style={styles.total}>
                 Total: {(Number(item.totalPrice) || 0).toLocaleString('vi-VN')} VND
              </Text>

              <Text style={styles.productTitle}>Purchased Products:</Text>

              {item.items?.map((p: any, index: number) => (
                <Text key={index} style={styles.productItem}>
                  • {p.productName} x {p.quantity}
                </Text>
              ))}
            </View>
          );
        }}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    padding:15, 
    backgroundColor:'#fff' 
  },

  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5E2CE',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
    marginTop:10
  },

  title: { 
    fontSize:25, 
    fontWeight:'bold', 
    marginBottom:15, 
    color:'#8B4513' 
  },

  orderCard: {
    backgroundColor:'#FAF5EF',
    padding:15,
    marginBottom:10,
    borderRadius:10,
    borderWidth:1,
    borderColor:'#E8D5C4'
  },

  orderCode: { 
    fontSize:16, 
    fontWeight:'bold', 
    color:'#8B4513' 
  },
  orderDate: { 
    color:'#555', 
    marginVertical:3 
  },
  total: { 
    fontWeight:'bold', 
    marginVertical:5,
    color: 'red'
  },

  productTitle: { 
    marginTop:10, 
    fontWeight:'bold', 
    color:'#333' 
  },
  productItem: { 
    marginLeft:10, 
    color:'#444', 
    marginTop:2 
  },
  emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 100, 
},
emptyText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#888',
}
});
