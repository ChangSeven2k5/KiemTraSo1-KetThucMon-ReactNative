import React, { useEffect, useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,Image,ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById, updateUser, User } from "@/database/CakeDatabase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./ProfileStackScreen";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "ProfileScreen"
>;

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const load = async () => {
    try {
      const logged = await AsyncStorage.getItem("loggedInUser");
      if (!logged) return;

      const id = JSON.parse(logged).id;
      const data = await getUserById(id);
      if (data) setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    if (!user.username.trim() || !user.password.trim()) {
      Alert.alert("Please fill in all fields!");
      return;
    }
    try {
      await updateUser(user);
      Alert.alert("Your profile has been updated!");
    } catch (error) {
      Alert.alert("Update failed! Try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* COVER */}
      <Image
        source={require("@/assets/images/Profile.jpg")}
        style={styles.cover}
      />

      {/* AVATAR */}
      <View style={styles.avatarCard}>
        <Image
          source={require("@/assets/images/Avatar.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.username || "User"}</Text>
      </View>

      {/* PROFILE INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>Account Information</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={user?.username || ""}
          onChangeText={(t) =>
            setUser((prev) => (prev ? { ...prev, username: t } : prev))
          }
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={user?.password || ""}
          secureTextEntry
          onChangeText={(t) =>
            setUser((prev) => (prev ? { ...prev, password: t } : prev))
          }
        />

        {/* VIEW ORDER HISTORY */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#B87333" }]}
          onPress={() => navigation.navigate("OrderHistoryScreen")}
        >
          <Text style={styles.btnTxt}>View Order History</Text>
        </TouchableOpacity>

        {/* SAVE CHANGES */}
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnTxt}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },

  cover: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  avatarCard: {
    position: "absolute",
    alignSelf: "center",
    top: 150,
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A2C2A",
  },

  infoCard: {
    marginTop: 60,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A2C2A",
    marginBottom: 10,
    alignSelf: "center",
  },

  label: {
    fontSize: 14,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CDAA7D",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    fontSize: 15,
    marginBottom: 5
  },

  btn: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  btnTxt: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
