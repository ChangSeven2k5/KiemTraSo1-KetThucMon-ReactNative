import { Category, fetchCategories, fetchProducts, Product } from '@/database/CakeDatabase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Header from '../Header'; 
import CategorySelector from './CategorySelector';
import { HomeStackParamList } from './HomeStackScreen';

type RouteProps = RouteProp<HomeStackParamList, 'ProductsByCategory'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// Mapping ảnh
const imagesMap: Record<string, any> = {
  'Vanilla_Pudding.jpg': require('../../../assets/images/products/Vanilla_Pudding.jpg'),
  'Gourmet_Red_Velvet_Cupcake.jpg': require('../../../assets/images/products/Gourmet_Red_Velvet_Cupcake.jpg'),
  'Cherry_Flan_Pudding.jpg': require('../../../assets/images/products/Cherry_Flan_Pudding.jpg'),
  'Salted_Caramel_Macarons.jpg': require('../../../assets/images/products/Salted_Caramel_Macarons.jpg'),
};

export default function ProductsByCategoryScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { categoryId } = route.params || { categoryId: 1 };

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // lưu tất cả sản phẩm
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setAllProducts);
  }, []);

  // Cập nhật products khi selectedCategoryId hoặc allProducts thay đổi
  useEffect(() => {
    const filteredByCategory = allProducts.filter(p => p.categoryId === selectedCategoryId);
    setProducts(filteredByCategory);

    // Reset giá filter
    setMinPrice('');
    setMaxPrice('');
  }, [selectedCategoryId, allProducts]);

  // Khi người dùng bấm category
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };

  // Filter giá chỉ lọc trên category hiện tại
  const handleFilterPress = () => {
    let filtered = allProducts.filter(p => p.categoryId === selectedCategoryId);

    const min = minPrice.trim() === '' ? null : Number(minPrice.replace(/,/g, ''));
    const max = maxPrice.trim() === '' ? null : Number(maxPrice.replace(/,/g, ''));

    if (min !== null) filtered = filtered.filter(p => Number(p.price.replace(/,/g, '')) >= min);
    if (max !== null) filtered = filtered.filter(p => Number(p.price.replace(/,/g, '')) <= max);

    setProducts(filtered);
  };


  return (
    <View style={{ flex: 1 }}>
      <Header onSearchSubmit={() => {}} onFilterPress={handleFilterPress} />

      {/* Category Selector */}
      <View style={styles.category}>
        <CategorySelector
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />
      </View>

      {/* Price Filter */}
      <View style={styles.filterContainer}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TextInput
            placeholder="Min price"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
            style={[styles.input, { marginRight: 5 }]}
          />
          <TextInput
            placeholder="Max price"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
            style={[styles.input, { marginLeft: 5 }]}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={imagesMap[item.img]} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{Number(item.price.replace(/,/g, '')).toLocaleString()} VND</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  category: { 
    marginTop: 20,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: { 
    fontSize: 16, 
    marginTop: 5, 
    fontWeight: '600' 
  },
  price: { 
    color: '#d9534f', 
    marginTop: 3 
  },
});
