import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Form,
  Input,
  Button,
  Label,
  Item,
  DatePicker,
  Picker
} from "native-base";
import AirStyles from "../../constants/styles";
import Colors from "../../constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../components/TabBarIcon";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Register",
    headerStyle: {
      backgroundColor: Colors.tintColor
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      saving_period: ""
    };
    this.setDtate = this.setDtate.bind(this);
  }
  setDtate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  render() {
    return (
      <LinearGradient
        colors={["#ccd3f0", "#f5f9fa"]}
        style={AirStyles.styles.container}
      >
        <View style={{ flex: 1 }}>
          <ScrollView>
            <KeyboardAvoidingView behavior="padding" enabled>
              <Form>
                <Item floatingLabel>
                  <Label>Full Name</Label>
                  <Input />
                </Item>
                <Item inlineLabel>
                  <Label>D.O.B</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    maximumDate={new Date()}
                    locale={"en"}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Choose date"
                    textStyle={{ color: Colors.tintColor }}
                    placeHolderTextStyle={{ color: Colors.tintColor }}
                    onDateChange={date => this.setState({ chosenDate: date })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Phone Number</Label>
                  <Input keyboardType="number-pad" />
                </Item>
                <Item floatingLabel>
                  <Label>Email</Label>
                  <Input keyboardType="email-address" />
                </Item>
                <Item floatingLabel>
                  <Label>Recommender's Phone No.</Label>
                  <Input keyboardType="number-pad" />
                </Item>
                <Item floatingLabel>
                  <Label>Savings Account</Label>
                  <Input keyboardType="number-pad" />
                </Item>
                <Item>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Ionicons
                        name={
                          Platform.OS === "ios"
                            ? "ios-arrow-dropdown"
                            : "md-arrow-dropdown"
                        }
                      />
                    }
                    style={{ color: "#fff" }}
                    placeholder="Select saving period in Months"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor={Colors.tintColor}
                    selectedValue={this.state.selected2}
                    onValueChange={period =>
                      this.setState({ saving_period: period })
                    }
                  >
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="12" value="12" />
                  </Picker>
                </Item>
                <Item floatingLabel>
                  <Label>PIN</Label>
                  <Input keyboardType="visible-password" />
                </Item>
                <Item floatingLabel last>
                  <Label>Confirm PIN</Label>
                  <Input keyboardType="visible-password" />
                </Item>
              </Form>
            </KeyboardAvoidingView>
            <Button
              block
              style={{
                backgroundColor: Colors.tintColor,
                marginTop: 10,
                marginBottom: 10
              }}
              // disabled={this.state.fetching}
              // onPress={() => {
              //   this.setState({ fetching: true, showIndicator: true }, () => {
              //     this._login();
              //   });
              // }}
            >
              <Text style={AirStyles.styles.infoText}>Register</Text>
            </Button>
          </ScrollView>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
