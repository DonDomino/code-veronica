import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import Feed from "./screens/Feed";
import Chat from "./screens/Chat";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const AppStack = createBottomTabNavigator({  
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: () => (
        <FontAwesomeIcon icon="home" size={30} color='purple' />
      )
    }
  },
  Feed: {
    screen: Feed,
    navigationOptions: {
      tabBarLabel: "Feed",
      tabBarIcon: () => (
        <FontAwesomeIcon icon="heart" size={30} color='purple' />
      )
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      tabBarLabel: "Chat",
      tabBarIcon: () => (
        <FontAwesomeIcon icon="comments" size={30} color='purple' />
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: "Profile",
      tabBarIcon: () => (
        <FontAwesomeIcon icon="user" size={30} color='purple' />
      )
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: 'purple' 
  }
});

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: "Ingresa"
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: "Registro"
    }
  }
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
