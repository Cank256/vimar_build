import { Toast } from "native-base";

export function showToast(msg, typ) {
  return Toast.show({
    text: `${msg}`,
    position: "bottom",
    duration: 6000,
    type: `${typ}`,
  });
}
