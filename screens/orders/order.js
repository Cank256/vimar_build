import React, { PureComponent } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Platform,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import axios from "axios";
import HOST from "../../constants/constants";
import { showToast } from "../../constants/functions";
import UIDesign from "../../constants/styles";
import {
  Icon,
  Card,
  CardItem,
  Item,
  Body,
  Input,
  Button,
  Right,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

let cartNumber = 0;

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let name = "Past Orders";
    return {
      title: `${name.substring(0, 13)}`,
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 17,
      },
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <Button
            iconRight
            transparent
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={{ color: "#fff"}}>
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
      fetching: true,
      orders: [],
      filteredOrders: [],
      login: false,
      loaded: false,
    };
    this._logout = this._logout.bind(this);
    this._getOrders = this._getOrders.bind(this);
    this.filterOrderListing = this.filterOrderListing.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
  }

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  };

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  _getOrders = async () => {
    this.setState({ fetching: true });
    let token = await AsyncStorage.getItem("userToken");
    const header = {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    };
    try {
      const response = await axios.get(`${HOST}/orders/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token})}`,
        },
      });
      this.setState({
        orders: response.data.data,
        filteredOrders: response.data.data,
        fetching: false,
      });
    } catch (e) {
      this.setState({ fetching: false });
      showToast(
        "Something went wrong while getting list of products available",
        "danger"
      );
    }
  };

  filterOrderListing = async (query) => {
    this.setState({ fetching: true });
    const searchKey = query.toLowerCase();
    const filteredResults = this.state.orders.filter((order) => {
      try {
        return (
          order.order_reference.toLowerCase().includes(searchKey) ||
          order.store.name.toLowerCase().includes(searchKey)
        );
      } catch (exception) {
        return [];
      }
    });
    this.setState({ filteredOrders: filteredResults, fetching: false });
  };

  componentDidMount() {
    this._getOrders();
    this.getCartItems();
    setInterval(() => {
      this.getCartItems()
      // return (cartNumber = 3);
    }, 60);
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
        <View style={UIDesign.styles.container}>
          <Item>
            {/* <Icon
              active
              name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            />
            <Input
              placeholder="Search by order reference"
              onChangeText={(query) => {
                this.filterOrderListing(query);
              }}
              style={{ fontSize: 14 }}
            /> */}
            <Right style={{ marginLeft: 0, paddingLeft: 0 }}>
              <Button
                iconRight
                transparent
                onPress={() => this.componentDidMount()}
              >
                <Text style={{ fontSize: 14 }}>Refresh </Text>
                <Icon name="refresh" style={{ color: Colors.tintColor }} />
              </Button>
            </Right>
          </Item>
          
          <FlatList
            refreshing={this.state.fetching}
            onRefresh={this._getOrders}
            data={this.state.filteredOrders}
            renderItem={(order) => (
              <Order order={order} cartNum={cartNumber} {...this.props} />
            )}
            keyExtractor={(order, index) => index.toString()}
          />
        </View>
      );
    }
  }
}

class Order extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("OrderDetails", {
            order: this.props.order,
            cart_num: this.props.cartNum,
          });
        }}
      >
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              {/* <Text>
                Reference: {this.props.order.item.ugmart_transaction_reference}
              </Text> */}
              <Text note>
                Time of order:{" "}
                {new Date(this.props.order.item.time_of_order).toLocaleString()}
              </Text>

              <Text note>
                Total: {this.props.order.item.initial_order_amount}
              </Text>
              <Text>Order Status: {this.props.order.item.status}</Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }
}
