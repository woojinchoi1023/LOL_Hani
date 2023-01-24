import React, { useState, useEffect,  } from "react";
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

export default function FollowPage({ navigation, route }) {
  const [nicknameInput, setNickNameInput] = useState("");
  const [followList, setFollowList] = useState([]);
  const [clickable, setClickable] = useState(true);
  const [tierData, setTierData] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const riotApiKey = route.params.riotApiKey
  const userId = route.params.ID;
  let userResponse;

  
  
  function loadFollowList() {
    firebase_db.ref('/newUsers').child(userId).get().then((snapshot) => {
      setFollowList(snapshot.val());
      console.log('팔로우 리스트 불러왔습니다');
    }).catch((err) => {
      console.log('팔로우 리스트 불러오기 오류');
    });
  }
  
  function search() {
    if (!clickable) return;
    setClickable(false);
    
    
    console.log('riotApiKey :>> ', riotApiKey);
    const infoUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    nicknameInput +
    "?api_key=" +
    riotApiKey;

    axios.get(infoUrl).then((result) => {
      setUserInfo(result.data);
      userResponse = result.data;
      searchTier(result.data.id);
      alert('검색 완료')
      console.log('result.data.name :>> ', result.data.name);
    }).catch((err) => {
      alert('없는 소환사명입니다')
      console.log(err);
    });

    setTimeout(() => {
      setClickable(true);
    }, 1000);
  }

  function searchTier(id) {
    const tierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
      id +
      "?api_key=" +
      riotApiKey;
    axios.get(tierUrl).then((result) => {
      setTierData(result.data);
    }).catch((err) => {
      alert('티어 조회 오류')
    });
  }

  function concatOrNot(a,b) { //a.concat(b)
    if (a) {
      return a.concat(b)
    } else {
      return b
    }
  }

  function addFollow() {
    if (!userInfo) return;
    console.log('addFollow!!');
    let tempInfo = [[userInfo.puuid, userInfo.name]];
    console.log('followList :>> ', followList);
    setFollowList(concatOrNot(followList, tempInfo));
    
    firebase_db.ref('/newUsers').child(userId).set(concatOrNot(followList, tempInfo)).then((result) => {
      console.log('add follow upload success');
    }).catch((err) => {
      console.log('fail');
    });
    let now = new Date()
    firebase_db.ref('/newUsers').child('lastUpdate').child(userId).set(now.toString())
  }


  useEffect(() => {
    loadFollowList();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.desc}> 닉네임을 적어주세요 (공백없이) </Text>
        <TextInput
          style={styles.input}
          onChangeText={setNickNameInput}
        ></TextInput>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={search}
        >
          {clickable? <Text>검색!</Text>: <Text>로딩중...</Text>}
        </TouchableOpacity>
      </View>
        <View style={{marginVertical:10}}>
          <View>
            <Text style={styles.result}>{userInfo.name} 님의 정보입니다 : </Text>
          </View>
            {tierData.map((content, i) => {
              return <Text key={i}>{content.tier} {content.rank}</Text> 
            })}
        
      </View>
      <View>
        <TouchableOpacity
            style={styles.searchButton}
            onPress={addFollow}
          >
            <Text>팔로우하기</Text>
          </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 30 }}>
        {followList? followList.map((arr, i) => {
          return (
            <Follow
              content={followList}
              key={i}
              ID={userId}
              followNames={arr[1]}
              setFollowList={setFollowList}
              index={i}
            />
          );
        }): null}
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
