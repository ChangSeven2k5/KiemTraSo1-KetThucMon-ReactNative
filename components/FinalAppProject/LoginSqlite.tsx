import { getUserByCredentials, getUserByUsername } from '@/database/CakeDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { AuthStackParamList } from './RootNavigator';

type HomeScreenProps = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<HomeScreenProps>();

  // Error
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);


  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter all required fields!');
      return;
    }

    try {
      const userExists = await getUserByUsername(username); 
      const user = await getUserByCredentials(username, password);

      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));

        Alert.alert('Success', `Welcome, ${user.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              if (user.role === 'admin') navigation.navigate('Admin');
              else navigation.navigate('Main');
            },
          },
        ]);
        return;
      }

      // ❌ Username không tồn tại
      if (!userExists) {
        Alert.alert('Error', 'Username does not exist!', [
          {
            text: 'OK',
            onPress: () => {
              setUsername('');
              usernameRef.current?.focus();
            }
          }
        ]);
        return;
      }

      // ❌ Username đúng nhưng Password sai
      Alert.alert('Error', 'Wrong password!', [
        {
          text: 'OK',
          onPress: () => {
            setPassword('');
            passwordRef.current?.focus();
          }
        }
      ]);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Login failed!');
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/welcome.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          ref={usernameRef}
          placeholder="Enter your username"
          placeholderTextColor="#A67C52"
          onChangeText={setUsername}
          value={username}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          ref={passwordRef}
          placeholder="Enter your password"
          placeholderTextColor="#A67C52"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.switchText}>Don&apos;t have an account? Create a new account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center' 
  },

  logo: {
    width: '100%',
    height: 250,
  },

  form: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fcebcd',
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    elevation: 6,
    justifyContent: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
  },

  label: {
    color: '#8B4513',
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    color: '#8B4513',
  },

  button: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    width: 150,
    marginTop: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  switchText: {
    marginTop: 12,
    color: '#6200ea',
    textAlign: 'center',
  },
});

export default LoginSqlite;
