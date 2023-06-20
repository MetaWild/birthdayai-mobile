import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  body: {},
  addReminderBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#fafafa",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addReminderH1: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: 30,
    color: "#fafafa",
  },
  description: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginTop: 10,
    marginBottom: 30,
  },
  addReminderVenueH3: {
    margin: 10,
    color: "#757575",
  },
  addReminderVenueH4: {
    margin: 10,
    color: "#757575",
  },
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3f51b5",
    color: "#fff",
  },
  topPanelTitle: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
    margin: 0,
    fontSize: 24,
  },
  leftIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  textButtons: {
    textDecorationLine: "none",
    color: "#3f51b5",
    backgroundColor: "#fafafa",
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  input: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderWidth: 0,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  picker: {
    width: "75%",
    marginVertical: 10,
    borderWidth: 0,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  sendButton: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    borderWidth: 0,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 5,
    marginTop: 10,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxLabel: {
    marginRight: 5,
  },
  label: {
    fontSize: 16,
  },
});

export default styles;
