import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Product, Category, addProduct, updateProduct, fetchCategories } from '@/database/CakeDatabase';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  product?: Product;        
  defaultCategoryId?: number; // category mặc định khi thêm mới
  productImages?: { [key: string]: any }; 
  onSuccess: (newProduct?: Product) => void; // callback sau khi thêm/sửa thành công
};

const ProductForm = ({ product, defaultCategoryId,productImages, onSuccess }: Props) => {
  const isEdit = !!product?.id && product.id > 0;

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '');
  const [categoryId, setCategoryId] = useState<number>(product?.categoryId || defaultCategoryId || 1);
  const [imageUri, setImageUri] = useState(product?.img || '');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      if (!isEdit) {
        setCategoryId(defaultCategoryId || data[0]?.id || 1);
      }
    };
    loadCategories();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('❌ Please fill all required fields!');
      return;
    }

    const newProduct: Product = {
      id: product?.id || 0,
      name,
      price,
      img: imageUri,
      categoryId,
    };

    const success = isEdit ? await updateProduct(newProduct) : await addProduct(newProduct);

    if (success) {
      Alert.alert('✅ Product saved successfully!');
      onSuccess(newProduct); // truyền product vừa thêm
    } else {
      Alert.alert('❌ Error saving product!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.formTitle}>{isEdit ? 'Edit Product' : 'Add Product'}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Price</Text>
      <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryBtn, categoryId === cat.id && styles.categoryBtnActive]}
            onPress={() => setCategoryId(cat.id)}
          >
            <Text style={{ color: categoryId === cat.id ? '#fff' : '#000' }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* <Text style={styles.label}>Image</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null} */}
      {imageUri ? (
        <Image
          source={
            productImages && productImages[imageUri]
              ? productImages[imageUri]        
              : { uri: imageUri }              
          }
          style={styles.image}
        />
      ) : null}
      <TouchableOpacity style={styles.btnPickImage} onPress={pickImage}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Pick Image</Text>
      </TouchableOpacity>

      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => onSuccess()}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>{isEdit ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductForm

const styles = StyleSheet.create({
  container: { 
    padding: 10 ,
    marginTop: 20
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 10 

  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 5, 
    marginTop: 5 

  },
  categoryContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 5 },
  categoryBtn: { 
    padding: 8, 
    backgroundColor: '#eee', 
    borderRadius: 5, 
    marginRight: 5, 
    marginTop: 5 

  },
  categoryBtnActive: { 
    backgroundColor: '#6200ea' 

  },
  btnPickImage: {
    backgroundColor: '#28a745', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10 

  },
  image: { 
    width: '100%', 
    height: 150, 
    marginTop: 10, 
    borderRadius: 5 

  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  btnSubmit: {
    backgroundColor: '#FF9D00',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },

  btnCancel: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
});
