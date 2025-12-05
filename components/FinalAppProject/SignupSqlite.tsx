import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { addUser } from '@/database/CakeDatabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './RootNavigator';

type AuthStackNavProp = NativeStackNavigationProp<AuthStackParamList>;

const SignupSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('user');
  const navigation = useNavigation<AuthStackNavProp>();
  // Error
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all the fields!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password confirmation does not match!', [
        {
          text: 'OK',
          onPress: () => {
            setConfirmPassword('');         
            confirmPasswordRef.current?.focus(); 
          }
        }
      ]);
      return;
    }


    try {
      const success = await addUser(username, password, role);
      if (success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', 'Username already exists!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Signup failed!');
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
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholderTextColor="#A67C52"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#A67C52"
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm your password"
          ref={confirmPasswordRef}
          secureTextEntry
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholderTextColor="#A67C52"
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Already have an account? Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create an Account</Text>
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
    justifyContent: 'center'
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
  },

  label: {
    color: '#8B4513',
    marginTop: 10,
  },

  input: {
    width: '100%',
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
    width: 200,
    marginTop: 20,
  },

  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },

  switchText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6200ea',
  },
});

export default SignupSqlite;
