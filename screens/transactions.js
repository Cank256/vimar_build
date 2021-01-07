import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import { Left, Card, CardItem, Right, Body } from "native-base";
import Colors from "../constants/Colors";
import AirStyles from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import HOST from "../constants/constants";
import axios from "axios";
import { showToast } from "../constants/functions";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "My Transactions",
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  componentDidMount() {
    // this.getTransactions();
  }

  render() {
    if (this.state.fetching) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f6fa",
          }}
        >
          <ActivityIndicator size="large" color={Colors.tintColor} />
        </View>
      );
    } else {
      return (
        <View style={AirStyles.styles.container}>
          <Item>
            <Text>Transactions screen</Text>
          </Item>
        </View>
      );
    }
  }
}
