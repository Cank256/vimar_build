import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { Form, Input, Label, Item, Button } from "native-base";
import AirStyles from "../../constants/styles";
import Colors from "../../constants/Colors";
import { requestOTP as login } from "../../api/login-api";
import axios from "axios";
import HOST from "../../constants/constants";
import { showToast } from "../../constants/functions";
import * as WebBrowser from "expo-web-browser";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "UG Mart",
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
      username: "",
      recommender: "",
      fetching: false,
    };
    this.requestOtp = this.requestOtp.bind(this);
    this.testLogin = this.testLogin.bind(this);
  }

  async requestOtp() {
    const header = {
      "Content-Type": "application/json",
    };
    const data = JSON.stringify({
      username: this.state.username,
      recommender: this.state.recommender,
    });
    try {
      const response = await axios.post(`${HOST}/users/register/`, data, {
        headers: header,
      });
      if (response.data.status === 200) {
        this.setState({ fetching: false });
        // await AsyncStorage.setItem("userToken", response.data.token);
        return Promise.resolve(
          showToast(response.data.message, "success")
        ).then(() =>
          this.props.navigation.navigate("GetOtp", {
            phoneNumber: this.state.username,
          })
        );
      } else {
        this.setState({ fetching: false });
        return showToast(response.data.message, "danger");
      }
    } catch (e) {
      this.setState({ fetching: false });
      console.log(e, "error found");
      return showToast("We are unable to login right now", "danger");
    }
  }

  async testLogin() {
    return login(this.state.username, this.state.recommender).then((res) => {
      if (res.status === 200) {
        this.setState({ fetching: false });
        showToast(res.message, "success");
        return this.props.navigation.navigate("GetOtp", {
          phoneNumber: this.state.username,
          recom: this.state.recommender,
        });
      } else {
        this.setState({ fetching: false });
        return showToast(res.message, "danger");
      }
    });
  }

  render() {
    if (this.state.fetching) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color={Colors.tintColor} />
        </View>
      );
    } else {
      return (
        <View style={AirStyles.styles.container}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          >
            <KeyboardAvoidingView behavior="padding" enabled>
              <Form>
                <Item floatingLabel>
                  <Label> Enter your phone number</Label>
                  <Input
                    value={this.state.username}
                    autoCapitalize="none"
                    onChangeText={(username) => {
                      this.setState({ username });
                    }}
                    keyboardType="number-pad"
                  />
                </Item>
                <Text />
                <Item floatingLabel>
                  <Label>Recommender's number (Optional)</Label>
                  <Input
                    value={this.state.recommender}
                    autoCapitalize="none"
                    onChangeText={(recommender) => {
                      this.setState({ recommender });
                    }}
                    keyboardType="number-pad"
                  />
                </Item>
              </Form>
              <Button
                onPress={() => {
                  this.setState({ fetching: true }, () => {
                    this.testLogin();
                  });
                }}
                // onPress={() => this.props.navigation.navigate("GetOtp")}
                block
                style={{ backgroundColor: Colors.tintColor, marginTop: 10 }}
              >
                <Text style={AirStyles.styles.infoText}>Submit</Text>
              </Button>
            </KeyboardAvoidingView>
          </ScrollView>
          <View
            style={{
              alignSelf: "flex-end",
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", color: "#000" }}>
              Help Line: +256758357807
            </Text>
          </View>
        </View>
      );
    }
  }
}
