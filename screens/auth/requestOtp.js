import React from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import { Item, Button, Subtitle } from "native-base";
import AirStyles from "../../constants/styles";
import Colors from "../../constants/Colors";
import OTPInput from "@twotalltotems/react-native-otp-input";
import axios from "axios";
import { showToast } from "../../constants/functions";
import HOST from "../../constants/constants";

export default class OTPScreen extends React.Component {
  static navigationOptions = {
    title: "Enter OTP",
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
      modalVisible: false,
      otp: "",
      phone: "",
      verifyingOTP: false,
    };

    this.requestNewOtp = this.requestNewOtp.bind(this);
  }

  handleOtp(value) {
    this.setState({ otp: value });
  }

  componentDidMount() {
    const usernumber = this.props.navigation.getParam("phoneNumber");
    this.setState({ phone: usernumber });
  }

  async verifyOTP(code) {
    this.setState({ verifyingOTP: true });
    const header = {
      "Content-Type": "application/json",
    };
    const data = JSON.stringify({
      username: this.props.navigation.getParam("phoneNumber"),
      password: code,
    });
    try {
      const response = await axios.post(`${HOST}/users/login/`, data, {
        headers: header,
      });
      if (response.data.status === 200) {
        await AsyncStorage.setItem("userToken", response.data.token);
        this.props.navigation.navigate("Home");
        this.setState({ verifyingOTP: false });
      } else {
        this.setState({ verifyingOTP: false });
        return showToast(response.data.message, "danger");
      }
    } catch (e) {
      this.setState({ verifyingOTP: false });
      console.log(e, "error found");
      return showToast(
        "OTP verification failed. Request for new one",
        "danger"
      );
    }
  }

  async requestNewOtp() {
    const header = {
      "Content-Type": "application/json",
    };
    const data = JSON.stringify({
      username: this.props.navigation.getParam("phoneNumber"),
      recommender: this.props.navigation.getParam("recom"),
    });
    try {
      const response = await axios.post(`${HOST}/users/register/`, data, {
        headers: header,
      });
      if (response.data.status === 200) {
        this.setState({ fetching: false });
        return showToast(response.data.message, "success");
      } else {
        this.setState({ fetching: false });
        return showToast(response.data.message, "danger");
      }
    } catch (e) {
      this.setState({ fetching: false });
      console.log(e, "error found");
      return showToast("Failed to request new OTP. Try again.", "danger");
    }
  }

  render() {
    return (
      <View style={AirStyles.styles.container}>
        <Item>
          <Subtitle style={{ color: "#000" }}>
            <Text>Enter the 4-digit code you received in the sms</Text>
          </Subtitle>
        </Item>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <OTPInput
            style={{ height: 300 }}
            pinCount={4}
            code={this.state.otp}
            onCodeChanged={(code) => this.handleOtp(code)}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              this.verifyOTP(code);
            }}
          />
          <Button
            onPress={() => this.requestNewOtp()}
            block
            // disabled
            style={{ backgroundColor: Colors.tintColor, marginTop: 10 }}
          >
            <Text style={AirStyles.styles.infoText}>Resend OTP</Text>
          </Button>
        </View>
        {this.state.verifyingOTP ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.tintColor} />
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 50,
    height: 65,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#000",
  },

  underlineStyleHighLighted: {
    borderColor: Colors.tintColor,
  },
});
