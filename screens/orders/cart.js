import React, { PureComponent } from "react";
import {
  Platform,
  TouchableOpacity,
  View,
  AsyncStorage,
  FlatList,
  Alert,
  Image,
} from "react-native";

import {
  CardItem,
  Right,
  Icon,
  Card,
  Body,
  Item,
  Left,
  Button,
  Text,
} from "native-base";

import UIDesign from "../../constants/styles";
import Colors from "../../constants/Colors";
import { showToast } from "../../constants/functions";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {},
      totalCost: 0,
      cart: [],
      fetching: true,
    };
    this._getPresentCart = this._getPresentCart.bind(this);
    this._changeItemQty = this._changeItemQty.bind(this);
    this._calculateTotalOrderCost = this._calculateTotalOrderCost.bind(this);
    this._removeCartItem = this._removeCartItem.bind(this);
  }

  static navigationOptions = {
    title: "My Cart",
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 17,
    },
  };

  componentDidMount = async () => {
    // get the items in the cart
    await this._getPresentCart();
  };
  _getPresentCart = async () => {
    this.setState({ fetching: true });
    try {
      let presentCart = await AsyncStorage.getItem("cart");
      const currentCart = JSON.parse(presentCart);
      this.setState({ cart: currentCart, fetching: false }, async () => {
        if (presentCart !== null) {
          await this._calculateTotalOrderCost();
        }
      });
    } catch (e) {
      this.setState({ cart: [] });
      showToast("Something went wrong while getting your cart items", "danger");
    }
  };

  _removeCartItem = async (item) => {
    let cartItems = this.state.cart;
    // remove the item if it has been selected before
    const attemptRemove = cartItems.filter(function(cartItem) {
      return cartItem.item.id != item.item.id;
    });
    cartItems = attemptRemove;
    // set the new state and update the  cart AsyncStorage object
    this.setState({ cart: cartItems }, async () => {
      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      await this._calculateTotalOrderCost();
    });
  };

  _calculateTotalOrderCost = async () => {
    // get the items in the cart
    const cart = this.state.cart;
    let totalCost = 0;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const grossCost = parseInt(item.qty) * parseFloat(item.unit_cost);
      totalCost += grossCost;
    }
    this.setState({ totalCost: totalCost });
  };

  _changeItemQty = async (item, action) => {
    let cart = this.state.cart;
    // get the index of the item in the cart
    let index = cart.indexOf(item);
    // update the values of the item
    let newQty = parseInt(cart[index].qty) + 1;
    if (action === "MINUS") {
      newQty = parseInt(cart[index].qty) - 1;
    }

    if (newQty <= 1) {
      newQty = 1;
    }

    const newTotalCost = parseInt(newQty) * parseFloat(cart[index].unit_cost);

    cart[index].qty = newQty;
    cart[index].total_cost = newTotalCost;

    this.setState({ cart: cart }, async () => {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      await this._calculateTotalOrderCost();
    });
  };

  render() {
    return (
      <View style={UIDesign.styles.container}>
        <Card>
          <CardItem header>
            <Body>
              <Text style={{ fontSize: 18 }}>
                Total: UGX {this.state.totalCost}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Button
              iconRight
              success
              block
              onPress={() => {
                this.props.navigation.navigate("ConfrimOrder", {
                  totalCost: this.state.totalCost,
                  noItems: this.state.cart.length,
                  items: this.state.cart,
                });
              }}
            >
              <Text style={{ fontSize: 18 }}>Proceed</Text>
              <Icon name="arrow-forward" style={{ color: "#fff" }} />
            </Button>
          </CardItem>
        </Card>

        <Text note>Pull from here to refresh</Text>

        <FlatList
          data={this.state.cart}
          extraData={this.state}
          renderItem={(item) => (
            <OrderItem
              item={item}
              removeItem={this._removeCartItem}
              changeItemQty={this._changeItemQty}
              {...this.props}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => {
            this.componentDidMount();
          }}
          refreshing={this.state.fetching}
        />
      </View>
    );
  }
}

class OrderItem extends PureComponent {
  render() {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Left style={{ marginRight: 0, padding: 0 }}>
            <Image
              resizeMode="contain"
              source={{ uri: this.props.item.item.item.product_image }}
              style={{ height: 100, width: 100 }}
            />
          </Left>
          <Body>
            <Text style={{ fontSize: 15 }}>
              {this.props.item.item.item.name}
            </Text>
            <Text note>
              Unit Cost: Ugx {this.props.item.item.item.sale_price}
            </Text>
            <Text note>Qty: {this.props.item.item.qty}</Text>
            <Text note>Total: Ugx {this.props.item.item.total_cost}</Text>
          </Body>
        </CardItem>

        <CardItem footer style={{ justifyContent: "space-between" }}>
          <Button
            small
            // iconRight
            success
            onPress={() => {
              this.props.changeItemQty(this.props.item.item, "ADD");
            }}
          >
            <Text style={{ fontSize: 12 }}>Add</Text>
            {/* <Icon
              style={{ fontSize: 15, color: "green", }}
              active
              name={
                Platform.OS === "ios"
                  ? "ios-add-circle-outline"
                  : "md-add-circle-outline"
              }
            /> */}
          </Button>
          <Button
            small
            info
            // transparent
            // iconRight
            onPress={() => {
              this.props.changeItemQty(this.props.item.item, "MINUS");
            }}
          >
            <Text style={{ fontSize: 12 }}>Reduce</Text>
            {/* <Icon
              style={{ fontSize: 25, color: "#FF7F50" }}
              name={
                Platform.OS === "ios"
                  ? "ios-remove-circle-outline"
                  : "md-remove-circle-outline"
              } 
            />*/}
          </Button>
          <Button
            danger
            // transparent
            small
            // iconRight
            onPress={() => {
              this.props.removeItem(this.props.item.item);
            }}
          >
            <Text style={{ fontSize: 12 }}>Clear All</Text>
            {/* <Icon
              style={{ fontSize: 25, color: "red" }}
              active
              name={
                Platform.OS === "ios"
                  ? "ios-close-circle-outline"
                  : "md-close-circle-outline"
              }
            /> */}
          </Button>
        </CardItem>
      </Card>
    );
  }
}
