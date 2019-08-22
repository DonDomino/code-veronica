import React from 'react';
import { Text, Alert, View, Button, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, StyleSheet, TextInput, AsyncStorage, Image, ActivityIndicator, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Ip } from '../consts/Connection';

class Profile extends React.Component { 
  constructor(props){
    super(props);
  }

  state = {      
    name: '',
    description: '',
    image: null,
    loading: false
  }

  async componentDidMount(){    
    this.getPermissionAsync();
    const token = await AsyncStorage.getItem('TOKEN');   
    const name = await AsyncStorage.getItem('USER');    
    const image = await AsyncStorage.getItem('IMAGE');
    const description = await AsyncStorage.getItem('DESCRIPTION'); 
    this.setState({ name, image, description })
    await fetch(`${Ip}/profile`, {
      headers: {
        "Authorization": token
      }
    });
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  getPermissionAsync = async () => {    
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert('Error', 'Lo sentimos, se necesitan los permisos para acceder a tus fotos');
    }    
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.uploadPhoto(result);
    }
  }

  uploadPhoto = async (result) => {
    let formData = new FormData();
    let localUri = result.uri;
    let filename = localUri.split('/').pop();

    formData.append('image', { uri: localUri, name: filename });
    try {
      await fetch(`${Ip}/profile`, {
        method: "POST",
        body: formData,
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization': await AsyncStorage.getItem('TOKEN') 
        }
      }); 
    } catch (err) {
      console.log(err);
    }
  }

  upDescription = async () => {
    this.setState({loading: true})
    try {
      let description = this.state.description;
      let response = await fetch(`${Ip}/profile`, {
        method: "POST",
        body: JSON.stringify({description}),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': await AsyncStorage.getItem('TOKEN') 
        }
      });
      let data = await response.json();
      Alert.alert('Ok', data.succes);
      this.setState({loading: false})
    } catch (err) {
      console.log(err);
    }
  }

  signOut = async () => {
    await AsyncStorage.clear();   
    this.props.navigation.navigate('Auth');    
  }

  render() {
    return (      
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={styles.picView}>
              <Text style={styles.header}>Hola {this.state.name}!</Text> 
              <Image source={{ uri: this.state.image }} style={styles.image} />
              <TouchableOpacity style={styles.btn} onPress={this.pickImage}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{this.state.image ? 'Edita tu foto' : 'Sube tu foto'}</Text>     
              </TouchableOpacity>   
            </View>
            {this.state.loading ? 
              <View style={{marginBottom: 20}}>
                <ActivityIndicator size="large" color="purple"/>
                <StatusBar barStyle="default" />
              </View> : null}
            <View style={styles.descriptionView}>              
              <TextInput style={styles.input} multiline={true} numberOfLines={4} onChangeText={val => this.onChangeText('description', val)}
                placeholder='Tu descripcion' placeholderTextColor='white' autocapitalize='sentences' value={this.state.description}
              />         
              <Button title='Editar perfil' color='purple' onPress={this.upDescription}/>                    
            </View>      
            <View>
              <TouchableOpacity style={styles.btnLogout} onPress={this.signOut}>
                <FontAwesomeIcon icon="sign-out-alt" size={50} color='white' />
              </TouchableOpacity> 
              <Text style={{color: 'red', textAlign: 'center'}}>Salir</Text>  
            </View>         
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
  btn: {
    alignSelf: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderRadius: 14
  },
  picView: {
    marginBottom: 30,
    marginTop: 30
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  image: {
    width: 200, 
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderColor: 'purple',
    borderWidth: 6
  },
  descriptionView: {
    marginBottom: 5,
    alignItems: "flex-end"
  },
  input: {
    alignSelf: 'stretch',
    height: 70,
    padding: 16,
    width: 300,
    borderColor: 'purple',
    borderWidth: 4,
    borderRadius: 7,
    backgroundColor: '#fff',
    fontSize: 16    
  },
  btnLogout: {
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 100
  }  
  
})

export default Profile