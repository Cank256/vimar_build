import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Picker,
} from "react-native";
import {
  Card,
  CardItem,
  Body,
  Form,
  Text,
  Item,
  Input,
  Label,
  Textarea,
  Icon,
  Button,
  Subtitle,
} from "native-base";
import UIDesign from "../../constants/styles";
import Colors from "../../constants/Colors";
import HOST from "../../constants/constants";
import axios from "axios";
import { showToast } from "../../constants/functions";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      first_name: "",
      last_name: "",
      delivery_email: "",
      division: "",
      parish: "",
      village: "",
      road: "",
      zone: "",
      other: "",
    };

    this.getAddress = this.getAddress.bind(this);
  }

  static navigationOptions = {
    // header: null,
    title: "Confirm Order",
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  changePaymentMethod(value) {
    this.setState({
      paymentMethod: value,
    });
  }

  changeETA(value) {
    this.setState({
      eta: value,
    });
  }

  _makeOrderItems = async (orderItems) => {
    let postItems = [];
    for (let i = 0; i < orderItems.length; i++) {
      x = orderItems[i];
      postItem = {
        item: x.item.id,
        qty: x.qty,
      };
      postItems.push(postItem);
    }
    return postItems;
  };

  async getAddress() {
    this.setState({ fetching: true });
    let token = await AsyncStorage.getItem("userToken");
    const header = {
      Authorization: `${token}`,
    };
    try {
      const response = await axios.get(`${HOST}/users/address/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data.status === 200) {
        let address = response.data.data;
        return this.setState({
          fetching: false,
          division: address.division,
          other: address.other,
          parish: address.parish,
          village: address.village,
          road: address.road,
          zone: address.zone,
        });
      } else {
        this.setState({ fetching: false });
        showToast(response.data.message, "warning");
      }
    } catch (e) {
      showToast(e.message, "danger");
      console.log(
        "Something went wrong while getting list of products available"
      );
    }
  }

  _postOrder = async () => {
    if (this.props.navigation.state.params.totalCost <= 0) {
      this.setState({ fetching: false });
      return showToast(
        "You need to select some items before confirming an order",
        "danger"
      );
    }
    const data = JSON.stringify({
      items: await this._makeOrderItems(
        this.props.navigation.state.params.items
      ),
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      delivery_email: this.state.delivery_email,
      division: this.state.division,
      parish: this.state.parish,
      village: this.state.village,
      road: this.state.road,
      zone: this.state.zone,
      other: this.state.other,
    });

    try {
      const response = await axios.post(`${HOST}/orders/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await AsyncStorage.getItem("userToken")}`,
        },
      });
      // check if the signature is not accepted and prompt one to log in again
      if (response.data.status === 200) {
        this.setState({ fetching: false });
        showToast(response.data.message, "success");
        await AsyncStorage.removeItem("cart");
        this.props.navigation.navigate("Home");
      }
      if (response.data.status === 401) {
        this.setState({ fetching: false });

        this.props.navigation.navigate("Login");
        return showToast(
          "Please first login and then proceed with the order",
          "warning"
        );
      } else {
        this.setState({ fetching: false });
        return showToast(response.data.message, "");
      }
    } catch (e) {
      console.log(e);
      showToast(
        "We are facing a challenge processing your order. Please try again shortly",
        "danger"
      );
    }
    this.setState({ fetching: false });
  };

  _sendOrder = async () => {
    // send order to the API at this point
    const orderRequest = await this._postOrder(status);
    if (orderRequest.status === 200) {
      // when the order is successful
      // remove the cart and selected store from AsyncStorage
      await AsyncStorage.removeItem("cart");
      alert(orderRequest.message);
      this.props.navigation.navigate("Home");
    } else {
      alert(orderRequest.message);
    }
  };

  componentDidMount() {
    this.getAddress();
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
        <View style={UIDesign.styles.container}>
          <ScrollView>
            <KeyboardAvoidingView behavior="padding" enabled>
              <OrderOverview
                totalCost={this.props.navigation.state.params.totalCost}
                noItems={this.props.navigation.state.params.noItems}
              />
              <Form>
                <Item floatingLabel>
                  <Label>First Name</Label>
                  <Input
                    value={this.state.first_name}
                    onChangeText={(firstname) =>
                      this.setState({ first_name: firstname })
                    }
                    autoCapitaluize="true"
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Last Name</Label>
                  <Input
                    value={this.state.last_name}
                    onChangeText={(last_name) => {
                      this.setState({ last_name });
                    }}
                    autoCapitalize
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Email address</Label>
                  <Input
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={this.state.delivery_email}
                    onChangeText={(delivery_email) =>
                      this.setState({ delivery_email })
                    }
                  />
                </Item>
                <Text></Text>
                <Text></Text>
                <Item style={{ alignItems: "center" }}>
                  <Subtitle style={{ color: "#000" }}>Address Info</Subtitle>
                </Item>
                <Item floatingLabel>
                  <Label>Division</Label>
                  <Input
                    value={this.state.division}
                    onChangeText={(division) => this.setState({ division })}
                    autoCapitalize
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Parish</Label>
                  <Input
                    autoCapitalize
                    value={this.state.parish}
                    onChangeText={(parish) => this.setState({ parish })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Village</Label>
                  <Input
                    autoCapitalize
                    value={this.state.village}
                    onChangeText={(village) => this.setState({ village })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Nearby road</Label>
                  <Input
                    autoCapitalize
                    value={this.state.road}
                    onChangeText={(road) => this.setState({ road })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Zone</Label>
                  <Input
                    value={this.state.zone}
                    onChangeText={(zone) => this.setState({ zone })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Any other info (optional) </Label>
                  <Input
                    value={this.state.other}
                    onChangeText={(other) => this.setState({ other })}
                  />
                </Item>
              </Form>
              <Text></Text>
              <Button
                block
                success
                rounded
                disabled={this.state.fetching}
                onPress={() => {
                  this.setState({ fetching: true });
                  this._postOrder();
                }}
              >
                <Text>Checkout</Text>
              </Button>
              <Text></Text>
              <Text></Text>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      );
    }
  }
}

class OrderOverview extends Component {
  render() {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Body>
            <Text note>{this.props.noItems} Items</Text>
            <Text note>Total: UGX {this.props.totalCost}</Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
