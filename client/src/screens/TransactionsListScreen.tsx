import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_BASE_URL } from '@/constants/constant';

type Transaction = {
  _id: string;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

const TransactionsListScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await getToken('token');
      const res = await axios.get(`${API_BASE_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.log('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}
      style={styles.card}
    >
      <Text style={styles.receiver}>{item.receiver}</Text>
      <Text>₹{item.amount.toLocaleString('en-IN')}</Text>
      <Text>{item.method.toUpperCase()} • {item.status}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default TransactionsListScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  receiver: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
