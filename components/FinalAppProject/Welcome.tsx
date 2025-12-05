import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './RootNavigator';

type NavProps = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
const Welcome = () => {
  const navigation = useNavigation<NavProps>();
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.subtitle}>Sweetness in Every Bite!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} 
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  logo: {
    width: 250,
    height: 100,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A35C58',
    marginBottom: 30
  },

  button: {
    backgroundColor: '#A35C58',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
