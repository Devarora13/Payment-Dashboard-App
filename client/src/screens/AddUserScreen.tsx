import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '@/constants/constant';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { getUserRole } from '../utils/auth';
import Ionicons from '@expo/vector-icons/Ionicons';

const AddUserScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // 🔐 Restrict access to admin only
  useEffect(() => {
    const checkRole = async () => {
      const userRole = await getUserRole();
      if (userRole !== 'admin') {
        Alert.alert('Access Denied', 'Only admins can add users.');
        navigation.goBack();
      }
    };
    checkRole();
  }, []);

  const handleAddUser = async () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Username and Password are required.');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken('token');
      await axios.post(
        `${API_BASE_URL}/users`,
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Success', 'User added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add New User</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Select Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Viewer" value="viewer" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Create User" onPress={handleAddUser} />
      )}
    </View>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#007AFF',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
});
