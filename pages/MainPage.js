import React, { useState, useEffect, Component } from "react";
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
import Match from "../components/Match";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';


// import data from "../data.json";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

// let participants = data.info.participants;

export default function MainPage({ navigation, route }) {
  const userId = Application.androidId;
  const [totalData, setTotalData] = useState([]);
  
  const [fav_list, setfav_list] = useState([]);
  const [fav_id, setfav_id] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const isFocused = useIsFocused();

  // let riotApiKey = "RGAPI-1f583055-b3bc-4c17-8919-6551e2f14a25";
  let riotApiKey
  firebase_db.ref("API").once("value").then((snapshot)=>{
    riotApiKey = snapshot.val()
    // console.log(riotApiKey)
    console.log('api키 불러오기 완료')
  })
 
  const clearAll = () => {
    firebase_db.ref().remove()
  }

  const loadMatchCode = (puuid,k) => {
    axios.get("https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" +
    "?api_key=" +
    riotApiKey +
    "&start=0&count=3" ).then((response) => {
      let loadData = Object.values(response.data)

      loadData.map((content)=>{
        firebase_db.ref().child("userData").child(userId).child(content).set(k)
      })

    })
  }

  const getFav = () => {
    setPageReady(false); //버튼 텍스트용

    firebase_db.ref("userData/"+userId).remove() // 초기화

  //   firebase_db
  //  .ref("users/" + userId)
  //  .once("value")
  //  .then((snapshot) => {
  //  let fav = snapshot.val();
  //  if (fav===null) {
  //   console.log('getfav 오류')
  //  } else {
  //   setTimeout(()=>
  //     setfav_list(Object.keys(fav)),100)
  //   setfav_id(Object.values(fav))
  // }
  //  })

   
   fav_id.map((content,i)=>{
     loadMatchCode(content,fav_list[i])
     
   })
   
   if (fav_list && fav_list.length > 0) {
     console.log('매치코드 추가 끝');
   } else {
     console.log("불러오기실패");
   }
  };


  let getMatchDataUrl = 'https://asia.api.riotgames.com/lol/match/v5/matches/'
  const AboutMatch = (matchId) => {
    axios.get(getMatchDataUrl+matchId+"?api_key=" + riotApiKey).then((response)=>{
      let data = response.data
      firebase_db.ref().child("userMatchData").child(userId).child(matchId).set(data)
    });
  };

  const MatchDataLoading = () => {
    console.log('matchdataloading')

    firebase_db.ref("userData/" + userId).once("value").then((snapshot) => {
      let matchList = Object.keys(snapshot.val())
      matchList.map((matchCode)=> {
        firebase_db.ref().child("userMatchData").child(userId).set(null)
        AboutMatch(matchCode)
      })
    })
  };

  const dataReady = () => {
    console.log('dataReady')
    firebase_db
      .ref("/userMatchData/" + userId)
      .once("value")
      .then((snapshot) => {
        let temp = snapshot.val();
        setTotalData(Object.values(temp).reverse());

        console.log("데이터준비완료 !!!!");
        alert('전적을 불러왔습니다')

      });
      setPageReady(true);

  };


  useEffect(() => {
    navigation.setOptions({
      title: "롤하니 : 친구들 전적 모아보기",
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
      },
    });

    firebase_db
   .ref("users/" + userId)
   .once("value")
   .then((snapshot) => {
   let fav = snapshot.val();
   if (!(fav===null)) {
    setfav_list(Object.keys(fav))
    setfav_id(Object.values(fav))
    console.log('초기값 불러왔음')
    
   } else {console.log('초기값 불러올거 없음')}
   setPageReady(true)

  })

  
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.containerSafe}>
      <ScrollView style={styles.container}>
        <View style={{marginHorizontal: 30, borderWidth:1, borderRadius:20, padding:10,backgroundColor:'lightgray'}}>
          <Text style={{fontWeight:'bold', color:'red'}}>사용법</Text>
          <Text>1. 팔로우를 눌러 유저 검색 및 팔로우</Text>
          <Text>2. 전적검색</Text>
        </View>
        {/* <Text style={styles.title}>누물보?</Text> */}
        <View style={styles.myPageGroup}>
          {/* <TouchableOpacity
            style={styles.myButton}
            onPress={() => {
              navigation.navigate("MyPage");
            }}
          >
            <Text style={styles.myPageButtonText}>MyPage</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => {
              navigation.navigate("FollowPage",{ID: userId, riotApiKey: riotApiKey});
            }}
          >
            <Text style={styles.myPageButtonText}>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => {
              if (fav_list.length > 0) {
                setTimeout(()=>getFav(),500 );
                setTimeout(()=>MatchDataLoading(),1000);
                setTimeout(()=>dataReady(),1500);} else {
                  alert('오류!')
                }
              
            }}
          >
            {pageReady? <Text style={styles.myPageButtonText} >전적검색</Text> : <Text style={styles.myPageButtonText} >로딩중</Text> } 
            {/* <Text style={styles.myPageButtonText}>전적검색</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text>내 팔로우 목록: </Text>
        <View style={{marginVertical:5, flexDirection:'row'}}>
          
          {fav_list.map((content,i)=>{
            
            return <Text key={i}>{content} </Text>}
              
            )}
          {fav_list.length===0 ?  <Text>팔로우 목록이 비었습니다. 위 팔로우 버튼을 눌러 추가하세요.</Text> : null}
        </View>
        
{/* ca-app-pub-7815580729420007/1742302091 */}
          <BannerAd
            unitId={'ca-app-pub-3940256099942544/6300978111'}
            size={BannerAdSize.LARGE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
          {/* <TouchableOpacity onPress={()=>{clearAll()}}>
            <Text> clear all </Text>
          </TouchableOpacity> */}
  
        </View>

        <View style={styles.cardContainer}>
          
          {totalData.map((content, i) => {
            return <Match content={content} key={i} navigation={navigation} />;
          })}
        </View>

        {/* <View style={styles.cardContainer}>
          {participants.map((content, i) => {
            return <Card content={content} key={i} />;
          })}
        </View> */}
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
