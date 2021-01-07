import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import LoginScreen from "../screens/auth/login";
import RequestOtpScreen from "../screens/auth/requestOtp";
import RegisterScreen from "../screens/auth/register";
import MainTabNavigator from "./MainTabNavigator";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  AsyncStorage,
} from "react-native";

const LoginStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
  GetOtp: RequestOtpScreen
});

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Auth: LoginStack,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);
