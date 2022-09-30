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
  const [pageReady, setPageReady] = useState(true);
  const isFocused = useIsFocused();

  let riotApiKey = "RGAPI-1de6a553-746c-49bc-ab40-546c6d6ed8a9";

 






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

    firebase_db
   .ref("users/" + userId)
   .once("value")
   .then((snapshot) => {
   let fav = snapshot.val();
   if (fav===null) {
    console.log('getfav 오류')
   } else {
    setTimeout(()=>
      setfav_list(Object.keys(fav)),100)
    setfav_id(Object.values(fav))
    
  }
  
   })

   
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
      title: "롤추적기 : 자기야 어제 게임했어?",
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "red",
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
   
  })
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.containerSafe}>
      <ScrollView style={styles.container}>
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
            {pageReady? <Text style={styles.myPageButtonText} >전적검색</Text> : <Text style={styles.myPageButtonText} >검색중</Text> } 
            {/* <Text style={styles.myPageButtonText}>전적검색</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>


          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.LARGE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
          <TouchableOpacity onPress={()=>{clearAll()}}>
            <Text> clear all </Text>
          </TouchableOpacity>
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
