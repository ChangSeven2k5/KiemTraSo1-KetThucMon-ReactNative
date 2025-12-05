import { Category, fetchProducts, Product, fetchCategories, addToCart, fetchCartItems } from '@/database/CakeDatabase'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { HomeStackParamList } from './HomeStackScreen'
import Header from '../Header'
import AsyncStorage from '@react-native-async-storage/async-storage'

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const productImagesMap: Record<string, any> = {
  'Vanilla_Pudding.jpg': require('@/assets/images/products/Vanilla_Pudding.jpg'),
  'Gourmet_Red_Velvet_Cupcake.jpg': require('@/assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
  'Cherry_Flan_Pudding.jpg': require('@/assets/images/products/Cherry_Flan_Pudding.jpg'),
  'Salted_Caramel_Macarons.jpg': require('@/assets/images/products/Salted_Caramel_Macarons.jpg'),
};

const categoryImageMap: Record<string, any> = {
  'Pudding': require('@/assets/images/categories/Pudding.jpg'),
  'Cup Cake': require('@/assets/images/categories/CupCake.jpg'),  // CupCake.jpg
  'Macaron': require('@/assets/images/categories/Macarons.jpg'),  // sửa lại đúng tên
  'Donuts': require('@/assets/images/categories/Donuts.jpg'),
};
const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const loadData = async () => {
      setProducts(await fetchProducts());
      setCategories(await fetchCategories());

      const cartItems = await fetchCartItems();
      setCartCount(cartItems.length);
    };
    loadData();
  }, []);


  /* ============HANDLERS============= */
  const handleAddToCart = async (product: Product) => {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) {
      Alert.alert('Please log in');
      return;
    }
    const userId = JSON.parse(logged).id;
    await addToCart(userId, product.id);

    // Lấy cart count từ database
    const cartItems = await fetchCartItems();
    setCartCount(cartItems.length);

    Alert.alert('Product added to cart!');
  };

  const handleCategoryPress = (categoryId: number) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name || '';
    navigation.navigate('ProductsByCategory', { categoryId, categoryName });
  };

  const handleSearchSubmit = (query: string) => {
    const category = categories.find(
      c => c.name.toLowerCase() === query.trim().toLowerCase()
    );

    if (category)
      navigation.navigate('ProductsByCategory', { categoryId: category.id, categoryName: category.name });
    else
      navigation.navigate('ProductsByCategory', { categoryId: 0, categoryName: query });
  };

  /* =====RENDER FUNCTIONS====== */
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item.id)}>
      <Image
        source={categoryImageMap[item.name]}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
    <Image source={productImagesMap[item.img]} style={styles.image} />
    <Text style={styles.productName}>{item.name}</Text>
    <Text style={styles.productPrice}>{item.price} VND</Text>

    <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
      <Text style={styles.addBtnTxt}>Add to Cart</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);


  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <Header
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        onCartUpdate={setCartCount}
      />
      <ScrollView style={styles.container}>
        

        {/* Categories */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Text style={styles.bestSellerTitle}>🔥 Product Best Seller</Text>

        {/* PRODUCT LIST */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          scrollEnabled={false}
        />

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 SevenCake</Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categorySection: {
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 20
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
    marginTop: 10
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 60 / 2,       
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  bestSellerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    marginBottom: 10
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  productPrice: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center'
  },
  addBtn: {
    backgroundColor: '#8B4513',
    padding: 5,
    borderRadius: 8,
    marginTop: 5,
    width: '80%'
  },
  addBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12
  },

  footer: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fcebcd'
  },
  footerText: {
    fontSize: 14,
    color:'#8B4513'
  }
});
