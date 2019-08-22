import React from 'react';
import { Text, View, Alert, KeyboardAvoidingView, TextInput, StyleSheet, AsyncStorage, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Ip } from '../consts/Connection';

class Register extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    gender: 0,
    age: 0,
    loading: false
  }

  handleGender = (index) => {
    this.setState(prevState => ({ ...prevState, gender: index }));
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  signUp = async () => {
    this.setState({loading: true});
    try {
      let response = await fetch(`${Ip}/register`, {
        method: "POST",
        body: JSON.stringify(this.state),
        headers:{
          'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      this.notifications(data); 
    } catch (err) {
      Alert.alert('Error' ,'No hay conexion al servidor, intenta en un momento');
      this.setState({loading: false});
    }
  }

  notifications = async (data) => {
    if(data.token){
      await AsyncStorage.setItem('USER', this.state.name);
      await AsyncStorage.setItem('TOKEN', data.token);
      this.props.navigation.navigate('App');
    } else if(data.error.email){
      Alert.alert('Error' ,`Ingresa un email valido`);
      this.setState({loading: false});
    } else if(data.error.name){
      Alert.alert('Error' ,`Solo se permiten Letras en el campo de Nombre`);
      this.setState({loading: false});
    }  else if (data.error.age) {
      Alert.alert('Error' ,'Esta app es solo para mayores de edad');
      this.setState({loading: false});
    } else if (data.error.password){
      Alert.alert('Error' ,`Todos los campos son obligatorios`);
      this.setState({loading: false});
    } else {
      Alert.alert('Error' ,data.error);
      this.setState({loading: false});
    }     
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.header}>Ingresa tu informacion</Text>
            {this.state.loading ? 
              <View style={{marginBottom: 20}}>
                <ActivityIndicator size="large" color="purple"/>
                <StatusBar barStyle="default" />
              </View> : null}
            <TextInput
              style={styles.input}
              placeholder='Nombre'
              autoCapitalize="words"
              returnKeyType='done'
              onChangeText={val => this.onChangeText('name', val)}
            />     
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              placeholder='Edad'
              returnKeyType='done'
              onChangeText={val => this.onChangeText('age', val)}
            />
            <SegmentedControlTab
              tabTextStyle={{ color: 'black'}}
              values={['Hombre', 'Mujer']}
              selectedIndex={this.state.gender}
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              onTabPress={this.handleGender}
            />  
            <TextInput
              style={styles.input}
              placeholder='Email'
              keyboardType='email-address'
              returnKeyType='done'
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('email', val)}
            />          
            <TextInput
              style={styles.input}
              placeholder='Password'
              secureTextEntry={true}
              autoCapitalize="none"
              returnKeyType='done'
              onChangeText={val => this.onChangeText('password', val)}
            />          
            <TouchableOpacity style={styles.btn} onPress={this.signUp}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Registrarse</Text>
            </TouchableOpacity>    
            <View style={{ flex : 1 }} />        
          </View>           
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 30,
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    alignSelf: 'stretch',
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    borderColor: 'purple',
    borderWidth: 4
  },
  btn: {
    alignSelf: 'stretch',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderRadius: 14
  },  
  tabStyle: {
    alignSelf: 'stretch',
    height: 50,
    marginBottom: 10,
    borderColor: 'purple',
    borderWidth: 4,
    backgroundColor: 'white',
    color: 'purple'
  },
  activeTabStyle: {
    backgroundColor: 'purple'
  }
})


export default Register