import React from "react";
import {
  Platform,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import {
  Icon,
  Button,
  Card,
  CardItem,
  Subtitle,
  Item,
  Input,
  Right,
} from "native-base";
import UIDesign from "../constants/styles";
import Colors from "../constants/Colors";
import HOST from "../constants/constants";
import axios from "axios";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

let cartNumber = 0;

export default class SubCategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let name = navigation.state.params.name;

    return {
      title: `${name.substring(0, 15)}...`,
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
            <Text style={{ color: "#fff" }}>Cart ({cartNumber})</Text>
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
      sub_categories: [
        {
          category: "",
          id: "",
          name: "",
        },
      ],
      filteredCategories: [],
      fetching: false,
    };
    this.getSubCategories = this.getSubCategories.bind(this);
    this._filterListing = this._filterListing.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
  }

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  getSubCategories = async () => {
    const categoryId = this.props.navigation.getParam("categoryId");
    try {
      const response = await axios.get(
        `${HOST}/sub-categories/?category=${categoryId}`
      );
      this.setState({
        sub_categories: response.data.data,
        filteredCategories: response.data.data,
      });
    } catch (e) {
      showToast(
        "Something went wrong while getting list of categories",
        "danger"
      );
    }
  };

  componentDidMount = () => {
    this.getSubCategories();
    this.getCartItems();
    setInterval(() => {
      this.getCartItems();
    }, 60);
  };

  _filterListing = async (query) => {
    this.setState({ fetching: true });
    const searchKey = query.toLowerCase();
    const filteredResults = this.state.sub_categories.filter((category) => {
      try {
        return category.name.toLowerCase().includes(searchKey);
      } catch (exception) {
        return [];
      }
    });
    this.setState({ filteredCategories: filteredResults, fetching: false });
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
              placeholder="Search by subcategory"
              onChangeText={(query) => {
                this._filterListing(query);
              }}
              style={{ fontSize: 14 }}
            />
            <Right>
              <Button
                iconRight
                transparent
                onPress={() => this.getSubCategories}
              >
                <Text style={{ fontSize: 14 }}>Refresh{`  `}</Text>
                <Icon name="refresh" style={{ color: Colors.tintColor }} />
              </Button>
            </Right>
          </Item>
          {this.state.sub_categories.length < 1 ? (
            <Card style={{ alignItems: "center" }}>
              <CardItem header>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  No Products found!
                </Text>
              </CardItem>
            </Card>
          ) : (
            <FlatList
              // data={this.state.filteredCategories}
              data={this.state.filteredCategories}
              refreshing={this.state.fetching}
              onRefresh={this.getSubCategories}
              extraData={this.state}
              horizontal={false}
              renderItem={(category) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Products", {
                      subCategoryId: category.item.id,
                      name: category.item.name,
                    })
                  }
                >
                  <Card style={{ flex: 0 }}>
                    <CardItem>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "600",
                        }}
                      >
                        {category.item.name}
                      </Text>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              )}
              keyExtractor={(category, index) => index.toString()}
            />
          )}
        </View>
      );
    }
  }
}
