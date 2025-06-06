import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  aiItems: {
    marginTop: 10,
    padding: 15,
  },
  aiItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 5,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#3f51b5",
  },
  rightContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  svgAndBirthday: {
    flexDirection: "column",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  aiRelationship: {
    fontSize: 12,
    color: "#757575",
  },
  aiStyle: {
    fontSize: 12,
    color: "#757575",
  },
  aiBirthday: {
    fontSize: 12,
    fontWeight: "500",
    color: "#757575",
  },
  aiDays: {
    fontSize: 18,
    color: "#3f51b5",
    fontWeight: "bold",
  },
  aiDaysLeft: {
    fontSize: 12,
    color: "#757575",
  },
  upgradeButton: {
    color: "#3f51b5",
    backgroundColor: "#fafafa",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
    textDecorationLine: "none",
  },
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#3f51b5",
  },
  topPanelTitle: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
    margin: 0,
    fontSize: 24,
  },
  aiUpgradeText: {
    fontSize: 14,
    color: "#757575",
  },
  topButtons: {
    position: "absolute",
    top: -10,
    left: -10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 22,
    height: 22,
    marginRight: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  deleteButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 22,
    height: 22,
    marginRight: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  leftIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  rightIcons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
});
