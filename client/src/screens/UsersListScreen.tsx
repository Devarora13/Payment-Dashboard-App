import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@/constants/constant';
import { getUserRole } from '../utils/auth';

type User = {
  _id: string;
  username: string;
  role: string;
};

const UsersListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchUsers = async () => {
    try {
      const token = await getToken('token');
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.log('Failed to fetch users:', err);
      Alert.alert('Error', 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      const role = await getUserRole();
      if (role !== 'admin') {
        Alert.alert('Access Denied', 'You are not authorized to view this screen.');
        navigation.goBack();
        return;
      }
      fetchUsers();
    };

    checkAccessAndFetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.role}</Text>
          </View>
        )}
      />
      <Button title="Add User" onPress={() => navigation.navigate('AddUser')} />
    </View>
  );
};

export default UsersListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  username: { fontWeight: 'bold', fontSize: 16 },
});
