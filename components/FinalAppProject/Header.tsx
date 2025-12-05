import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Keyboard, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { HomeStackParamList } from './User/HomeStackScreen';

type HeaderNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface HeaderProps {
  onSearchSubmit: (query: string) => void;
  onFilterPress?: () => void;
  cartCount?: number; 
  onCartUpdate?: Dispatch<SetStateAction<number>>;
}

const Header = ({ onSearchSubmit, onFilterPress, cartCount = 0, onCartUpdate }: HeaderProps) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openCart = () => {
    navigation.navigate('CartScreen', { 
      onCartUpdate: onCartUpdate ? onCartUpdate : () => {} 
    });
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const userData = loggedInUser ? JSON.parse(loggedInUser) : null;
        setUser(userData ? { ...userData, username: userData.username || 'Guest' } : null);
      };
      loadUser();
    }, [])
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      onSearchSubmit(searchQuery);
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.waveBackground} />

      <View style={styles.topRow}>
        <View style={styles.userInfoWrapper}>
          <Image source={require('@/assets/images/Avatar.jpg')} style={styles.avatar} />
          <Text style={styles.greetingText}>Hello, {user?.username || 'Guest'}!</Text>
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={openCart}>
            <AntDesign name="shopping-cart" size={20} color="#fff" />
            {cartCount  > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount }</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#8b705d"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
          <Feather name="search" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: 'transparent',
      paddingBottom: 15
    },
    waveBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 150,
      backgroundColor: '#fcebcd',
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      zIndex: 1,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      position: 'relative',
      zIndex: 10,
    },
    userInfoWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 22.5,
      marginRight: 10,
      backgroundColor: '#8B4513',
      borderWidth: 2,
      borderColor: '#8B4513',
    },
    greetingText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#8B4513',
    },
    iconWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      marginLeft: 15,
      padding: 5,
      backgroundColor: '#8B4513',
      borderRadius: 15,
      position: 'relative',
    },
    searchContainer: {
      flexDirection: 'row',
      marginHorizontal: 15,
      marginTop: 15, 
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      zIndex: 1, 
    },
    searchInput: {
      flex: 1,
      color: '#8B4513',
      height: 40,
      paddingHorizontal: 5,
    },
    searchButton: {
      padding: 5,
      backgroundColor: '#8B4513',
      borderRadius: 8,
      marginLeft: 5,
    },
    cartBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#ABE0F0',
      width: 18,
      height: 18,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },


  });

  export default Header;
