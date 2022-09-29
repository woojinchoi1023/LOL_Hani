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

export default function SearchPage({route}) {
  // const userId = Application.androidId;
  const userId = route.params.ID
  const [valv, setValue] = useState([]);
  const [myFav, setMyFav] = useState([]);
  const [ready, setReady] = useState(false);
  const [searchReady, setSearchReady] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [bigData, setBigData] = useState([]);

  let riotApiKey = "RGAPI-171b6255-e638-491b-83ce-393807180bad";

  const [apiData, setApiData] = useState([]);

  const [fav_list, setfav_list] = useState([]);
  const [fav_id, setfav_id] = useState([]);

  let sohwan =
    "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    valv +
    "?api_key=" +
    riotApiKey;
  let matchID =
    "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
    apiData.puuid +
    "/ids" +
    "?api_key=" +
    riotApiKey +
    "&start=0&count=3";

  const getData = async () => {
    setSearchReady(false);
    axios.get(sohwan).catch(error => {alert('없는 소환사명입니다')}).then((response) => {
      setApiData(response.data);
    });

    // await axios.get(matchID).then((response) => {
    //   // console.log(response)
    //   setMatchData(response.data);
    //   console.log(valv + ' 매치데이터 가져오기 완료')
      
    // });
    setSearchReady(true);
    alert('검색 완료')
  };

  const loadFav = () => {
        firebase_db.ref("users/" + userId).once("value").then((snapshot) => {
        let fav = snapshot.val();
        setfav_list(Object.keys(fav));
        setfav_id(Object.values(fav));
        // console.log(fav_list)
        // console.log('new')
        // console.log(fav_id)

        if (fav_list && fav_list.length > 0) {
          
          setReady(true)

        } else {console.log('팔로우 목록이 비었습니다')}
        
      });
  }


  const addFav = () => {
    if (fav_list.length>4) {alert('최대 5명까지 팔로우 할 수 있습니다.')} else {
    firebase_db.ref("users/" + userId + "/" + valv).set(apiData.puuid);
    
    alert('팔로우 성공')
    setPageLoading(false)
  }

  };
  

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

    

         firebase_db.ref("userData/"+userId).remove() // 초기화

         firebase_db
        .ref("users/" + userId)
        .once("value")
        .then((snapshot) => {
        let fav = snapshot.val();
        setfav_list(Object.keys(fav))
        setfav_id(Object.values(fav))
        })

        
        fav_id.map((content,i)=>{
          loadMatchCode(content,fav_list[i])
          
        })
        
        if (fav_list && fav_list.length > 0) {
          setMyFav(fav_list);
          setReady(true);
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
    firebase_db.ref("userData/" + userId).once("value").then((snapshot) => {
      let matchList = Object.keys(snapshot.val())
      matchList.map((matchCode)=> {
        firebase_db.ref().child("userMatchData").child(userId).set(null)
        AboutMatch(matchCode)
      })
    })
  }

  useEffect( () => {
    firebase_db.ref("users/" + userId).once("value").then((snapshot) =>  {
      let fav =  snapshot.val()
      setBigData(fav)
    }).then(console.log(bigData))
    setPageLoading(true)
    // console.log(bigData)

  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.desc}> 닉네임을 적어주세요 (공백없이) </Text>
        <TextInput style={styles.input} onChangeText={(text) => setValue(text)}>
        </TextInput>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            getData();
            
          }}
        >
          {searchReady ? <Text>검색!</Text>: <Text>로딩중</Text>}
        </TouchableOpacity>
        <View style={{marginBottom:10}}>
          <Text style={styles.result}> {valv} 님의 정보입니다 : </Text>
          <Text style={{ fontSize: 30, color: "red", fontWeight: "bold" }}>
            {" "}
            레벨: {apiData.summonerLevel}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            addFav();
          }}
        >
          <Text>팔로우하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            getFav();
          }}
        >
          <Text>팔로우 목록 보기</Text>
        </TouchableOpacity>
        {ready ? (
          fav_list.map((content, i) => {
            return (
              <Follow content={content} key={i}/>
            );
          })
        ) : (
          <Text>찜 목록이 비었습니다</Text>
        )}
      <TouchableOpacity style={styles.searchButton} onPress={()=>{MatchDataLoading()}}>
          <Text> 실행 </Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    marginTop:5
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    color: "black",
    fontWeight: "bold",
  },
});
