import { createContext } from "react";

const DataContext = createContext({
  user: null,
  setUser: () => {},
  userProfile: null,
  setUserProfile: () => {},
  handleLogout: () => {},
  addReminder: () => {},
  isAuthChecked: null,
  sessionId: null,
  setSessionId: () => {},
  deleteReminder: () => {},
  editReminder: () => {},
  currentOffering: null,
  isDataFetched: null,
  addCard: () => {},
  deleteCard: () => {},
  editCard: () => {},
  loading: null,
  setLoading: () => {},
});

export default DataContext;
