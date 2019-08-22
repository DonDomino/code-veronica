import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, AsyncStorage, Dimensions, Alert } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Ip } from '../consts/Connection';

export default class Home extends Component {
  constructor(){
    super();
    this.state = {
      users : []
    }
  }

  async componentDidMount(){  
    const token = await AsyncStorage.getItem('TOKEN');
    let response = await fetch(`${Ip}/users`, {
      headers: {
        "Authorization": token
      }
    });
    let data = await response.json();
    this.setState({users : data});
  }

  like = async (id) => {
    try {
      let response = await fetch(`${Ip}/users`, {
        method: "POST",
        body: JSON.stringify({id}),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': await AsyncStorage.getItem('TOKEN') 
        }
      });
      let data = await response.json();
      this.match(data);
    } catch (err) {
      console.log(err)
    }    
  }

  match = async (data) => {
    if(data){
      Alert.alert(
        'Bien hecho',
        `Tienes un match!`,[
          {text: 'Ver mis matches!', onPress: () => this.props.navigation.navigate('Feed')},
          {text: 'Seguir mirando!'}
        ]
      );
      this.swiper.goBackFromRight();
      setTimeout(() => {
        this.swiper.swipeTop();
      }, 2000)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CardStack
          verticalSwipe={false}
          style={styles.content}
          renderNoMoreCards={() => <Text style={{fontWeight:'700', fontSize:18, color:'gray', textAlign: 'center'}}>No hay mas por el momento, vuelve mas tarde!</Text>}
          ref={swiper => {
            this.swiper = swiper
          }}          
        >
          {this.state.users.map((item, index) =>              
            <Card 
              key={index}
              style={styles.card} 
              onSwipedRight={() => this.like(item._id)}
              onSwipedLeft={() => console.log('Naa')}
            >
              <View>
                <ImageBackground source={{ uri: item.image }} style={{ width: '100%', height: 480 }} imageStyle={{ borderRadius: 20 }}>     
                  <View style={styles.dataContent}>
                    <Text>
                      <Text style={styles.title}> {item.name} </Text>  
                      <Text style={styles.age}>{item.age}</Text>
                    </Text>
                  </View>
                  <Text style={styles.desc} numberOfLines={1} ellipsizeMode='tail'>{item.description}</Text>   
                </ImageBackground>             
              </View>     
            </Card>            
          )}
        </CardStack>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button,styles.red]} onPress={()=>{
              this.swiper.swipeLeft();
            }}>
              <FontAwesomeIcon icon="times-circle" size={50} color='#fd267d' />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,styles.green]} onPress={()=>{
              this.swiper.swipeRight();
            }}>
              <FontAwesomeIcon icon="heart" size={50} color='#01df8a' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content:{
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    marginTop: 20,
    width: Dimensions.get('window').width*0.95,
    height: 480,
    backgroundColor: 'gray',
    borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
  },
  dataContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'absolute',
    bottom: 10,
    marginBottom: 10
  },
  title: {   
    fontSize: 55,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: 'white'
  },
  age: {
    color: 'white',
    fontSize: 30
  },
  desc: {
    color: 'white',
    position: 'absolute',
    bottom: 0,
    marginLeft: 13,
    marginBottom: 5,
    fontSize: 17
  },
  footer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer:{
    width:220,
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  button:{
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 0,
  },
  green:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#01df8a',
  },
  red:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#fd267d',
  }
});