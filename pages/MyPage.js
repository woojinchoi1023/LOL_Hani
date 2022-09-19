import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Application from "expo-application";

export default function MyPage() {
  const userId = Application.androidId;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>누물보?</Text>
      
      <View style={styles.cardContainer}>
        <Text> hi</Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 50,
    marginLeft: 20,
    color:'red'
  },
  cardContainer: {
    margin: 20
  }
});
