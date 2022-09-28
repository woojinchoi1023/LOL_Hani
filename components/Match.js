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


export default function Match({ content, navigation }) {

    let date = new Date(content.info.gameEndTimestamp + 9 * 60 * 60 * 1000)
    let dM = (date.getMonth() + 1).toString()
    let dD = date.getDate().toString()
    let dH = date.getHours().toString()
    let dMin = date.getMinutes().toString()
    let dateString = dM + '월' + dD + '일 ' + dH + '시' + dMin + '분'

    const userId = Application.androidId;
    const [myFavList, setMyFavList] = useState([])
    let allPlayer = content.info.participants
    let playerShow = []
    
    
    firebase_db.ref('/users/' + userId).once('value').then((snapshot)=>{
        let temp = snapshot.val()
        let temp2 = Object.keys(temp)
        let temp3 = []
        temp2.map((name)=>{
            temp3.push(name.toLowerCase().replace(/(\s*)/g,''))
        })
        setMyFavList(temp3)
        
    })

    // allPlayer.map((playerIndex)=>{
    //     if (playerIndex.summonerName.toLowerCase() in myFavList) {
    //         playerShow.push(playerIndex.summonerName)
    //     } else {}
    // })
    // myFavList.map((player)=>{
    //     if(player in content.info.participants)
    // })
    let participantList = []
    allPlayer.map((playerIndex)=>{
        participantList.push(playerIndex.summonerName.toLowerCase())
    })
    let watch = []
    myFavList.map((fav) => {
        // console.log(fav)
        // console.log(participantList.includes(fav))
        if( participantList.includes(fav)) {
            watch.push(fav)
        }
    })


  return(  
    <View style={styles.container}>
        <Text>{dateString}</Text>
        <View style={{flexDirection:'row'}}>
            <Text>겜한사람: </Text>
            {watch.map((nickname,i)=>{
                return <Text key={i}>{nickname} </Text>
            })}
        </View>
        {/* <Text>{watch}</Text> */}
        
        {/* <Text>{participantList}</Text> */}
        {/* <Text>{myFavList}</Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'skyblue',
        margin: 10,
        borderRadius: 20,
        padding: 20

    },

})