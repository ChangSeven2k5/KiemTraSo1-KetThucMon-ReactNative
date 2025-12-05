import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchProducts, deleteProduct, Product, fetchCategories, Category } from '@/database/CakeDatabase';
import ProductForm from './ProductForm';
import HeaderAdmin from './HeaderAdmin';
import { useRoute, useFocusEffect ,useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const productImages: { [key: string]: any } = {
  'Vanilla_Pudding.jpg': require('../../../assets/images/products/Vanilla_Pudding.jpg'),
  'Gourmet_Red_Velvet_Cupcake.jpg': require('../../../assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
  'Cherry_Flan_Pudding.jpg': require('../../../assets/images/products/Cherry_Flan_Pudding.jpg'),
  'Salted_Caramel_Macarons.jpg': require('../../../assets/images/products/Salted_Caramel_Macarons.jpg'),
};

const ProductManagementScreen = () => {
  const route = useRoute<any>();
  const defaultCategoryId = route.params?.defaultCategoryId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const navigation = useNavigation<any>();

  const loadProducts = async () => setProducts(await fetchProducts());
  const loadCategories = async () => setCategories(await fetchCategories());

  useEffect(() => { 
    loadProducts(); 
    loadCategories(); 
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );
  const handleDelete = (id:number) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => { 
        const result = await deleteProduct(id); 
        if(result){ loadProducts(); Alert.alert('✅ Delete product successfully!'); }
      }}
    ]);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => { setEditingProduct(product); setModalVisible(true); };

  return (
    <View style={{ flex:1}}>
      <HeaderAdmin />

      {/* TITLE + BACK ICON */}
      <View style={styles.titleContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Management</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={{ flex:1, color:'#fff', fontWeight:'bold', textAlign:'center' }}>STT</Text>
            <Text style={{ flex:3, color:'#fff', fontWeight:'bold', textAlign:'center' }}>Name</Text>
            <Text style={{ flex:3, color:'#fff', fontWeight:'bold', textAlign:'center' }}>Price</Text>
            <Text style={{ flex:3, color:'#fff', fontWeight:'bold', textAlign:'center' }}>Category</Text>
            <Text style={{ flex:2, color:'#fff', fontWeight:'bold', textAlign:'center' }}>Actions</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const categoryName = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
          return (
            <View style={styles.tableRow}>
              <Text style={{ flex:1, fontSize:13, textAlign:'center' }}>{index+1}</Text>
              <Text style={{ flex:3, fontSize:13, textAlign:'center' }}>{item.name}</Text>
              <Text style={{ flex:3, fontSize:13, textAlign:'center' }}>{item.price} VND</Text>
              <Text style={{ flex:3, fontSize:13, textAlign:'center' }}>{categoryName}</Text>
              <View style={{ flex:2, flexDirection:'row' }}>
                <TouchableOpacity style={styles.btnEdit} onPress={()=>handleEdit(item)}><Text>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnDelete} onPress={()=>handleDelete(item.id)}><Text>🗑</Text></TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
        <Text style={{ color:'#fff', textAlign:'center' }}>Add Product</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ProductForm
          product={editingProduct || undefined}
          defaultCategoryId={editingProduct ? undefined : defaultCategoryId || undefined}
          productImages={productImages} 
          onSuccess={() => { setModalVisible(false); loadProducts(); }}
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

  // Cell styles
  textCell: { 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center' 

  },
  cellContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 

  },

  btnEdit: { 
    padding: 5, 

  },
  btnDelete: { 
    padding: 5, 
  },
  btnAdd: { 
    backgroundColor: '#6200ea', 
    padding: 10, 
    borderRadius: 5, 
    margin: 10 

  },
});

export default ProductManagementScreen;
