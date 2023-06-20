import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  feedbackFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginTop: -75,
  },
  feedbackFormModal: {
    backgroundColor: "#fefefe",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: "90%",
    width: 500,
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  closeButtonText: {
    color: "#aaa",
    fontSize: 28,
    fontWeight: "bold",
    padding: 5,
  },
  feedbackTextarea: {
    width: "100%",
    height: 150,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: "#f8f8f8",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: 14,
    margin: 8,
    width: "100%",
    borderRadius: 4,
  },
});

export default styles;
