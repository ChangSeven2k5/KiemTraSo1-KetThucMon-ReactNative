import { Alert, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { deleteUser, fetchUsers, User, updateUser } from '@/database/CakeDatabase';
import HeaderAdmin from './HeaderAdmin';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<'admin' | 'user'>('user'); //Tab hiện tại
  const navigation = useNavigation<any>();

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = (id: number) => {
    Alert.alert('Delete user', 'Are you sure you want to delete?', [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        onPress: async () => {
          const result = await deleteUser(id);
          if (result) {
            loadUsers();
            Alert.alert('✅ Delete user successfully!');
          } else {
            Alert.alert('❌ Error deleting user');
          }
        } 
      },
    ]);
  };
  const handleToggleRole = async (user: User) => {
    const newRole = user.role === 'user' ? 'admin' : 'user';
    await updateUser({...user, role: newRole}); 
    loadUsers();
    setSelectedTab(newRole as 'admin' | 'user');
  };

  // Lọc theo tab
  const filteredUsers = users.filter(u => u.role === selectedTab);

  return (
    <View style={{ flex: 1 }}>
      <HeaderAdmin></HeaderAdmin>

      {/* TITLE + BACK ICON */}
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.title}>User Management</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'admin' && styles.activeTab]}
          onPress={() => setSelectedTab('admin')}>
          <Text style={styles.tabText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'user' && styles.activeTab]}
          onPress={() => setSelectedTab('user')}>
          <Text style={styles.tabText}>User</Text>
        </TouchableOpacity>
      </View>

      {/* Bảng */}
      <View style={styles.tableHeader}>
        <View style={[styles.cellContainer, {flex: 1}]}>
          <Text style={styles.textCell}>STT</Text>
        </View>
        <View style={[styles.cellContainer, {flex: 3}]}>
          <Text style={styles.textCell}>Username</Text>
        </View>
        <View style={[styles.cellContainer, {flex: 2}]}>
          <Text style={styles.textCell}>Role</Text>
        </View>
        <View style={[styles.cellContainer, {flex: 4}]}>
          <Text style={styles.textCell}>Actions</Text>
        </View>
      </View>


      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <View style={[styles.cellContainer, {flex: 1}]}>
              <Text style={{fontSize: 13}}>{index + 1}</Text>
            </View>
            <View style={[styles.cellContainer, {flex: 3}]}>
              <Text style={{fontSize: 13}}>{item.username}</Text>
            </View>
            <View style={[styles.cellContainer, {flex: 2}]}>
              <Text style={{fontSize: 13}}>{item.role}</Text>
            </View>
            <View style={[styles.cellContainer, {flex: 4, flexDirection:'row'}]}>
              <TouchableOpacity style={styles.btnRole} onPress={() => handleToggleRole(item)}>
                <Text style={{color:'#fff', fontSize: 13}}>{item.role === 'user' ? 'Make Admin' : 'Make User'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
                 <Text style={{ fontSize: 13}}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'flex-start',
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
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 10 }
  ,
  tabButton: { 
    padding: 10, 
    marginHorizontal: 5, 
    borderRadius: 5, 
    backgroundColor: '#a1d7ea' 

  },
  activeTab: { 
    backgroundColor: '#8B4513' 

  },
  tabText: { 
    color: 'white', 
    fontWeight: 'bold' 

  },

  tableHeader: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#6200ea' 

  },
  tableRow: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#ccc' 

  },
  // style cho Text
textCell: { 
  color: '#fff', 
  fontWeight: 'bold', 
  textAlign: 'center' 
},

cellContainer: { 
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center' ,
  
},

btnRole: { 
  marginRight: 10, backgroundColor:'#ffc107', 
  padding:5, 
  borderRadius:5 

},
btnDelete: { 
  padding:5, 

}
});

export default UserManagementScreen;
