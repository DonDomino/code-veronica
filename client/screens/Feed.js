import React from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, AsyncStorage, Image, Dimensions, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { Ip } from '../consts/Connection';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

class Home extends React.Component { 
  constructor(){
    super();
    this._isMounted = false;
    this.state = {
      users : [],
      loading: true
    }
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  async componentDidMount(){  
    this._isMounted = true;
    const token = await AsyncStorage.getItem('TOKEN');
    let response = await fetch(`${Ip}/matches`, {
      headers: {
        "Authorization": token
      }
    });
    let data = await response.json();
    this.setState({users : data, loading: false});
  }

  async componentDidUpdate(){
    const token = await AsyncStorage.getItem('TOKEN');
    let response = await fetch(`${Ip}/matches`, {
      headers: {
        "Authorization": token
      }
    });
    let data = await response.json();
    if(this._isMounted){
      this.setState({users : data, loading: false});
    }    
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  deleteMatch = async (id) => {
    this.setState({loading: true})
    try {
      let response = await fetch(`${Ip}/matches`, {
        method: "POST",
        body: JSON.stringify({id}),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': await AsyncStorage.getItem('TOKEN') 
        }
      });
      let data = await response.json();
      Alert.alert('Ok', data);
      this.setState({loading: false})
    } catch (err) {
      console.log(err);
    }
  }

  confirmDelete(id){
    Alert.alert(
      'Cuidado!',
      `Quieres eliminar el match?!`,[
        {text: 'Si!', onPress: () => this.deleteMatch(id)},
        {text: 'Cancelar'}
      ]
    );
    
  }

  goChat(){
    Alert.alert('Coming soon!', 'Funcionalidad en desarrollo')
  }

  render() {
    return (      
      <View style={styles.container}>
        <Text style={styles.header}>Tus Matches</Text>
        <ScrollView>
          {this.state.loading ? 
          <View style={{marginBottom: 20}}>
            <ActivityIndicator size="large" color="purple"/>
            <StatusBar barStyle="default" />
          </View> : null}
          {this.state.users[0] === undefined ? <Text style={{fontWeight:'700', fontSize:18, color:'gray', textAlign: 'center'}}>No Tienes Matches Aun</Text> : null}          
          {this.state.users.map((item, index) =>
            <View key={index} style={styles.match}>
              <Image source={{ uri: item.image }} style={{ width: 125, height: 125, borderRadius: 60, borderColor: 'white', borderWidth: 5 }}></Image>   
              <View style={{flex: 1, flexWrap: 'wrap'}}>  
                <View style={{flexDirection: 'row', marginLeft: 20}}>   
                  <Text>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>{item.name} </Text>   
                    <Text style={{color: 'white', fontSize: 20}}>{item.age}</Text>
                  </Text>
                </View>                   
                <Text style={{color: 'white', fontSize: 15, marginLeft: 20}}>{item.description}</Text>   
                <View style={styles.btn}> 
                  <TouchableOpacity style={styles.btnChat} onPress={this.goChat}>
                    <FontAwesomeIcon icon="comments" size={25} color='white' />
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.btnDelete} onPress={() => this.confirmDelete(item._id)}>
                    <FontAwesomeIcon icon="trash-alt" size={25} color='white' />
                  </TouchableOpacity> 
                </View>
              </View>       
            </View>           
          )}      
        </ScrollView>          
      </View>       
    );
  }  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold'
  },
  match: {
    backgroundColor: 'purple',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 10,
    width: Dimensions.get('window').width - 10,
    marginBottom: 10,
    position: 'relative'
  },
  btn: {
    marginTop: 10,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 1
  },
  btnDelete: {    
    padding: 5,
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 100
  },
  btnChat: {
    padding: 5,
    backgroundColor: 'skyblue',
    borderRadius: 100
  }
})

export default Home