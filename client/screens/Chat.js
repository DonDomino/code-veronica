import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default class Chat extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{marginBottom: 20}}>Funcionalidad en desarrollo</Text>
        <FontAwesomeIcon icon="tools" size={100} color='black' />
      </View>
    );
  }  
}