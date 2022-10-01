import React , { useState , useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Application from "expo-application";
import axios from "axios";
import Card from "../components/Card";

export default function MatchFull({navigation, route}) {
    let data = route.params
    // console.log(' ')
    // console.log(' ')
    // console.log(' ')
    // console.log('여기서부터 시작@@@@@@@@@@@@@@@@@@@@')
    // console.log(Object.values(data))
    // console.log(data.data[0].assists)
    let playerList = data.data
    let playTime = parseInt(playerList[0].timePlayed / 60)
  useEffect(
    ()=>{
    }
  ,[])

  return (
    <ScrollView style={styles.container}>
     <Text style={{alignSelf:'center'}}>파란색 => 승리, 빨간색 => 패배 </Text>
     <Text style={{alignSelf:'center', fontSize:25,fontWeight:'bold'}}>게임시간 : {playTime}분 </Text>
     {playerList.map((content,i)=>{
        return <Card content={content} key={i}/>
     })}
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding:5
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
