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
  const [followList, setFollowList] = useState(['asd']);
  const [mathcData, setMatchData] = useState([]);
  
  const initialLoad = () => {
    console.log("initial Load");
  };

  const updateFollowList = (userId) => {
    console.log("update follow list");
  };
  
  const getAlreadyExistData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(console.log('1. getAlreadyExistData'));
        
      }, 1000);
    });
  }

  const searchRecentMatch = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(console.log('2. searchRecentMatch'));
      }, 0);
    });
  }
  
  const sortByTime = () => {
    console.log('4. sorting')
    return 1;
  }

  const showMatchList = async() => {
    console.log("showMatchList!");
    //팔로우목록 불러오기
    if(followList.length === 0) {
      alert('팔로우 목록이 비었습니다. 팔로우 버튼을 눌러 추가하세요.')
      setMatchDataUpdateAble(true);
      return;
    };
    await getAlreadyExistData();
    await searchRecentMatch(); //유저ID로 기존 데이터 갖고오기
    //최근 게임 검색하기. 신규 추가 게임기록이면 데이터베이스에 추가 & 업로드
    console.log('3.');
    let finalData = sortByTime();

    
    setTimeout(() => {
      setMatchDataUpdateAble(true);
      console.log('change to true');
    }, 3000);

    return finalData;
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
    initialLoad(); //전에 봤던 전적 화면을 저장했다가 보여주는 기능
    updateFollowList(userId); //내 팔로우 목록 업데이트
  }, [isFocused]);

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
            {followList.length ? (
              followList.map((content, i) => { //map 은 리턴이 있고 forEach는 리턴이 없음!
              return <Text style={{fontWeight:'bold'}} key={i}>{i + 1}. {content}  </Text>;
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
                riotApiKey: riotApiKey,
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
        <View style={styles.cardContainer}></View>
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
