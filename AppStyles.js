import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(218, 217, 217, 0.733)",
    paddingTop: 50,
    backgroundColor: "#3f51b5",
  },
  column: {
    backgroundColor: "#fff",
    width: width > 768 ? width * 0.6 : width,
    height: height > 768 ? height * 0.75 : height,
    marginTop: height > 768 ? height * 0.07 : 0,
    alignSelf: "center",
    borderRadius: 10,
    // React Native doesn't support box-shadow. Use elevation for Android and shadow* properties for iOS
    elevation: 1, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.15, // iOS
    shadowRadius: 2, // iOS
  },
});

export default styles;
