import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, Linking, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import Purchases from "react-native-purchases";

import UpgradePopup from "../upgrade/UpgradePopup";
import FeedbackForm from "../feedback/FeedbackForm";
import ModalPopup from "../modal/ModalPopup";
import DataContext from "../data/data-context";
import styles from "./SettingsStyles";

const Settings = () => {
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isConactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFeedbackSuccessModalOpen, setIsFeedbackSuccessModalOpen] =
    useState(false);

  const dataCtx = useContext(DataContext);
  const userProfile = dataCtx.userProfile;
  const setUserProfile = dataCtx.setUserProfile;
  const user = dataCtx.user;
  const navigation = useNavigation();

  const openUpgradePopup = () => {
    setIsUpgradePopupOpen(true);
  };

  const closeUpgradePopup = () => {
    setIsUpgradePopupOpen(false);
  };

  const openFeedbackForm = () => {
    setIsFeedbackFormOpen(true);
  };

  const closeFeedbackForm = () => {
    setIsFeedbackFormOpen(false);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const showSuccessModal = () => setIsSuccessModalOpen(true);

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const showFeedbackSuccessModal = () => setIsFeedbackSuccessModalOpen(true);

  const closeFeedbackSuccessModal = () => setIsFeedbackSuccessModalOpen(false);

  const handleOpenURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
      }
    });
  };

  const restoringPurchases = async () => {
    const restore = await Purchases.restorePurchases();
    let isPremium = false;

    if (restore.entitlements?.active?.premium) {
      isPremium = true;
      Alert.alert(
        "Restore Purchase Success",
        "You have successfully restored your purchase!",
        [
          {
            text: "OK",
            onPress: async () => {
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
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Restore Purchase Failed",
        "Unable to find previous purchase or an active subscription.",
        [
          {
            text: "OK",
            onPress: async () => {
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
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.settingsContainer}>
      <ModalPopup
        onClose={closeSuccessModal}
        title="Congratulations!"
        content="You have successfully upgraded your account! Make sure to update past reminders to add the new features."
        isVisible={isSuccessModalOpen}
      />
      <ModalPopup
        onClose={closeFeedbackSuccessModal}
        title="Thank you!"
        content="Your feedback has been submitted."
        isVisible={isFeedbackSuccessModalOpen}
      />
      <UpgradePopup
        onClose={closeUpgradePopup}
        openModal={showSuccessModal}
        isVisible={isUpgradePopupOpen}
      />
      <FeedbackForm
        onClose={closeFeedbackForm}
        openModal={showFeedbackSuccessModal}
        isVisible={isFeedbackFormOpen}
      />
      <ModalPopup
        onClose={closeContactModal}
        title="Contact Us"
        content="Email: contact@birthdayaiapp.com"
        isVisible={isConactModalOpen}
      />
      <View style={styles.settingsPage}>
        <View style={styles.topPanel}>
          <View style={styles.topPanelTitle}>
            <Text style={styles.topPanelTitle}>Settings</Text>
          </View>
          <TouchableOpacity
            style={styles.cancelText}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ color: "#3f51b5" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.settingsList}>
          {!userProfile.subscription && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={openUpgradePopup}
            >
              <AntDesign name="Trophy" size={30} color="#3f51b5" />
              <Text style={styles.settingTitle}>Upgrade</Text>
              <Text style={styles.arrowIcon}>➔</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={openContactModal}
          >
            <MaterialIcons name="alternate-email" size={30} color="#3f51b5" />
            <Text style={styles.settingTitle}>Contact Us</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={openFeedbackForm}
          >
            <SimpleLineIcons name="envelope-letter" size={30} color="#3f51b5" />
            <Text style={styles.settingTitle}>Feedback</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={restoringPurchases}
          >
            <AntDesign name="creditcard" size={30} color="#3f51b5" />
            <Text style={styles.settingTitle}>Restore Purchase</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleOpenURL("https://birthdayaiapp.com/privacy")}
          >
            <AntDesign name="solution1" size={30} color="#3f51b5" />
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              handleOpenURL(
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              )
            }
          >
            <AntDesign name="filetext1" size={30} color="#3f51b5" />
            <Text style={styles.settingTitle}>Terms of Conditions</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;
