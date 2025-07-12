import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type Transaction = {
  _id: string;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

type RouteParams = {
  TransactionDetails: {
    transaction: Transaction;
  };
};

const TransactionDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'TransactionDetails'>>();
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Receiver:</Text>
        <Text>{transaction.receiver}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Amount:</Text>
        <Text>₹{transaction.amount.toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Method:</Text>
        <Text>{transaction.method}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Status:</Text>
        <Text>{transaction.status}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Date:</Text>
        <Text>{new Date(transaction.createdAt).toLocaleString()}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Transaction ID:</Text>
        <Text>{transaction._id}</Text>
      </View>
    </View>
  );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  detailBox: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
