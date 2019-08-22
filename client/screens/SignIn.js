import React from 'react';
import { Text, View, Button, Alert, KeyboardAvoidingView, StyleSheet, TextInput, AsyncStorage, ActivityIndicator, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ip } from '../consts/Connection';

class Login extends React.Component {
  constructor(props){
    super(props);
  }

  state = {      
    email: '',
    password: '',
    disableButton: false,
    error: [],
    loading: false
  }
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  signIn = async () => {
    this.setState({loading: true});
    try {
      let response = await fetch(`${Ip}/login`, {
        method: "POST",
        body: JSON.stringify(this.state),
        headers:{
          'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      this.login(data);     
    } catch (err) {
      Alert.alert('Error', 'No hay conexion al servidor, intenta en un momento');
      this.setState({loading: false});
    }
  }

  login = async (data) => {
    if(data.token){
      await AsyncStorage.setItem('USER', data.user.name);
      await AsyncStorage.setItem('TOKEN', data.token);
      this.props.navigation.navigate('App');
      if(data.user.image){
        await AsyncStorage.setItem('IMAGE', data.user.image);
      }
      if(data.user.description){
        await AsyncStorage.setItem('DESCRIPTION', data.user.description);
      } 
    } else {
      this.setState({error: data});
      Alert.alert('Error', this.state.error.error);
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
              placeholder='Email'
              autoCapitalize="none"
              keyboardType='email-address'
              returnKeyType='done'
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
            <TouchableOpacity disabled={this.state.disableButton} style={[styles.btn, this.state.disableButton ? styles.btnDisabled : styles.btn]} onPress={this.signIn}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>        
            <Text style={{marginBottom: 10}}>No tienes cuenta?</Text>
            <Button
              color='purple'
              title="Registrate!"
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}
            /> 
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    fontWeight: 'bold'
  },
  input: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 14,
    borderColor: 'purple',
    borderWidth: 4
  },
  btn: {
    alignSelf: 'stretch',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderRadius: 14
  },
  btnDisabled: {
    opacity: 0.3
  }
})

export default Login