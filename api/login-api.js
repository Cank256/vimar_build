import axios from "axios";
import { AsyncStorage } from "react-native";
import { showToast } from "../constants/functions";
import HOST from "../constants/constants";

export async function requestOTP(phoneNumber, recom) {
  const header = {
    "Content-type": "application/json",
  };
  const data = JSON.stringify({
    username: phoneNumber,
    recommender: recom,
  });
  //   console.log(data);
  try {
    const response = await axios.post(`${HOST}/users/register/`, data, {
      headers: header,
    });
    return response.data;
  } catch (e) {
    return showToast("We are unable to login right now", "danger");
  }
}

export async function verifyOTP(code, phoneNumber) {
  const header = {
    "Content-Type": "application/json",
  };
  const data = JSON.stringify({
    username: phoneNumber,
    password: code,
  });
  try {
    const response = await axios.post(`${HOST}/users/login/`, data, {
      headers: header,
    });
    if (response.data.status === 200) {
      this.setState({ verifyingOTP: false });
      await AsyncStorage.setItem("userToken", response.data.token);
      return this.props.navigation.navigate("Home");
    } else {
      return showToast(response.data.message, "danger");
    }
  } catch (e) {
    console.log(e, "error found");
    return showToast("We are unable to login right now", "danger");
  }
}

export async function requestNewOtp(phoneNumber, recom) {
  const header = {
    "Content-Type": "application/json",
  };
  const data = JSON.stringify({
    username: phoneNumber,
    recommender: recom,
  });
  try {
    const response = await axios.post(`${HOST}/users/register/`, data, {
      headers: header,
    });
    if (response.data.status === 200) {
      return showToast(response.data.message, "success");
    } else {
      return showToast(response.data.message, "danger");
    }
  } catch (e) {
    console.log(e, "error found");
    return showToast("We are unable to login right now", "danger");
  }
}
