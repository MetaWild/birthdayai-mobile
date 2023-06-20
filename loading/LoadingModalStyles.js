import { StyleSheet } from "react-native";

const LoadingModalStyles = StyleSheet.create({
  upgradePopupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  upgradePopup: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  upgradePopupTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    fontSize: 20,
  },
  closeButtonText: {
    color: "#aaa",
    fontSize: 28,
    fontWeight: "bold",
    padding: 5,
  },
  loader: {
    margin: 50,
    borderWidth: 16,
    borderColor: "#f3f3f3",
    borderTopColor: "#3498db",
    borderRadius: 50,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingModalStyles;
