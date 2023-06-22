import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(218, 217, 217, 0.733)",
    paddingTop: 50,
    backgroundColor: "#3f51b5",
  },
});

export default styles;
