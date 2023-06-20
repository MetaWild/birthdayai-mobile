import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

import DataContext from "./data-context";

const APIKeys = {
  apple: "appl_CLXcyXZXpHXWTrVbsXPkUQnYbGq",
  google: "goog_TpfBgsKxUSQNbPzHcylfNAeoQfV",
};

function DataProvider(props) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  let [sessionId, setSessionId] = useState("");
  const [currentOffering, setCurrentOffering] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetch(`https://birthdayai.herokuapp.com/api/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
          body: JSON.stringify({
            id: currentUser.uid,
            phoneNumber: currentUser.phoneNumber,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            let userProfile = { ...data.user };
            if (userProfile.reminders === undefined) {
              userProfile.reminders = [];
            }
            if (userProfile.cards === undefined) {
              userProfile.cards = [];
            }
            userProfile.reminders = Object.values(userProfile.reminders);
            userProfile.cards = Object.values(userProfile.cards);
            setUserProfile(userProfile);
            setUser(currentUser);
            setIsAuthChecked(true);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        setIsAuthChecked(true);
        setUser(null);
        setUserProfile(null);
        navigation.navigate("Login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        console.log(offerings);
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setCurrentOffering(offerings.current);
          const purchaserInfo = await Purchases.getCustomerInfo();
          let isPremium = false; // Default to false

          // Check if 'premium' exists in 'entitlements.active'
          if (purchaserInfo.entitlements?.active?.premium) {
            isPremium = true;
          }
          if (userProfile && userProfile.subscription !== isPremium) {
            setUserProfile((prevState) => {
              return {
                ...prevState,
                subscription: isPremium,
              };
            });
            await fetch(
              `https://birthdayai.herokuapp.com/api/users/${user.uid}/subscription`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                  isSubscribed: isPremium,
                }),
              }
            );
          }
          setIsDataFetched(true);
        }
      } catch (e) {
        console.error(e.message);
      }
    };
    if (user) {
      setLoading(true);
      Purchases.setDebugLogsEnabled(true);
      console.log(Platform.OS);
      if (Platform.OS === "android") {
        Purchases.configure({ apiKey: APIKeys.google, appUserID: user.uid });
        fetchData().catch(console.log);
      } else {
        Purchases.configure({ apiKey: APIKeys.apple, appUserID: user.uid });
        fetchData().catch(console.log);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isDataFetched) {
      const removeListener = Purchases.addCustomerInfoUpdateListener(
        async (info) => {
          let isPremium = false; // Default to false

          // Check if 'premium' exists in 'entitlements.active'
          if (info.entitlements?.active?.premium) {
            isPremium = true;
          }

          if (userProfile && userProfile.subscription !== isPremium) {
            setUserProfile((prevState) => {
              return {
                ...prevState,
                subscription: isPremium,
              };
            });
            await fetch(
              `https://birthdayai.herokuapp.com/api/users/${user.uid}/subscription`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                  isSubscribed: isPremium,
                }),
              }
            );
          }
        }
      );

      setLoading(false);
      navigation.navigate("Home");

      return removeListener; // Cleanup subscription on unmount
    }
  }, [isDataFetched]);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Home");
  };

  function addReminder(reminder) {
    const reminders = userProfile.reminders || [];
    const newReminders = [reminders, reminder];
    setUserProfile((prevState) => {
      return {
        ...prevState,
        reminders: newReminders,
      };
    });
  }

  function deleteReminder(id) {
    const newReminders = userProfile.reminders.filter(
      (reminder) => reminder.id !== id
    );
    setUserProfile((prevState) => {
      return {
        ...prevState,
        reminders: newReminders,
      };
    });
  }

  function editReminder(reminder) {
    const newReminders = userProfile.reminders.map((r) =>
      r.id === reminder.id ? reminder : r
    );
    setUserProfile((prevState) => {
      return {
        ...prevState,
        reminders: newReminders,
      };
    });
  }

  function addCard(card) {
    const cards = userProfile.cards || [];
    const newCards = [...cards, card];
    setUserProfile((prevState) => {
      return {
        ...prevState,
        cards: newCards,
      };
    });
  }

  function editCard(card) {
    const newCards = userProfile.cards.map((c) =>
      c.id === card.id ? card : c
    );
    setUserProfile((prevState) => {
      return {
        ...prevState,
        cards: newCards,
      };
    });
  }

  function deleteCard(id) {
    const newCards = userProfile.cards.filter((card) => card.id !== id);
    setUserProfile((prevState) => {
      return {
        ...prevState,
        cards: newCards,
      };
    });
  }

  const dataContext = {
    user: user,
    setUser: setUser,
    userProfile: userProfile,
    setUserProfile: setUserProfile,
    handleLogout: handleLogout,
    addReminder: addReminder,
    isAuthChecked: isAuthChecked,
    sessionId: sessionId,
    setSessionId: setSessionId,
    deleteReminder: deleteReminder,
    editReminder: editReminder,
    currentOffering: currentOffering,
    isDataFetched: isDataFetched,
    addCard: addCard,
    editCard: editCard,
    deleteCard: deleteCard,
    loading: loading,
    setLoading: setLoading,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
}

export default DataProvider;
