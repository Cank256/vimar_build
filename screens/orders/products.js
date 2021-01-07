import React, { Component, PureComponent } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  FlatList,
  AsyncStorage,
  Dimensions,
  Modal,
} from "react-native";

import {
  Item,
  Input,
  Right,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
} from "native-base";
import UIDesign from "../../constants/styles";
import Colors from "../../constants/Colors";
import HOST from "../../constants/constants";
import axios from "axios";
import { FlatGrid } from "react-native-super-grid";
import { showToast } from "../../constants/functions";

let cartNumber = 0;

export default class ProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let name = navigation.state.params.name;
    return {
      title: `${name.substring(0, 15)}`,
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 15,
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

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      products: [],
      filteredProducts: [],
      cart: [],
      modalVisible: false,
      totalCost: 0,
    };
    this._getPresentCart = this._getPresentCart.bind(this);
    this._getProducts = this._getProducts.bind(this);
    this._toggleCartItem = this._toggleCartItem.bind(this);
    this._isItemInCart = this._isItemInCart.bind(this);
    this._filterProductListing = this._filterProductListing.bind(this);
    this._changeItemQty = this._changeItemQty.bind(this);
    this._calculateTotalOrderCost = this._calculateTotalOrderCost.bind(this);
  }

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  componentDidMount = async () => {
    // get the items in the cart
    // this._getPresentCart();
    this._getProducts();
    setInterval(() => {
      this.getCartItems();
    }, 60);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _getPresentCart = async () => {
    try {
      const presentCart = await AsyncStorage.getItem("cart");
      const currentCart = JSON.parse(presentCart);
      if (currentCart === null) {
        await AsyncStorage.setItem("cart", JSON.stringify([]));
        currentCart = [];
        cartNumber = currentCart.length;
      }
      this.setState({ cart: currentCart });
      return (cartNumber = currentCart.length);
    } catch (e) {
      await AsyncStorage.setItem("cart", JSON.stringify([]));
    }
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


  async _changeItemQty(item) {
    let cart = this.state.cart;
    const itemId = item.item.id;
    // get the index of the item in the cart
    let pos = cart
      .map((prod) => {
        return prod.item.id;
      })
      .indexOf(itemId);
    // update the values of the item
    let newQty = parseInt(cart[pos].qty) + 1;
    const newTotalCost = parseInt(newQty) * parseFloat(cart[pos].unit_cost);
    cart[pos].qty = newQty;
    cart[pos].total_cost = newTotalCost;
    this.setState({ cart: cart }, async () => {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    });
  }

  _toggleCartItem = async (item) => {
    let cartItems = this.state.cart;
    // remove the item if it has been selected before
    const attemptRemove = cartItems.filter(function(cartItem) {
      return cartItem.item.id != item.item.id;
    });

    if (attemptRemove.length < cartItems.length) {
      cartItems = attemptRemove;
    } else {
      // construct cart item object
      const pdt = {
        item: item.item,
        qty: "1",
        unit_cost: item.item.sale_price,
        total_cost: item.item.sale_price,
      };
      cartItems.push(pdt);
    }
    // set the new state and update the AsyncStorage object
    await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
    // await AsyncStorage.setItem('numberOfCartItems', cartItems.length)
    this.setState({ cart: cartItems });
    return (cartNumber = cartItems.length);
  };

  _isItemInCart = (itemId) => {
    const x = this.state.cart.filter((item) => {
      try {
        let test = `${item.item.id}`.match(itemId);
        return `${item.item.id}`.match(itemId) || false;
      } catch (exception) {
        return false;
      }
    });
    try {
      if (x.length === 1) {
        return true;
      } else {
        return false;
      }
    } catch (exception) {
      return false;
    }
  };

  _filterProductListing = async (query) => {
    this.setState({ fetching: true });
    const searchKey = query.toLowerCase();
    const filteredResults = this.state.products.filter((product) => {
      try {
        return product.name.toLowerCase().includes(searchKey);
      } catch (exception) {
        return [];
      }
    });
    this.setState({ filteredProducts: filteredResults, fetching: false });
  };

  _getProducts = async () => {
    await this._getPresentCart();

    this.setState({ fetching: true });
    try {
      let subCategoryId = this.props.navigation.getParam("subCategoryId");
      const response = await axios.get(
        `${HOST}/products/?subcategory=${subCategoryId}`
      );
      this.setState({
        products: response.data.data,
        filteredProducts: response.data.data,
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
      const { width, height } = Dimensions.get("window");
      const ws = width / 2;
      return (
        <View style={UIDesign.styles.container}>
          <Item>
            <Icon
              active
              name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            />
            <Input
              placeholder="Search by product name"
              onChangeText={(query) => {
                this._filterProductListing(query);
              }}
              style={{ fontSize: 14 }}
            />
          </Item>
          {this.state.products.length < 1 ? (
            <>
              <Card>
                <CardItem header bordered>
                  <Text>Product out of stock. Try other products</Text>
                </CardItem>
              </Card>
            </>
          ) : (
            <>
              <FlatList
                refreshing={this.state.fetching}
                onRefresh={this._getProducts}
                data={this.state.filteredProducts}
                extraData={this.state}
                horizontal={false}
                maxToRenderPerBatch={10}
                initialNumToRender={5}
                renderItem={(product) => (
                  <ProductListing
                    cart={this.state.cart}
                    totalCost={this.state.totalCost}
                    product={product}
                    toggleCartItem={this._toggleCartItem}
                    calculateTotalOrderCost={this._calculateTotalOrderCost}
                    isItemInCart={this._isItemInCart}
                    _changeItemQty={this._changeItemQty}
                    {...this.props}
                  />
                )}
                keyExtractor={(category, index) => index.toString()}
              />
            </>
          )}
        </View>
      );
    }
  }
}

class ProductListing extends PureComponent {
  state = {
    modalVisible: false,
    qty: "",
    totalCost: 0,
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  
  getQuantity() {
    let cart = this.props.cart;
    const itemId = this.props.product.item.id;
    // get the index of the item in the cart
    let pos = cart
      .map((prod) => {
        return prod.item.id;
      })
      .indexOf(itemId);
    // update the values of the item
    this.setState({ qty: cart[pos].qty });
  }

  _calculateTotalOrderCost = async () => {
    // get the items in the cart
    const cart = this.props.cart;
    let totalCost = 0;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const grossCost = parseInt(item.qty) * parseFloat(item.unit_cost);
      totalCost += grossCost;
    }
    this.setState({ totalCost: totalCost });
  };

  componentDidMount() {
    this._calculateTotalOrderCost();
  }

  render() {
    return (
      <>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left style={{ marginRight: 0, padding: 0 }}>
              <Image
                resizeMode="contain"
                source={{ uri: this.props.product.item.product_image }}
                style={{ height: 100, width: 100 }}
              />
            </Left>
            <Body style={{ justifyContent: "space-between" }}>
              <Item style={{ borderBottomColor: "transparent" }}>
                <Text>{this.props.product.item.name}</Text>
              </Item>
              <Item style={{ borderBottomColor: "transparent" }}>
                <Text>UGX {this.props.product.item.sale_price}</Text>
              </Item>
              <Item style={{ borderBottomColor: "transparent" }}>
                <Text>{this.props.product.item.description}</Text>
              </Item>
              {this.props.isItemInCart(this.props.product.item.id) === false ? (
                <>
                  <Button
                    success
                    block
                    small
                    onPress={async () => {
                      await this.props.toggleCartItem(this.props.product);
                      await this._calculateTotalOrderCost();
                      showToast(
                        `Product added to cart. Total Cost: ${this.state.totalCost}`,
                        "success"
                      );
                      this.setModalVisible(true);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Add to Cart</Text>
                  </Button>
                </>
              ) : (
                <Button
                  success
                  block
                  onPress={() => {
                    this.setModalVisible(true);
                    // this.props.toggleCartItem(this.props.product);
                  }}
                >
                  <Text note style={{ color: "#fff" }}>
                    Add to cart
                  </Text>
                </Button>
              )}
            </Body>
          </CardItem>
        </Card>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose an Option</Text>
              <View>
                {/* <Item > */}
                <Button
                  style={{ borderRadius: 15, marginBottom: 20 }}
                  block
                  info
                  onPress={() => {
                    this.props._changeItemQty(this.props.product);
                    this.getQuantity();
                    showToast(
                      `Product added. Total Cost: ${this.props.cart.total_cost}`,
                      "success"
                    );
                  }}
                >
                  <Text style={{ color: "#fff" }}>
                    Add More ({this.state.qty})
                  </Text>
                </Button>
                <Button
                  style={{ borderRadius: 15, marginBottom: 20 }}
                  block
                  success
                  onPress={() => {
                    this.setModalVisible(false);
                    this.props.navigation.navigate("Cart");
                  }}
                >
                  <Text style={{ color: "#fff" }}>Checkout</Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: Colors.tintColor,
                    borderRadius: 15,
                  }}
                  onPress={() => {
                    this.setModalVisible(false);
                  }}
                >
                  <Text style={{ color: Colors.noticeText }}>
                    Continue Shopping
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
