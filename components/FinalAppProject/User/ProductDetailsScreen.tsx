import { Category, fetchCategories, addToCart } from '@/database/CakeDatabase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from './HomeStackScreen';
import CategorySelector from './CategorySelector';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const imagesMap: Record<string, any> = {
  'Vanilla_Pudding.jpg': require('@/assets/images/products/Vanilla_Pudding.jpg'),
  'Gourmet_Red_Velvet_Cupcake.jpg': require('@/assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
  'Cherry_Flan_Pudding.jpg': require('@/assets/images/products/Cherry_Flan_Pudding.jpg'),
  'Salted_Caramel_Macarons.jpg': require('@/assets/images/products/Salted_Caramel_Macarons.jpg'),
};

const ProductDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const load = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    load();
  }, []);

  const handleSelectCategory = (id: number) => {
    const selected = categories.find((c) => c.id === id);
    if (selected) {
      navigation.navigate('ProductsByCategory', {
        categoryId: selected.id,
        categoryName: selected.name
      });
    }
  };

  const handleAddToCart = async () => {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) {
      Alert.alert('Please log in');
      return;
    }

    const userId = JSON.parse(logged).id;

    for (let i = 0; i < quantity; i++) {
      await addToCart(userId, product.id);
    }

    Alert.alert('Product added to cart!');
  };

  return (
    <ScrollView style={styles.container}>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('HomeScreen')}>
        <Ionicons name="arrow-back" size={22} color="#8B4513" />
      </TouchableOpacity>

      {/* IMAGE */}
      <View style={styles.cardImage}>
        <Image source={imagesMap[product.img]} style={styles.image} />
      </View>

      {/* NAME + PRICE */}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price.toLocaleString()} VND</Text>

      {/* QUANTITY */}
      <View style={styles.quantityWrapper}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
        >
          <Text style={styles.qtyTxt}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyNumber}>{quantity}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQuantity(prev => prev + 1)}
        >
          <Text style={styles.qtyTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ADD TO CART BUTTON */}
      <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
        <Text style={styles.addBtnTxt}>Add to Cart</Text>
      </TouchableOpacity>

      {/* CATEGORY */}
      <Text style={styles.category}>See Other Categories:</Text>
      <CategorySelector
        categories={categories}
        selectedId={product.categoryId}
        onSelect={handleSelectCategory}
      />
    </ScrollView>
  );
};

export default ProductDetailScreen;

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5E2CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  cardImage: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '70%',
    height: 230,
    borderRadius: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 15
  },
  productPrice: {
    fontSize: 18,
    color: '#FF6B6B',
    marginTop: 5
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  qtyBtn: {
    width: 35,
    height: 35,
    backgroundColor: '#F5E2CE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  qtyTxt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513'
  },
  qtyNumber: {
    marginHorizontal: 15,
    fontSize: 18
  },
  addBtn: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 10,
    marginTop: 15
  },
  addBtnTxt: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  category: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10
  }
});
