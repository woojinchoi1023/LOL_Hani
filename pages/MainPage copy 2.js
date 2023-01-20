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
  const [existNames, setExistNames] = useState([]);

  

  // let riotApiKey = "RGAPI-1f583055-b3bc-4c17-8919-6551e2f14a25";
  let riotApiKey;
  firebase_db
    .ref("API")
    .once("value")
    .then((snapshot) => {
      riotApiKey = snapshot.val();
      // console.log(riotApiKey)
      console.log("api키 불러오기 완료");
    });

  const clearAll = () => {
    firebase_db.ref().remove();
  };

  const loadMatchCode = (puuid, k) => {
    axios
      .get(
        "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
          puuid +
          "/ids" +
          "?api_key=" +
          riotApiKey +
          "&start=0&count=3"
      )
      .then((response) => {
        let loadData = Object.values(response.data);

        loadData.map((content) => {
          firebase_db
            .ref()
            .child("userData")
            .child(userId)
            .child(content)
            .set(k);
        });
      });
  };

  const getFav = () => {
    setPageReady(false); //버튼 텍스트용

    firebase_db.ref("userData/" + userId).remove(); // 초기화

    // console.log(new Date())
    // let now = new Date()
    // firebase_db.ref("data/").child(userId).child("time").set(now.toString())
    // firebase_db.ref("data/").child(userId).child("test").set({
    //   time :now.toString(),
    //   id : userId})

    fav_id.map((content, i) => {
      loadMatchCode(content, fav_list[i]);
    });

    if (fav_list && fav_list.length > 0) {
      console.log("매치코드 추가 끝");
    } else {
      console.log("불러오기실패");
    }
  };

  let getMatchDataUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/";
  const AboutMatch = (matchId) => {
    axios
      .get(getMatchDataUrl + matchId + "?api_key=" + riotApiKey)
      .then((response) => {
        let data = response.data;
        firebase_db
          .ref()
          .child("userMatchData")
          .child(userId)
          .child(matchId)
          .set(data);
      });
  };

  const MatchDataLoading = () => {
    console.log("matchdataloading");

    firebase_db
      .ref("userData/" + userId)
      .once("value")
      .then((snapshot) => {
        let matchList = Object.keys(snapshot.val());
        matchList.map((matchCode) => {
          firebase_db.ref().child("userMatchData").child(userId).set(null);
          AboutMatch(matchCode);
        });
      });
  };

  const dataReady = () => {
    console.log("dataReady");
    firebase_db
      .ref("/userMatchData/" + userId)
      .once("value")
      .then((snapshot) => {
        let temp = snapshot.val();
        setTotalData(Object.values(temp).reverse());
        // console.log(Object.values(temp).reverse())
        console.log("데이터준비완료 !!!!");
        alert("전적을 불러왔습니다");
      });
    setPageReady(true);
  };

  const operateAll = async () => {
    await getFollowList();
    await operateLoadMatchCode2().then((res) => {
      console.log("fin");
    });
    makeTotalData().then((res)=>{alert("검색 완료")})
  };

  // step1
  const getFollowList = async () => {
    let alreadyName;

    await firebase_db
      .ref("data/")
      .once("value")
      .then((snapshot) => {
        // setExistNames(Object.keys(snapshot.val()))
        alreadyName = Object.keys(snapshot.val());
        console.log("what we have in database = ", alreadyName);
      });

    checkFollowList(alreadyName);

    //  console.log("check your following list ")

    //  fav_list.map( (favName,i)=>{
    //   if (alreadyName.includes(favName)) {console.log(favName, "= exist")} else {
    //   console.log(favName, "= not exist")
    //   firebase_db.ref("data/").child(favName).set(0)}
    // })

    // fav_id.map( (val,i)=>{
    //   loadMatchCode2(fav_id[i],fav_list[i])
    // })
  };

  const checkFollowList = (alreadyName) => {
    console.log("check your following list ");

    fav_list.map((favName, i) => {
      if (alreadyName.includes(favName)) {
        console.log(favName, "= exist");
      } else {
        console.log(favName, "= not exist");
        firebase_db.ref("data/").child(favName).set(0);
      }
    });
  };

  const operateLoadMatchCode2 = async () => {
    // fav_id.map( (val,i)=>{
    //   loadMatchCode2(fav_id[i],fav_list[i])
    // })

    for (const name of fav_list) {
      await loadMatchCode2(fav_id[fav_list.indexOf(name)], name);
    }
    console.log("operLoadMatch Done");
  };

  // step2 puuid => matchcodes
  const loadMatchCode2 = async (puuid, nickname) => {
    let matchCodes = "null";
    await axios
      .get(
        "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
          puuid +
          "/ids" +
          "?api_key=" +
          riotApiKey +
          "&start=0&count=3"
      )
      .then((response) => {
        matchCodes = Object.values(response.data);
        console.log("recent Match of ", nickname, " is = ", matchCodes);
      });

    let existMatch;
    await firebase_db
      .ref("data/" + nickname)
      .once("value")
      .then((snapshot) => {
        existMatch = Object.keys(snapshot.val());
        console.log("exist Match of ", nickname, " Match Code = ", existMatch);
      });

    matchCodes.map((matchID) => {
      console.log("whether ", matchID, " exist or not");
      if (existMatch.includes(matchID)) {
        console.log("exist match. pass");
      } else {
        getMatchData(matchID, nickname);
        console.log("not exist. match code added");
      }
    });
  };

  const getMatchData = async (matchID, nickname) => {
    console.log("getMatchData func init");
    let data;
    await axios
      .get(getMatchDataUrl + matchID + "?api_key=" + riotApiKey)
      .then((response) => {
        data = response.data;
        // console.log("data=",data)

        firebase_db
          .ref("data/" + nickname)
          .child(matchID)
          .set(data);
      });
  };

  // final step = make totalData.
  const makeTotalData = async () => {
    console.log("this is final stage-------------------");
    let tempTotalData = [];
    for (const name of fav_list) {
      await firebase_db
        .ref("data/" + name)
        .once("value")
        .then((snapshot) => {
          let temp = snapshot.val();
          let tempVals = Object.values(temp)
          // console.log("len = ", Object.values(temp).length);
          // tempTotalData.map((data)=>{
          //   if (data.info.gameCreation== tempVals.info.gameCreation) {console.log("exist founded")}
          // })
          // console.log('tempvals= ', tempVals[0].info.gameCreation)
          tempTotalData.push(tempVals)
          
          
          // for (const match of tempVals) {
          //   if(tempTotalData.includes(match)) {console.log("exist")}
          //   else{
          //     tempTotalData.push(match)
          //   }
          // }


          // console.log("total len = ", tempTotalData.length);
          console.log("name=", name);
        });
    }

    // fav_list.map((name)=>{
    //   firebase_db.ref("data/"+name).once("value").then( (snapshot)=>{
    //     let temp = snapshot.val();
    //     console.log(temp)
    // })

    // setTotalData(tempTotalData)
    // console.log(Object.values(tempTotalData))
    console.log("Number of matches = ",tempTotalData.length);
    // let result = tempTotalData.filter((v,i)=>
    // tempTotalData.findIndex(x=> {x.gameCreation==v.gameCreation})==i);
    // console.log("filtered num of matches = ", result.length)
    
    let realTemp = [];
    for (const personData of tempTotalData) {
      personData.map((data) => {
        realTemp.push(data);
        // console.log(data.info.gameCreation)
      });
    }


    // sort by time
    realTemp.sort(function (a, b) {
      return b.info.gameCreation - a.info.gameCreation;
    });
    const result = realTemp.filter((v, i) => 
    realTemp.findIndex(x => x.info.gameCreation == v.info.gameCreation) == i);

    // setTotalData(realTemp);
    setTotalData(result);
    // result.map((data)=>{
    //   console.log("gamecreation = ",data.info.gameCreation)
    // })
    console.log("done");
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
        if (!(fav === null)) {
          setfav_list(Object.keys(fav));
          setfav_id(Object.values(fav));
          console.log("초기값 불러왔음");
        } else {
          console.log("초기값 불러올거 없음");
        }
        setPageReady(true);
      });
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.containerSafe}>
      <ScrollView style={styles.container}>
        {/* <View
          style={{
            marginHorizontal: 30,
            borderRadius: 20,
            padding: 10,
            backgroundColor: "lightgray",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "red" }}>사용법</Text>
          <Text>1. 팔로우를 눌러 유저 검색 및 팔로우</Text>
          <Text>2. 전적검색</Text>
        </View> */}
        <View style={{ alignItems: "center", marginVertical: 10, backgroundColor:"lightgray", marginHorizontal: 30, borderRadius: 20, padding: 5 }}>
          <Text>내 팔로우 목록: </Text>
          <View style={{ marginVertical: 5, flexDirection: "row" }}>
            {fav_list.map((content, i) => {
              return <Text style={{fontWeight:'bold'}} key={i}>{content} </Text>;
            })}
            {fav_list.length === 0 ? (
              <Text style={{fontWeight:'bold'}}>
                팔로우 목록이 비었습니다. 아래 팔로우 버튼을 눌러 추가하세요.
              </Text>
            ) : null}
          </View>
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
              if (fav_list.length > 0) {
                operateAll();
                
              } else {
                alert("오류!");
              }
            }}
          >
            {pageReady ? (
              <Text style={styles.myPageButtonText}>전적검색</Text>
            ) : (
              <Text style={styles.myPageButtonText}>로딩중</Text>
            )}
            {/* <Text style={styles.myPageButtonText}>전적검색</Text> */}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.myButton} onPress={()=>{
             operateAll()

          }}>
            <Text>TEST</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {/* <Text>내 팔로우 목록: </Text>
          <View style={{ marginVertical: 5, flexDirection: "row" }}>
            {fav_list.map((content, i) => {
              return <Text key={i}>{content} </Text>;
            })}
            {fav_list.length === 0 ? (
              <Text>
                팔로우 목록이 비었습니다. 위 팔로우 버튼을 눌러 추가하세요.
              </Text>
            ) : null}
          </View> */}

          
          <View>
            <BannerAd
            // test
              // unitId={"ca-app-pub-3940256099942544/6300978111"}
              // my
              unitId={"ca-app-pub-7815580729420007/1742302091"}
              size={BannerAdSize.LARGE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          
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
