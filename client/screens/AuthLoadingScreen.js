import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image } from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this.checkAuth();
  }

  checkAuth = async () => {
    const userToken = await AsyncStorage.getItem('TOKEN');
    setTimeout(() => {
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    }, 2000)    
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/logo.jpeg')}
        />
        <ActivityIndicator size="large" color="purple"/>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: 300
  }
});
