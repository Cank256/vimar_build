import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
// import ConfrimOrderScreen from "../screens/orders/confirmOrder";
import HomeScreen from "../screens/home";
import SubCategoriesScreen from "../screens/subCategories";
import ProfileScreen from "../screens/profile";
import TransactionScreen from "../screens/transactions";

import CartScreen from "../screens/orders/cart";
import OrdersScreen from "../screens/orders/order";
import OrderDetailScreen from "../screens/orders/orderDetails";
import ProductsScreen from "../screens/orders/products";
import ConfrimOrderScreen from "../screens/orders/confirmOrder";

import Colors from "../constants/Colors";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    SubCategories: SubCategoriesScreen,
    Products: ProductsScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-home${focused ? "" : "-outline"}`
          : "md-home"
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: "gray",
  },
};

HomeStack.path = "";

const OrdersStack = createStackNavigator(
  {
    Orders: OrdersScreen,
    Cart: CartScreen,
    OrderDetails: OrderDetailScreen,
    ConfrimOrder: ConfrimOrderScreen,
  },
  config
);

OrdersStack.navigationOptions = {
  tabBarLabel: "Orders",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-cash" : "md-cash"}
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: "gray",
  },
};

OrdersStack.path = "";

const TransactionStack = createStackNavigator(
  {
    Transactions: TransactionScreen,
  },
  config
);

TransactionStack.navigationOptions = {
  tabBarLabel: "Transactions",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-card" : "md-card"}
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: "gray",
  },
};

TransactionStack.path = "";

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: "Account",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-information-circle" : "md-information-circle"}
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: "gray",
  },
};

ProfileStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  OrdersStack,
  // TransactionStack,
  ProfileStack,
});

tabNavigator.path = "";

export default tabNavigator;
