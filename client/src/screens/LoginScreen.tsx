import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { saveToken, getToken } from "../utils/storage";
import { API_BASE_URL } from "@/constants/constant";

// Define route types (optional but recommended for type safety)
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });


      await saveToken("token", res.data.token);

      Alert.alert("Success", "Login successful!");

      // Use simple navigation for Web (reset can break in browser)
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (err: any) {
      Alert.alert(
        "Login failed",
        err?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
