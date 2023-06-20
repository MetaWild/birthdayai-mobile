import { StyleSheet } from "react-native";

export default StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  settingsPage: {
    padding: 10,
  },
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#3f51b5",
  },
  topPanelTitle: {
    flexGrow: 1,
    color: "#fff",
    margin: 0,
    fontSize: 24,
  },
  cancelText: {
    color: "#3f51b5",
    backgroundColor: "#fafafa",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginRight: 10,
    textDecorationLine: "none",
  },
  settingsList: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 10,
  },
  settingIcon: {
    width: 30,
    height: 30,
  },
  settingTitle: {
    flexGrow: 1,
    marginLeft: 15,
    fontSize: 18,
  },
  arrowIcon: {
    marginLeft: 10,
  },
});
