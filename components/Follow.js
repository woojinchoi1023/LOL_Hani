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


export default function Follow({ content, ID, followNames, setFollowNames }) {

  const delFollow = ()=>{
    firebase_db.ref("users/" + ID + "/" + content).remove();
    let result = followNames.filter((data,i)=>{
        return data !== content
    })
    setFollowNames(result)
    alert('삭제 완료')

    
  }

  return(  
    <View style={styles.container}>
        <Text>{content}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={()=>{delFollow()}}>
            <Text>삭제</Text>
        </TouchableOpacity>
    </View>
    
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        flexDirection:'row',
        alignItems:'center'

    },
    deleteButton:{
        marginHorizontal:30,
        borderWidth:1,
        borderRadius:8,
        padding:4
        
    }

})