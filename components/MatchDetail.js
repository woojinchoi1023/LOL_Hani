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

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";


export default function MatchDetail({ nick, data, playerNumber }) {

    let playerIndex = playerNumber[nick]
    let kill = data[playerIndex]['kills']
    let death = data[playerIndex]['deaths']
    let assist = data[playerIndex]['assists']
    let winResult = data[playerIndex]['win']
   
    

  return(  
    <View style={styles.container}>
      <View style={{flexDirection:'row'}} >
        <Text style={{fontsize:15}}> {nick} ::</Text>
        {winResult ? <Text style={{color:'red', fontWeight : 'bold'}}> 승리</Text>:<Text style={{color:'blue', fontWeight : 'bold'}}> 패배</Text>}
      </View>
        

        <View style={{flexDirection:'row'}}>
            {data[playerIndex]['individualPosition']==='UTILITY'? <Text style={{fontsize:15}}> SUPPORT /</Text> : <Text style={{fontsize:15}}> {data[playerIndex]['individualPosition']} /</Text> }
            <Text style={{fontsize:15}}> {data[playerIndex]['championName']} /</Text>
            <Text style={{fontsize:15}}> {kill} /</Text>
            <Text style={{fontsize:15, color:'red', fontWeight:'bold'}}> {death}</Text>
            <Text style={{fontsize:15}}> / {assist} </Text>
        </View>
        
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        marginTop: 10,
        borderRadius: 20,
        padding: 10

    },

})