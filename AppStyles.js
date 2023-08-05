import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(218, 217, 217, 0.733)",
    paddingTop: Platform.select({ ios: 50, android: 0 }),
    backgroundColor: "#3f51b5",
  },
});

export default styles;
