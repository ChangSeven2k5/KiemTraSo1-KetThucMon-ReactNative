import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { fetchCategories, Category, addCategory, updateCategory, deleteCategory, Product } from '@/database/CakeDatabase';
import ProductForm from './ProductForm';
import HeaderAdmin from './HeaderAdmin';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [defaultCategoryId, setDefaultCategoryId] = useState<number | null>(null);

  const navigation = useNavigation<any>();

  const loadCategories = async () => setCategories(await fetchCategories());

  useEffect(() => { loadCategories(); }, []);

  const handleSaveCategory = async () => {
    if (!newCategory.trim()) return;
    if (editingId !== null) {
      await updateCategory(editingId, newCategory);
      setEditingId(null);
    } else {
      await addCategory(newCategory);
    }
    setNewCategory('');
    loadCategories();
  };

  const handleEditCategory = (item: Category) => { setNewCategory(item.name); setEditingId(item.id); };
  const handleDeleteCategory = async (id: number) => {
    Alert.alert('Delete Category', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => { await deleteCategory(id); loadCategories(); } }
    ]);
  };

  const handleAddProduct = (category: Category) => {
    setDefaultCategoryId(category.id);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderAdmin />
      {/* TITLE + BACK ICON */}
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Category Management</Text>
      </View>

       {/* Add category */}
      <View style={styles.addContainer}>
        <TextInput placeholder="New category name" style={styles.input} value={newCategory} onChangeText={setNewCategory} />
        <TouchableOpacity style={styles.btnAdd} onPress={handleSaveCategory}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>{editingId !== null ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={[styles.cellContainer, { flex: 1 }]}><Text style={styles.textCell}>STT</Text></View>
        <View style={[styles.cellContainer, { flex: 3 }]}><Text style={styles.textCell}>Name</Text></View>
        <View style={[styles.cellContainer, { flex: 4 }]}><Text style={styles.textCell}>Actions</Text></View>
      </View>

      {/* Categories Table */}
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cellContainer, { flex: 1 }]}>{index+1}</Text>
            <Text style={[styles.cellContainer, { flex: 3 }]}>{item.name}</Text>
            <View style={[styles.cellContainer, { flex: 4, flexDirection: 'row' }]}>
              <TouchableOpacity style={styles.btnEdit} onPress={() => handleEditCategory(item)}><Text>✏️</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteCategory(item.id)}><Text>🗑</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnAddProduct} onPress={() => handleAddProduct(item)}><Text style={{color:'#fff'}}>➕ Product</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />


      {/* Modal thêm/sửa sản phẩm */}
      <Modal visible={modalVisible} animationType="slide">
        <ProductForm
          defaultCategoryId={defaultCategoryId || undefined}
          onSuccess={(newProduct) => {
            setModalVisible(false);
            // Chuyển đến ProductManagementScreen với sản phẩm vừa thêm
            if (newProduct) {
              // @ts-ignore
              navigation.navigate('ProductManagement', { defaultCategoryId: newProduct.categoryId });
            }
          }}
        />
      </Modal>
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
  addContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10
  },
  btnAdd: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5
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
  textCell: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  btnEdit: { padding: 5 },
  btnDelete: { padding: 5 },
  btnAddProduct: {
    backgroundColor: '#FF9D00',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5
  }
});

export default CategoryManagementScreen;
