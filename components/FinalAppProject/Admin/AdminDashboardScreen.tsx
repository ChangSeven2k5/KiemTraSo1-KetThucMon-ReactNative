import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderAdmin from './HeaderAdmin';


const AdminDashboardScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1}}>
      <HeaderAdmin />
      <View style={styles.container}>
        <Text style={styles.title}>AdminDashboard</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserManagement')}>
          <Text style={styles.buttonText}>User Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductManagement')}>
          <Text style={styles.buttonText}>Product Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryManagement')}>
          <Text style={styles.buttonText}>Category Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderManagement')}>
          <Text style={styles.buttonText}>Order Management</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 

  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 

  },
  button: { 
    backgroundColor: '#FFA239', 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 10, 
    width: '80%' 

  },
  buttonText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 

  },
});

export default AdminDashboardScreen;
