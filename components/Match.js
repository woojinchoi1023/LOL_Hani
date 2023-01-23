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
import { SafeAreaView } from "react-native-safe-area-context";
import MatchDetail from "./MatchDetail";


export default function Match({ content, followList, navigation }) {
  let date = new Date(content.info.gameEndTimestamp);
  let dM = (date.getMonth() + 1).toString();
  let dD = date.getDate().toString();
  let dH = date.getHours().toString();
  let dMin = date.getMinutes().toString();
  let dateString = dM + "월 " + dD + "일 " + dH + "시 " + dMin + "분";
  let gameType; //자랭?솔랭?
  let mainPlayer = []; //내가 팔로우 하는 사람 중 게임에서 등장하는 사람 [puuid, index]
  let win = true;
  let winStyle;
  
  followList.forEach((arr, i) => {
    if (content.metadata.participants.includes(arr[0])) {
      mainPlayer.push([arr[1], content.metadata.participants.indexOf(arr[0])]);
    }
  });
  
  win = content.info.participants[mainPlayer[0][1]].win;
  winStyle = win? styles.container : styles.containerLose
  switch (content.info.queueId) {
    case 420:
      gameType = '솔로랭크'
      break;
    case 440:
      gameType = '자유랭크'
      break;
    case 450:
      gameType = '칼바람'
      break;
    default:
      gameType = 'Unknown'
      break;
  };

  let allPlayer = content.info.participants;

  
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MatchFull", { data: allPlayer });
        
      }}
    >
      <View style={winStyle}>
        <View style={{ flexDirection: "row" }}>
          {mainPlayer.map((arr, i) => {
            return (
              <Text style={{ fontSize: 20, fontWeight: "bold" }} key={i}>
                {arr[0]}{" "}
              </Text>
            );
          })}
          <Text style={{fontSize:13, color: 'gray', alignSelf:'center'}}>자세히</Text>
        </View>
        <View style={{ flexDirection: "row" }}  >
          <Text>{dateString}, </Text>
          <Text style={{ fontSize: 13, textAlignVertical: "center" }}>{gameType}</Text>
        </View>
        <View>
          {mainPlayer.map((arr, i) => {
            return (
              <MatchDetail
                nick={arr[0]}
                data={allPlayer}
                playerNumber={arr[1]}
                key={i}
              />
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'skyblue',
    margin: 10,
    borderRadius: 20,
    padding: 20,
  },
  containerLose: {
    backgroundColor: "pink",
    margin: 10,
    borderRadius: 20,
    padding: 20,
  },
});
