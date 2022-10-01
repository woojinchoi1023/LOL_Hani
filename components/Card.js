import React from 'react';
import {View, Image, Text, StyleSheet,TouchableOpacity} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Card({content,navigation}) {
    let teamWin = content.win
    let teamStyle
    if (teamWin ) {teamStyle=styles.card} else {teamStyle=styles.card2}
    let DamageTakenPercent = content.challenges.damageTakenOnTeamPercentage.toFixed(2)
    let DamageDealtPercent = content.challenges.teamDamagePercentage.toFixed(2)
    let myLane = content.individualPosition === 'UTILITY' ? myLane = 'SUPPORT' : myLane = content.individualPosition
    let cs = content.neutralMinionsKilled + content.totalMinionsKilled
    let playtime =parseInt( content.timePlayed / 60 )
    let csPerMin = (cs / playtime).toFixed(1)
    let carry
    let criteria = parseFloat(DamageTakenPercent) + parseFloat(DamageDealtPercent)
    if (criteria > 0.5) {carry = '캐리'} else if (criteria > 0.3) {carry = '1인분'} else if (criteria > 0.2) {carry ='버스'} else {carry ='트롤'}
    return(
            <View style={teamStyle}>
        
              <Text style={styles.cardTitle2}>{myLane} - {content.championName}</Text>
              <View style={styles.desc}>
                <Text style={styles.cardTitle}>{content.summonerName} => </Text>
                <Text style={{fontSize:20, color:'red', fontWeight:'bold'}}>{carry}</Text>
              </View>
              
              <View style={styles.desc}>
                <Text style={styles.cardA}> LV.</Text>
                <Text style={{color:'black',fontWeight:'bold',fontSize:15}}>{content.champLevel}</Text>
                <Text style={styles.cardA}> KDA</Text>
                <Text style={styles.cardK} > {content.kills} /</Text>
                <Text style={styles.cardD}> {content.deaths} </Text>
                <Text style={styles.cardA}>/ {content.assists} </Text>
                <Text style={styles.cardA}> CS</Text>
                <Text style={{ color: 'black',fontWeight:'bold',fontSize:15}}> {cs}</Text>
                <Text style={styles.cardA}> ({csPerMin}/분)</Text>
              </View>
              <View style={styles.desc}>
                <Text style={styles.cardA}>딜량 : {content.totalDamageDealtToChampions}</Text>
                <Text style={styles.cardA}>  피해량 : {content.totalDamageTaken}</Text>
              </View>
              
            </View>

        
    )
}

const styles = StyleSheet.create({

    card:{
        flex:1,
        //컨텐츠들을 가로로 나열
        //세로로 나열은 column <- 디폴트 값임 
        flexDirection:"column",
        margin:5,
        borderBottomWidth:0.5,
        borderBottomColor:"#eee",
        paddingBottom:10,
        backgroundColor:'skyblue',
        borderRadius:20,
        padding:10,

    
      },

      card2:{
        flex:1,
        //컨텐츠들을 가로로 나열
        //세로로 나열은 column <- 디폴트 값임 
        flexDirection:"column",
        margin:5,
        borderBottomWidth:0.5,
        borderBottomColor:"#eee",
        paddingBottom:10,
        backgroundColor:'pink',
        borderRadius:20,
        padding:10,
    
      },
      

      cardTitle: {
        fontSize:20,
        fontWeight:"700"
      },

      cardTitle2: {
        fontSize:15,
        fontWeight:"700",
        color:'gray'
      },

      cardK : {
        fontSize: 15
      },

      cardD : {
        fontSize: 15,
        color:'red'
      },

      cardA : {
        fontSize: 15
      },
      
      desc :{
        flexDirection:'row'
      }

})