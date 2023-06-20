import { StyleSheet } from "react-native";

export default StyleSheet.create({
  loginBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Use a softer shade of white for background
  },
  loginContainer: {
    alignItems: "center",
    width: "100%", // Allow container to take full width
    justifyContent: "center",
  },
  welcomeText: {
    alignItems: "center",
    fontWeight: "500",
    fontSize: 36,
    textAlign: "center",
    marginBottom: 20,
    width: "100%", // Allow text to take full width
    color: "#212121", // Use a darker shade for text
  },
  loginLogo: {
    alignItems: "center",
    width: 100, // Increased logo size for a bolder graphic
    alignSelf: "center",
    height: "auto",
    paddingTop: 30,
    paddingBottom: 30, // Increased padding to give more white space
  },
});
