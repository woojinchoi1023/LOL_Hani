// last update : 2023.01.21 Sat.

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
import { useIsFocused } from "@react-navigation/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

export default function MainPage({ navigation, route }) {
  const userId = Application.androidId;
  const isFocused = useIsFocused();
  const [matchDataUpdateAble, setMatchDataUpdateAble] = useState(true); //전적검색 연타 방지
  const [followList, setFollowList] = useState([]);
  const [mathcData, setMatchData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [apiKey, setApiKey] = useState('');
  
  const getMatchDataUrl =
    "https://asia.api.riotgames.com/lol/match/v5/matches/";
  let riotApiKey;
  let gatheredData = []; //여러명의 데이터를 합친 것
  let sortedData = []; //중복 제거와 정렬을 마친 최종 데이터

  function initialLoad() {
    console.log("initial Load");
    setMatchDataUpdateAble(true);
  }

  function updateFollowList(userId) {
    console.log("update follow list");
    firebase_db.ref('/newUsers').child(userId).get().then((snapshot) => {
      console.log('follow list result.val() :>> ', snapshot.val());
      setFollowList(snapshot.val());
    }).catch((err) => {
      console.log('follow list update err :>> ', err);
    });
  }

  function getApiKey() {
    return new Promise((resolve, reject) => {
      firebase_db
        .ref("API")
        .once("value")
        .then((snapshot) => {
          riotApiKey = snapshot.val();
          setApiKey(snapshot.val());
          console.log("1. api키 불러오기 완료");
          console.log('riotApiKey :>> ', riotApiKey);
          resolve(snapshot.val());
        });
    });
  }

  async function getData(followArr) {
    console.log("0. getData");
    const nowTime = new Date();

    riotApiKey = await getApiKey();

    for (const arr of followArr) {
      const puuid = arr[0];
      const nickname = arr[1];
      let newMatchList;
      let data;
      let dataToArray = []; //obj 인 데이터를 arr로 바꿈

      console.log("nickname :>> ", nickname);

      firebase_db
        .ref("/newDB")
        .child(puuid)
        .child("lastUpdate")
        .set(nowTime.toString()); //업뎃기록
      let newMatchListJSON = await axios.get(
        "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
          puuid +
          "/ids" +
          "?api_key=" +
          riotApiKey +
          "&start=0&count=5"
      )
      newMatchList = newMatchListJSON.data;
      console.log("2. newMatchList :>> ", newMatchList);
      let preUserMatchJSON = await firebase_db
        .ref("/newDB")
        .child(puuid)
        .child("match")
        .get();
      data = preUserMatchJSON.val(); //원래있던데이터
      if (data) {
        dataToArray = Object.entries(data); //[[key,val],[matchId,matchData]]
      }
      for (const matchId of newMatchList) { //새로운 매치 업로드
        if (dataToArray.flat().includes(matchId)) {
          //이미 있으면
          console.log("매치 정보가 이미 있습니다");
          continue;
        } else {
          //없으면
          console.log('새로운 매치 정보');
          axios
            .get(getMatchDataUrl + matchId + "?api_key=" + riotApiKey)
            .then((res) => {
              dataToArray.push([matchId, res.data]); //추가
              firebase_db
                .ref("/newDB")
                .child(puuid)
                .child("match")
                .child(matchId)
                .set(res.data); //업로드
            });
        }
      }
      dataToArray.forEach((arr, i) => {
        gatheredData.push(arr);
      });
    }
    
    
    //합치기
    console.log("4. data collected!");
    sortByTime();
  }

  function sortByTime() {
    console.log("5. sort by time");
    gatheredData.sort(function(a, b) {
      return b[1].info.gameCreation - a[1].info.gameCreation;
    })
    sortedData = gatheredData.filter((v, i) => 
    gatheredData.findIndex(x => x[1].info.gameCreation == v[1].info.gameCreation) == i);
    setFinalData(sortedData);
  }
  

  async function showMatchList() {
    console.log("showMatchList!");
    if (!followList) {
      alert("팔로우 목록이 비었습니다. 팔로우 버튼을 눌러 추가하세요.");
      setMatchDataUpdateAble(true);
      return;
    }

    await getData(followList);

    setTimeout(() => {
      setMatchDataUpdateAble(true);
      console.log("change able to true");
    }, 3000);

    return;
  }

  useEffect(() => {//볼때마다
    updateFollowList(userId); //내 팔로우 목록 업데이트
  }, [isFocused]);

  useEffect(() => { //한번만
    navigation.setOptions({
      title: "롤하니 : 친구들 전적 모아보기",
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
      },
    });
    initialLoad(); //옛날에 본 화면 그대로 띄워주기
    getApiKey();
  }, []);

  return (
    <SafeAreaView style={styles.containerSafe}>
      <ScrollView style={styles.container}>
        <View
          style={{
            alignItems: "center",
            marginVertical: 10,
            backgroundColor: "lightgray",
            marginHorizontal: 30,
            borderRadius: 20,
            padding: 5,
          }}
        >
          <Text>내 팔로우 목록: </Text>
          <View style={{ marginVertical: 5, flexDirection: "row" }}>
            {followList ? (
              followList.map((content, i) => {
                return (
                  <Text style={{ fontWeight: "bold" }} key={i}>
                    {content[1]}{" "}
                  </Text>
                );
              })
            ) : (
              <Text style={{ fontWeight: "bold" }}>
                팔로우 목록이 비었습니다. 아래 팔로우 버튼을 눌러 추가하세요.
              </Text>
            )}
          </View>
        </View>
        <View style={styles.myPageGroup}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => {
              navigation.navigate("FollowPage", {
                ID: userId,
                riotApiKey: apiKey,
              });
            }}
          >
            <Text style={styles.myPageButtonText}>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => {
              if (!matchDataUpdateAble) return;
              setMatchDataUpdateAble(false);
              showMatchList();
            }}
          >
            {matchDataUpdateAble ? (
              <Text style={styles.myPageButtonText}>전적검색</Text>
            ) : (
              <Text style={styles.myPageButtonText}>로딩중...</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <View>
            <BannerAd
              unitId={"ca-app-pub-7815580729420007/1742302091"}
              size={BannerAdSize.LARGE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>
        <View style={styles.cardContainer}>
        {finalData.map((content, i) => {
            return <Match content={content[1]} followList = {followList} key={i} navigation={navigation} />;
          })}
        </View>
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
    backgroundColor: `#ffa07a`,
    borderWidth: 3,
    width: 100,
    marginLeft: 50,
    borderRadius: 15,
    borderColor: `#6495ed`,
  },
  followButton: {
    backgroundColor: `#ffa07a`,
    borderWidth: 3,
    width: 100,
    marginLeft: 50,
    borderRadius: 15,
    borderColor: `#6495ed`,
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
