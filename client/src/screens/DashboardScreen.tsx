import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import { getToken } from "../utils/storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_BASE_URL } from "@/constants/constant";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await getToken("token");
      const res = await axios.get(`${API_BASE_URL}/payments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.log("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>Failed to load stats</Text>
      </View>
    );
  }

  const chartData = {
    labels: stats.last7Days.map((d: any) => d._id?.slice(5) || ""),
    datasets: [
      {
        data: stats.last7Days.map((d: any) =>
          typeof d.total === "number" ? d.total : 0
        ),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Payments Today:</Text>
        <Text style={styles.value}>{stats.totalToday}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue:</Text>
        <Text style={styles.value}>
          ₹{stats.totalRevenue.toLocaleString("en-IN")}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Failed Payments:</Text>
        <Text style={styles.value}>{stats.failedCount}</Text>
      </View>

      <Text style={[styles.label, { marginTop: 32 }]}>Last 7 Days Revenue</Text>
      <LineChart
        data={chartData}
        width={Math.min(screenWidth - 40, 360)}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f7f7f7",
          backgroundGradientTo: "#f7f7f7",
          decimalPlaces: 0,
          color: () => `#007bff`,
          labelColor: () => "#555",
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
});
