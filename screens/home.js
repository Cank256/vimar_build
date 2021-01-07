import React, { PureComponent } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
} from "react-native";
import {
  Item,
  Button,
  Input,
  Card,
  CardItem,
  Icon,
  Thumbnail,
  Right,
} from "native-base";
import Colors from "../constants/Colors";
import AirStyles from "../constants/styles";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { fetchCategories } from "../api/categories-api";
import HOST from "../constants/constants";
import { showToast } from "../constants/functions";
import { NavigationActions } from "react-navigation";
let CATEGORIES = [];
let FilteredCategories = [];
let searchQuery = "";

let cartNumber = 0;
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      categories: [
        {
          icon:
            "https://patoinsuranceussd.pythonanywhere.com/media/category_icons/wheat.jpg",
          id: "",
          name: "",
        },
      ],
      filteredCategories: [],
      sliderImages: [],
    };

    this.getCategories = this.getCategories.bind(this);
    this.getSliderImages = this.getSliderImages.bind(this);
    this._filterListing = this._filterListing.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { width, height } = Dimensions.get("window");

    _filterCatListing = (query) => {
      const searchKey = query.toLowerCase();
      searchQuery = searchKey;
      const filteredResults = CATEGORIES.filter((category) => {
        try {
          return category.name.toLowerCase().includes(searchKey);
        } catch (exception) {
          return [];
        }
      });
      FilteredCategories = filteredResults;
    };

    return {
      // title: "UGMart",
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerLeft: (
        <Item
          style={{
            backgroundColor: "#fff",
            padding: 5,
            marginLeft: 10,
            marginBottom: 5,
            width: width * 0.68,
            height: 40,
            borderRadius: 5,
          }}
        >
          <Icon name="search" style={{ marginLeft: 5 }} />
          <Input
            placeholder="Search by category"
            style={{ width: "70%", fontSize: 18 }}
            onChangeText={(query) => {
              _filterCatListing(query);
            }}
          />
        </Item>
      ),
      headerRight: (
        <View style={{ marginRight: 5 }}>
          <Button
            iconRight
            transparent
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={{ color: "#fff" }}>Cart({cartNumber})</Text>
            <Icon
              active
              name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
              style={{ color: "white", fontSize: 30 }}
              color="white"
            />
          </Button>
        </View>
      ),
    };
  };

  async getCategories() {
    this.setState({ fetching: true });
    fetchCategories().then((result) => {
      this.setState({ fetching: false });
      if (result.status === 200) {
        this.setState({
          fetching: false,
          categories: result.data,
          filteredCategories: result.data,
        });
        this.props.navigation.setParams({
          categories: result.data,
        });
        CATEGORIES = result.data;
        FilteredCategories = result.data;
      } else {
        this.setState({ fetching: false });
        return showToast(result.message, "danger");
      }
    });
  }

  async getSliderImages() {
    try {
      const response = await axios.get(`${HOST}/slider-images/`);
      let test = response.data.data;
      return [test].map((res) => {
        let testA = [
          res.slider1,
          res.slider2,
          res.slider3,
          res.slider4,
          res.slider5,
        ];

        this.setState({
          sliderImages: testA,
        });
      });
    } catch (e) {
      this.setState({ fetching: false });
      showToast("Failed to get slider images. Refresh.", "danger");
    }
  }

  async getCartItems() {
    let cart = await AsyncStorage.getItem("cart");
    const currentCart = JSON.parse(cart);
    const cartItems = currentCart.length;
    return (cartNumber = cartItems);
  }

  _filterListing = async (query) => {
    this.setState({ fetching: true });
    const searchKey = query.toLowerCase();
    const filteredResults = this.state.categories.filter((category) => {
      try {
        return category.name.toLowerCase().includes(searchKey);
      } catch (exception) {
        return [];
      }
    });
    this.setState({ filteredCategories: filteredResults, fetching: false });
  };

  _globalFilterCatListing = () => {
    this.setState({ filteredCategories: FilteredCategories });
  };

  componentDidMount() {
    this.getCategories();
    this.getSliderImages();
    this.getCartItems();
    setInterval(() => {
      this.getCartItems();
    }, 60);
    setInterval(() => {
      this._globalFilterCatListing();
    }, 600);
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
      const { width, height } = Dimensions.get("window");
      const ws = width / 6;
      return (
        <View style={AirStyles.styles.container}>
          <Item
            style={{
              borderBottomColor: "transparent",
            }}
          >
            {/* <Right>
              <Button
                iconRight
                transparent
                onPress={() => this.componentDidMount()}
              >
                <Text style={{ fontSize: 14 }}>Refresh </Text>
                <Icon name="refresh" style={{ color: Colors.tintColor }} />
              </Button>
            </Right> */}
          </Item>
          <SliderBox
            images={this.state.sliderImages}
            sliderBoxHeight={150}
            onCurrentImagePressed={(index) =>
              console.warn(`Offers coming soon`)
            }
            resizeMode="contain"
            autoplay
            circleLoop
            dotColor={Colors.tintColor}
          />
          <ScrollView>
            <FlatGrid
              legacyImplementation={true}
              refreshing={this.state.fetching}
              onRefresh={() => this.getCategories()}
              itemDimension={ws}
              // data = {FilteredCategories}
              data={this.state.filteredCategories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("SubCategories", {
                      categoryId: item.id,
                      name: item.name,
                    })
                  }
                >
                  <Card
                    transparent
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <CardItem cardBody>
                      <Thumbnail
                        source={{ uri: item.icon }}
                        resizeMode="contain"
                        square
                      />
                    </CardItem>
                    <CardItem cardBody>
                      <Text style={{ fontSize: 10 }}>{item.name}</Text>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      );
    }
  }
}
