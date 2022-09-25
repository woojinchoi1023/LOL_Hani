import React from 'react';
import {View, Image, Text, StyleSheet,TouchableOpacity} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Card({content,navigation}) {
    let teamId = content.teamId
    let teamStyle
    if (teamId === 100 ) {teamStyle=styles.card} else {teamStyle=styles.card2}
    let roundTotalDamage = content.challenges.damageTakenOnTeamPercentage.toFixed(2)
    let giveDamage = content.challenges.teamDamagePercentage.toFixed(2)

    return(
            <View style={teamStyle}>
        
            <Text style={styles.cardTitle2}>{content.lane} - {content.championName}</Text>
            <Text style={styles.cardTitle}>{content.summonerName} </Text>
            <View style={styles.desc}>
              <Text style={styles.cardK} > {content.kills} /</Text>
              <Text style={styles.cardD}> {content.deaths} </Text>
              <Text style={styles.cardA}>/ {content.assists} </Text>
              <Text style={styles.cardA}> 딜 비율: {giveDamage}</Text>
              <Text style={{ color: 'red'}} numberOfLines={1}>  피해 비율: {roundTotalDamage }</Text>
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
        margin:10,
        borderBottomWidth:0.5,
        borderBottomColor:"#eee",
        paddingBottom:10,
        backgroundColor:'skyblue'
    
      },

      card2:{
        flex:1,
        //컨텐츠들을 가로로 나열
        //세로로 나열은 column <- 디폴트 값임 
        flexDirection:"column",
        margin:10,
        borderBottomWidth:0.5,
        borderBottomColor:"#eee",
        paddingBottom:10,
        backgroundColor:'pink'
    
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