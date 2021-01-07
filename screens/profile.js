import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  Platform,
  Share,
  Linking,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import Airstyles from "../constants/styles";
import axios from "axios";
import HOST from "../constants/constants";
import { Button, Icon } from "native-base";
import { showToast } from "../constants/functions";
import * as WebBrowser from "expo-web-browser";
import logo from "../assets/images/icon.png";
import { ScrollView } from "react-native-gesture-handler";

let cartNumber = 0;

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Account",
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 15,
      },
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <Button
            iconRight
            transparent
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>
              Cart({cartNumber})
            </Text>
            <Icon
              active
              name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              style={{ color: "white" }}
              color="white"
            />
          </Button>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      info: {
        android_link: "",
        cumulative_loyalty_reward: 0,
        ios_link: "",
        tcs_link: "",
        username: "",
        banner: "https://patoinsuranceussd.pythonanywhere.com/media/slider_banners/Good_African_coffee2.jpg"
      },
    };
    this._logout = this._logout.bind(this);
    this.onShare = this.onShare.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  };

  async onShare() {
    try {
      const result = await Share.share({
        message: `I would like to recommend this app to you. 
                  Provide my number ${this.state.info.username} as the recommender. 
                  Download now from: ${this.state.info.android_link} for android\n
                  or ${this.state.info.ios_link} for iOS`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("share with activity", result.activityType);
          // shared with activity type of result.activityType
        } else {
          return showToast("Shared", "");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async getInfo() {
    let token = await AsyncStorage.getItem("userToken");
    try {
      const response = await axios.get(`${HOST}/loyalty-info`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      this.setState({
        info: response.data.data,
      });
    } catch (e) {
      console.log(e.message);
      console.log("Something went wrong while getting the info");
    }
  }

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  _getBannerImage = async()=> {
    try {
      const response = await axios.get(`${HOST}/slider-images/`);
      let test = response.data.data;
      if (test.account_screen === 'https://patoinsuranceussd.pythonanywhere.com/media/'){
        await this.setState({
          banner: test.slider1,
        });
      }
      else{        
        await this.setState({
          banner: test.account_screen,
        });
      }
      
    } catch (e) {
      this.setState({ fetching: false });
      showToast("Failed to get banner image. Refresh.", "danger");
    }
  }

  async componentDidMount () {
    await this._getBannerImage();
    this.getCartItems();
    setInterval(() => {
      this.getCartItems();
    }, 60);
    this.getInfo();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <Image
              style={styles.header}
              source={{uri: this.state.banner }}
              resizeMode="contain"
            />
          </View>
          <Image
            style={styles.avatar}
            source={logo}
            // source={{
            //   uri:
            //     "https://patoinsuranceussd.pythonanywhere.com/media/slider_banners/Good_African_coffee2.jpg",
            // }}
          />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>+{this.state.info.username}</Text>
              <Text style={styles.description}>
                Loyalty points: {this.state.info.cumulative_loyalty_reward}
              </Text>
              <Text style={styles.description}>Contact: +256755000715</Text>

              <Button
                iconLeft
                transparent={true}
                onPress={() => Linking.openURL("mailto:info@ugmart.ug")}
              >
                <Icon
                  active
                  name={Platform.OS === "ios" ? "ios-mail" : "md-mail"}
                />
                <Text>{"  "}info@ugmart.ug</Text>
              </Button>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this.onShare()}
              >
                <Text style={Airstyles.styles.infoText}>Share {"  "}</Text>
                <Icon
                  active
                  name={Platform.OS === "ios" ? "ios-share" : "md-share"}
                  style={{ color: "white" }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() =>
                  WebBrowser.openBrowserAsync(`${this.state.info.tcs_link}`)
                }
              >
                <Text style={Airstyles.styles.infoText}>
                  Terms and Conditions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() =>
                  WebBrowser.openBrowserAsync(`${this.state.info.tcs_link}`)
                }
              >
                <Text style={Airstyles.styles.infoText}>FAQ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this._logout()}
                style={styles.buttonContainer}
              >
                <Text style={Airstyles.styles.infoText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    // backgroundColor: Colors.tintColor,
    height: 100,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 120,
  },
  name: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 140,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 16,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: Colors.tintColor,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#696969",
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: 250,
    borderRadius: 30,
    backgroundColor: Colors.tintColor,
  },
});
