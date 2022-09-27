import React , { useState , useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as Application from "expo-application";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {

    const [valv, setValue] = useState([])

    
    let  riotApiKey = 'RGAPI-84377366-3592-4394-8ca7-180286a8bb65';

    const [apiData, setApiData] = useState([]);
    const [matchData, setMatchData] = useState([]);

    let sohwan = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +valv +'?api_key=' + riotApiKey

    const getData = () => {
        axios.get(sohwan).then((response) => {
            setApiData(response.data)
        })
    }

    let matchID = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/"+apiData.puuid+"/ids"+'?api_key=' + riotApiKey + '&start=0&count=20'
    const getMatchData = () => {
      axios.get(matchID).then((response)=> {
        console.log(response)
        setMatchData(response.data)
      })
    }


    useEffect(
    ()=>{

        
    }
  ,[])

  return (
    <SafeAreaView>
        <ScrollView style={styles.container}>
            <Text> 닉네임을 적어주세요 </Text>
            <TextInput onChangeText={text=>setValue(text)}> </TextInput>
            <TouchableOpacity onPress={()=>{getData()}}><Text>검색!</Text></TouchableOpacity>
            <Text> {valv} </Text>
            <Text> {apiData.puuid}</Text>
            <Text style={{fontSize:30, color:'red', fontWeight:'bold'}}> {apiData.summonerLevel}</Text>
            <TouchableOpacity onPress={()=>{getMatchData()}}><Text>매치검색!</Text></TouchableOpacity>
            <Text>{matchData}</Text>

            

        </ScrollView>
    </SafeAreaView>
      );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },


});
