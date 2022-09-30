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

    let date = new Date(content.info.gameEndTimestamp )
    let dM = (date.getMonth() + 1).toString()
    let dD = date.getDate().toString()
    let dH = date.getHours().toString()
    let dMin = date.getMinutes().toString()
    let dateString = dM + '월 ' + dD + '일 ' + dH + '시 ' + dMin + '분'

    

    const userId = Application.androidId;
    const [myFavList, setMyFavList] = useState([])

    let allPlayer = content.info.participants
    
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
    let playerNumber = {}
    allPlayer.map((playerIndex,i)=>{
        participantList.push(playerIndex.summonerName.toLowerCase())
        playerNumber[playerIndex.summonerName.toLowerCase()] = i
    })
    // console.log(participantList)
    // console.log(playerNumber)
    // console.log('end')
    let watch = []
    myFavList.map((fav) => {
        // console.log(fav)
        // console.log(participantList.includes(fav))
        if( participantList.includes(fav)) {
            watch.push(fav)
            // console.log(allPlayer[playerNumber[fav]]['win'])
            // setWinResult(allPlayer[playerNumber[fav]]['win'])
            
        }
                // console.log(watch)
        
    })


    //승패 여부 
    // let winResult = allPlayer[watch[0]]['win']
    // console.log(watch)
    // setWinResult(allPlayer[playerNumber[fav]]['win'])
    let winResult = 'true'
    // if (allPlayer[watch[0]]['win'] === 'true') {winResult = 'true'} else {winResult = 'false'}
    // winResult = allPlayer[watch[0]]['win']
    let backColor
    if (winResult==='true') {backColor = styles.container} else {backColor = styles.containerLose}
    

  return(  
    <View style={backColor}>
        <View style={{flexDirection:'row'}}>
            {watch.map((nickname,i)=>{
                return <Text style={{fontSize:20, fontWeight:'bold'}}key={i}>{nickname} </Text>
            })}
        </View>
        <Text>{dateString}</Text>
        <View>
            {watch.map((nickname,i) => {
                return <MatchDetail nick={nickname} data={allPlayer} playerNumber={playerNumber} key={i} />;
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
        backgroundColor:'silver',
        margin: 10,
        borderRadius: 20,
        padding: 20

    },
    containerLose:{
        backgroundColor:'pink',
        margin: 10,
        borderRadius: 20,
        padding: 20

    },

})