import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Application from "expo-application";

export default function MainPage({ navigation }) {
  const userId = Application.androidId;

  useEffect(() => {
    navigation.setOptions({
      title: "누물보?",
      headerTitleStyle:{
        fontSize:25,
        fontWeight:'bold',
        color:'red'
      }
    });
  });

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>누물보?</Text> */}
      <View style={styles.myPageGroup}>
        <Text style={styles.text1}> Hi, {userId}</Text>
        <TouchableOpacity
          style={styles.myButton}
          onPress={() => {
            navigation.navigate("MyPage");
          }}
        >
          <Text style={styles.myPageButtonText}>MyPage</Text>
        </TouchableOpacity>
      </View>
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
    color: "red",
  },
  myPageGroup: {
    flexDirection: "row",
    margin: 10,
  },
  myButton: {
    backgroundColor: "pink",
    borderWidth: 3,
    width: 100,
    marginLeft: 50,
    borderRadius: 15,
    borderColor: `#9370db`,
  
  },
  myPageButtonText: {
    fontSize: 20,
    color: "black",
    alignSelf: "center",
    padding: 10,
  },
  text1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: 'bold'
  },
  cardContainer: {
    margin: 20,
  },
});
