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


export default function Follow({ content, ID, followNames, setFollowList, index  }) {

  const delFollow = ()=>{
    console.log('ID :>> ', ID);
    console.log('index :>> ', index);
    firebase_db.ref('/newUsers').child(ID).child(index).remove().then(() => {
      return firebase_db.ref('/newUsers').child(ID).get()
      
    }).catch((err) => {
      
    }).then((snapshot)=>{
      setFollowList(snapshot.val());
      alert('삭제 완료')
      
    });
    console.log('delete!', followNames);
  }

  return(  
    <View style={styles.container}>
        <Text>{followNames}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={delFollow}>
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