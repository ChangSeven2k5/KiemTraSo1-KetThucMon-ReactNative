import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../RootNavigator';

type AdminNavigationType = NativeStackNavigationProp<AuthStackParamList>;

const HeaderAdmin = () => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const navigation = useNavigation<AdminNavigationType>();

  // Load user khi focus vào màn hình
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const userData = loggedInUser ? JSON.parse(loggedInUser) : null;
        setUser(userData ? { ...userData, username: userData.username || 'Admin' } : null);
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    setUser(null);
    navigation.navigate('Login'); // điều hướng về màn hình Login
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.waveBackground} />

      <View style={styles.topRow}>
        <View style={styles.userInfoWrapper}>
          <Image 
            source={require('@/assets/images/Admin.jpg')} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greetingText}>
              Hi, {user?.username || 'Admin'} ({user?.role || 'admin'})
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 15,
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fcebcd',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
  logoutButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderAdmin;
