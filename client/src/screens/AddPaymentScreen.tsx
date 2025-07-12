import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@/constants/constant';

const AddPaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [method, setMethod] = useState('upi');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!amount || !receiver) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken('token');
      await axios.post(
        `${API_BASE_URL}/payments`,
        {
          amount: parseFloat(amount),
          receiver,
          method,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Payment added!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Payment</Text>

      <TextInput
        placeholder="Amount (e.g. 1200)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Receiver name"
        value={receiver}
        onChangeText={setReceiver}
        style={styles.input}
      />

      <Text style={styles.label}>Method:</Text>
      <Picker
        selectedValue={method}
        onValueChange={(itemValue) => setMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="UPI" value="upi" />
        <Picker.Item label="Card" value="card" />
        <Picker.Item label="Net Banking" value="netbanking" />
      </Picker>

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Success" value="success" />
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="Failed" value="failed" />
      </Picker>

      <Button
        title={loading ? 'Submitting...' : 'Submit Payment'}
        onPress={handleAdd}
        disabled={loading}
      />
    </View>
  );
};

export default AddPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    marginBottom: 16,
  },
});
