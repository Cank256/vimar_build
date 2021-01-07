import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import {
  Button,
  Card,
  CardItem,
  Left,
  Right,
  Body,
  Icon,
  Label,
  Input,
  Item,
  Picker,
} from "native-base";
import Colors from "../constants/Colors";
import AirStyles from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import HOST from "../constants/constants";
import axios from "axios";
import { showToast } from "../constants/functions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "My Wezimbe Accounts",
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

  componentDidMount() {}

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
            <Text>Past Orders Screen</Text>
          </Item>
        </View>
      );
    }
  }
}
