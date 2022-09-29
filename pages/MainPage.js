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
import Match from "../components/Match";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function MainPage({ navigation }) {
  const userId = Application.androidId;

  const [totalData, setTotalData] = useState([]);

  const timestampDate = (timestamp) => {
    let date = new Date(timestamp);
  };

  const clearAll = () => {
    firebase_db.ref().remove()
  }

  const dataReady = () => {
    firebase_db
      .ref("/userMatchData/" + userId)
      .once("value")
      .then((snapshot) => {
        let temp = snapshot.val();
        setTotalData(Object.values(temp).reverse());

        console.log("데이터준비완료 !!!!");
      });
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

    //   firebase_db.ref("usersData/" + userId).once("value").then((snapshot) => {
    //   let fav = snapshot.val();
    //   let fav_list = Object.keys(fav);
    //   let fav_id = Object.values(fav);
    // })
  }, []);

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
              navigation.navigate("SearchPage",{ID: userId});
            }}
          >
            <Text style={styles.myPageButtonText}>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myButton}
            onPress={() => {
              dataReady();
            }}
          >
            <Text style={styles.myPageButtonText}>검색</Text>
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
          <TouchableOpacity style={styles.myButton} onPress={()=>{navigation.navigate('FollowPage',{ID:userId})}}>
            <Text style={styles.myPageButtonText}>follow page</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          {/* {totalData.map((content,i) => {
            let date = new Date(content.info.gameEndTimestamp + 9 * 60 * 60 * 1000)
            let dM = (date.getMonth() + 1).toString()
            let dD = date.getDate().toString()
            let dH = date.getHours().toString()
            let dMin = date.getMinutes().toString()
            let dateString = dM + '월' + dD + '일 ' + dH + '시' + dMin + '분'
            

            return <Text key={i}>{dateString}</Text> 
                   })}*/}

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
