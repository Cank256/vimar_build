import axios from "axios";
import { showToast } from "../constants/functions";

export async function fetchCategories() {
  const header = {
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.get(`${HOST}/categories/`);
    return response.data;
  } catch (e) {
    this.setState({ fetching: false });
    return showToast("Unable to get categories. Please refresh", "danger");
  }
}
