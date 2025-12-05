import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchOrders, updateOrderStatus } from '@/database/CakeDatabase';
import HeaderAdmin from './HeaderAdmin';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const confirmCancel = (orderId: number) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No" },
        { text: "Yes", onPress: () => handleUpdateStatus(orderId, "Canceled") }
      ]
    );
  };

  const renderItem = ({ item }: any) => {
    // Set status color
    let statusColor = '#FFA239'; 
    if (item.status === 'Completed') statusColor = 'green';
    if (item.status === 'Canceled') statusColor = 'red';

    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text>User: {item.username}</Text>
        <Text style={{color: 'red'}}>Total: {item.totalPrice.toLocaleString('vi-VN')} VND</Text>
        <Text style={{ color: statusColor, fontWeight: 'bold' }}>Status: {item.status}</Text>
        <Text>Order Date: {new Date(item.orderDate).toLocaleString()}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'green' }]}
            onPress={() => handleUpdateStatus(item.id, 'Completed')}
          >
            <Text style={styles.btnText}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#ff4d4d' }]}
            onPress={() => confirmCancel(item.id)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1}}>
      <HeaderAdmin></HeaderAdmin>

      {/* TITLE + BACK ICON */}
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Management</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No orders yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    marginTop: 20, 
    marginBottom: 10, 
    paddingHorizontal: 10 
  },
  backButton: { 
    marginRight: 10, 
    padding: 5 
  },
  backText: { 
    fontSize: 16, 
    color: '#8B4513', 
    fontWeight: 'bold' 
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
  },
  orderItem: {
    padding: 15,
    margin: 10,
    backgroundColor: '#FFE7C1',
    borderRadius: 10,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  btn: {
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default OrderManagementScreen;
