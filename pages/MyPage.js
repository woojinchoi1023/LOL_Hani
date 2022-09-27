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

export default function MyPage() {

  let  userId = Application.androidId;

  let  riotApiKey = 'RGAPI-84377366-3592-4394-8ca7-180286a8bb65';

  const [apiData, setApiData] = useState([]);

  let sohwan = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +'맛우진' +'?api_key=' + riotApiKey
  // let kimchi = axios.get(sohwan).then((response) => {
  //   // console.log(response.data);
  //   // setApiData([response.data]);
  // });
  
  console.log(apiData)

  useEffect(
    ()=>{
      axios.get(sohwan).then((response) => {
        setApiData(response.data)
      })
      console.log(apiData)

    }
  ,[])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>누물보?</Text>
      
      <View style={styles.cardContainer}>
        <Text> this is my page</Text>
        <Text> {apiData.name} </Text>
        <Text> {apiData.puuid} </Text>
        <Text> {apiData.summonerLevel} </Text>
        <Text> {apiData.revisionDate} </Text>


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
