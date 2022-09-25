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
import { firebase_db } from "../firebaseConfig";
import Card from "../components/Card";
import data from "../data.json";
import { SafeAreaView } from "react-native-safe-area-context";
let participants = data.info.participants;

export default function MainPage({ navigation }) {
  const userId = Application.androidId;

  useEffect(() => {
    navigation.setOptions({
      title: "롤하니 : 친구들의 전적을 모아",
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "red",
      },
    });
  });

  return (
    <SafeAreaView style={styles.containerSafe}>
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
        <View style={styles.myPageGroup}>
          <TouchableOpacity style = {styles.myButton} onPress={()=>{navigation.navigate("SearchPage")}}>
            <Text style={styles.myPageButtonText}> 써치 </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
      
          {participants.map((content, i) => {
            return <Card content={content} key={i} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

  },
  containerSafe: {
    backgroundColor: "white",
    flex: 1,
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
    fontWeight: "bold",
  },
  cardContainer: {
    margin: 20,
  },
});
