import React, { Component, PureComponent } from "react";
import {
  Platform,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  AsyncStorage,
} from "react-native";

import {
  CardItem,
  Item,
  Right,
  Icon,
  Card,
  Body,
  Left,
  Button,
  Text,
} from "native-base";

import UIDesign from "../../constants/styles";
import Colors from "../../constants/Colors";

let cartNumber = 0;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
    };
    // this._pickOrder = this._pickOrder.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    let cartNum = navigation.getParam("cart_num");
    const order = navigation.getParam("order");
    let orderNum = order.index + 1;
    return {
      title: `Order #${orderNum}`,
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerRight: (
        <Item style={{ marginRight: 10, borderBottomColor: "transparent" }}>
          <Text style={{ color: "#fff" }}>Cart({cartNumber}) </Text>
          <Button
            iconRight
            transparent
            onPress={() => navigation.navigate("Cart")}
          >
            <Icon
              active
              name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              style={{ color: "white", fontSize: 30 }}
              color="white"
            />
          </Button>
        </Item>
      ),
    };
  };

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  componentDidMount() {
    this.getCartItems();
  }

  render() {
    return (
      <View style={UIDesign.styles.container}>
        <Card>
          <CardItem>
            <Body>
              <Text style={{ fontSize: 20 }}>
                {
                  this.props.navigation.state.params.order.item
                    .ugmart_transaction_reference
                }
              </Text>
              <Text style={{ fontSize: 18 }}>
                Order Total:
                {
                  this.props.navigation.state.params.order.item
                    .initial_order_amount
                }
              </Text>
              <Text style={{ fontSize: 18 }}>
                {new Date(
                  this.props.navigation.state.params.order.item.time_of_order
                ).toLocaleString()}
              </Text>
            </Body>
          </CardItem>
        </Card>

        <FlatList
          data={this.props.navigation.state.params.order.item.items}
          extraData={this.props.navigation.state.params.order.item.items}
          renderItem={(item) => <OrderItem item={item} {...this.props} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

class OrderItem extends PureComponent {
  render() {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem header bordered>
          <Text>{this.props.item.item.product_name}</Text>
          {/* <Text>Item # {this.props.item.item.product}</Text>          */}
        </CardItem>

        {/* <CardItem>
          <Text>Item # {this.props.item.item.product}</Text>
        </CardItem> */}

        <CardItem>
          <Text>
            {this.props.item.item.ordered_qty} @{" "}
            {this.props.item.item.gross_cost}
          </Text>
        </CardItem>
      </Card>
    );
  }
}
