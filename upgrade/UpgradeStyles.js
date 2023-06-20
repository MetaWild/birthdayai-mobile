import { StyleSheet } from "react-native";

export default StyleSheet.create({
  upgradePopupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
    elevation: 5,
    alignItems: "center",
  },
  upgradePopupTitle: {
    fontSize: 24,
    marginBottom: 25,
    marginTop: 10,
    fontWeight: "bold",
  },
  upgradeFeature: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  closeButtonText: {
    color: "#aaa",
    fontSize: 30,
    fontWeight: "bold",
    padding: 5,
  },
  upgradeCost: {
    fontSize: 20,
    marginTop: 20,
  },
  continueButton: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#3f51b5",
    color: "white",
    borderRadius: 4,
  },
});
