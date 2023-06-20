import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginTop: -75,
  },
  modalContent: {
    backgroundColor: "#fefefe",
    padding: 25,
    borderRadius: 10,
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
  modalHeading: {
    width: "80%",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: 15,
    textAlign: "center",
    fontSize: 16,
    margin: 4,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
});

export default styles;
