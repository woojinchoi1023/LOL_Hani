import React, { useState, useEffect, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import * as Application from "expo-application";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase_db } from "../firebaseConfig";
import Follow from "../components/Follow";

export default function FollowPage({ route }) {
  const userId = route.params.ID;
  const [nickname, setNickName] = useState("");
  const [bigData, setBigData] = useState([]);
  const [followNames, setFollowNames] = useState([]);
  const [followIds, setFollowIds] = useState([]);
  const [pageLoadReady, setPageLoadReady] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [tier, setTier] = useState("");
  const [rank, setRank] = useState("");
  const [tierData, setTierData] = useState([]);

  let riotApiKey = route.params.riotApiKey

  let accountInfo =
    "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    tempNickname +
    "?api_key=" +
    riotApiKey;
  let matchID =
    "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
    bigData.puuid +
    "/ids" +
    "?api_key=" +
    riotApiKey +
    "&start=0&count=3";

  const loadFollowList = () => {
    firebase_db
      .ref("users/" + userId)
      .once("value")
      .then((snapshot) => {
        let fav = snapshot.val();
        if (fav) {
          setFollowNames(Object.keys(fav));
          setFollowIds(Object.values(fav));
        } else {
          console.log("비었습니다");
        }
      });
  };

  const search = () => {
    axios
      .get(accountInfo)
      .catch((error) => {
        alert("없는 소환사명입니다");
      })
      .then((response) => {
        if (response) {
          setBigData(response.data);
          let idCode = response.data.id;
          setNickName(tempNickname);
          loadTier(idCode);
          alert("검색 완료");
        }
      });
  };

  const loadTier = async (idCode) => {
    let tierUrl =
      "https://kr.api.riotgames.com" +
      "/lol/league/v4/entries/by-summoner/" +
      idCode +
      "?api_key=" +
      riotApiKey;
    try {
      let userInfo = await axios.get(tierUrl);
      setTier(userInfo.data[0]["tier"]);
      setTierData(userInfo.data);
      console.log(tierUrl)
    } catch (err) {
      console.log("티어로딩 실패");
    }
  };

  const addFollow = () => {
    if (followNames.length > 4) {
      alert("최대 5명까지 팔로우 할 수 있습니다.");
    } else {
      firebase_db.ref("users/" + userId + "/" + nickname).set(bigData.puuid);
      alert("팔로우 성공");
    }

    loadFollowList();
  };

  useEffect(() => {
    loadFollowList();
    console.log("페이지 로딩 완료");
    setPageLoadReady(true);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.desc}> 닉네임을 적어주세요 (공백없이) </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTempNickname(text)}
        ></TextInput>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            search();
          }}
        >
          <Text>검색!</Text>
        </TouchableOpacity>
      </View>
        <View style={{marginVertical:10}}>
          <View>
            <Text style={styles.result}>{nickname} 님의 정보입니다 : </Text>
          </View>
        
        {/* <Text style={{ fontSize: 30, color: "red", fontWeight: "bold" }}>
          레벨: {bigData.summonerLevel}
        </Text> */}
        {tierData.map((content, i) => {
          if (content.queueType === "RANKED_FLEX_SR") {
            return (
              <Text
                key={i}
                style={{ fontSize: 20, color: "red", fontWeight: "bold" }}
              >
                팀랭: {content.tier} {content.rank} 승: {content.wins} 패:{" "}
                {content.losses}
              </Text>
            );
          } else if (content.queueType === "RANKED_SOLO_5x5"){
            return (
              <Text
                key={i}
                style={{ fontSize: 20, color: "red", fontWeight: "bold" }}
              >
                솔랭: {content.tier} {content.rank} 승: {content.wins} 패:{" "}
                {content.losses}
              </Text>
            );
          } else if(content.queueType === "RANKED_TFT_DOUBLE_UP"){
            return (
              <Text
                key={i}
                style={{ fontSize: 20, color: "red", fontWeight: "bold" }}
              >
                롤체: {content.tier} {content.rank} 승: {content.wins} 패:{" "}
                {content.losses}
              </Text>
            );
          } else {
            return (
              <Text
                key={i}
                style={{ fontSize: 20, color: "red", fontWeight: "bold" }}
              >
                {content.queueType}: {content.tier} {content.rank} 승: {content.wins} 패:{" "}
                {content.losses}
              </Text>
            );
          }
        })}
        
      
      </View>
      <View>
        <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              addFollow();
            }}
          >
        
            <Text>팔로우하기</Text>
          </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 30 }}>
        {followNames.map((content, i) => {
          return (
            <Follow
              content={content}
              key={i}
              ID={userId}
              followNames={followNames}
              setFollowNames={setFollowNames}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    margin: 20,
    borderRadius: 30,
    padding: 10,
  },

  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },
  desc: {
    fontSize: 20,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "white",
    borderWidth: 1,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 1,
  },
  result: {
    fontSize: 20,
    marginVertical:0,
    color: "black",
    fontWeight: "bold",
    
  },
});
