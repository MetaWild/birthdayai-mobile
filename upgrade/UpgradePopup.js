import { useContext, useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";

import DataContext from "../data/data-context";
import Alarm from "react-native-bootstrap-icons/icons/alarm";
import Tree from "react-native-bootstrap-icons/icons/tree";
import XCircle from "react-native-bootstrap-icons/icons/x-circle";
import Gift from "react-native-bootstrap-icons/icons/gift";
import Postcard from "react-native-bootstrap-icons/icons/card-image";
import styles from "./UpgradeStyles";

/*const APIKeys = {
  apple: "appl_CLXcyXZXpHXWTrVbsXPkUQnYbGq",
  google: "goog_TpfBgsKxUSQNbPzHcylfNAeoQfV",
};*/

function UpgradePopup({ onClose, openModal, isVisible }) {
  const dataCtx = useContext(DataContext);
  const setUserProfile = dataCtx.setUserProfile;
  const userProfile = dataCtx.userProfile;
  const user = dataCtx.user;
  const currentOffering = dataCtx.currentOffering;
  //const [currentOffering, setCurrentOffering] = useState(null);

  /*useEffect(() => {
    const fetchData = async () => {
      const offerings = await Purchases.getOfferings();
      console.log(offerings);
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setCurrentOffering(offerings.current);
      }
    };

    Purchases.setDebugLogsEnabled(true);
    if (Platform.OS == "android") {
      Purchases.configure({ apiKey: APIKeys.google, appUserID: user.uid });
      fetchData().catch(console.log);
    } else {
      Purchases.configure({ apiKey: APIKeys.apple, appUserID: user.uid });
      fetchData().catch(console.log);
    }
  }, []);

  useEffect(() => {
    const removeListener = Purchases.addPurchaserInfoUpdateListener((info) => {
      const isPremium = info.entitlements.active.premium === true;
      if (userProfile && userProfile.subscription !== isPremium) {
        setUserProfile((prevState) => {
          return {
            ...prevState,
            subscription: isPremium,
          };
        });
      }
    });

    return removeListener; // Cleanup subscription on unmount
  }, []);*/

  // Event handler for the button click
  const handleButtonClick = () => {
    handleUpgrade();
  };

  async function handleUpgrade() {
    const packageToPurchase = currentOffering.availablePackages[0]; // Select the package here
    try {
      const { customerInfo, productIdentifier } =
        await Purchases.purchasePackage(packageToPurchase);
      // Update subscription status based on successful purchase
      if (customerInfo.entitlements.active.premium === true) {
        openModal();
      }
    } catch (err) {
      console.log(err.message, err.code);
    }
    onClose();
  }

  /*async function handleUpgrade() {
    await fetch(
      `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/subscribe`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataCtx.user.accessToken}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUserProfile((prevState) => {
          return {
            ...prevState,
            subscription: true,
          };
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    openModal();
    onClose();
  }*/
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.upgradePopupOverlay}>
        <View style={styles.upgradePopup}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.upgradePopupTitle}>Upgrade to Premium</Text>
          <View style={styles.upgradeFeature}>
            <Alarm style={styles.featureIcon} fill="#3f51b5" />
            <Text style={{ fontSize: 16 }}>Unlimited Reminders</Text>
          </View>
          <View style={styles.upgradeFeature}>
            <Tree style={styles.featureIcon} fill="#3f51b5" />
            <Text style={{ fontSize: 16 }}>
              Add anniversaries, holidays and more
            </Text>
          </View>
          <View style={styles.upgradeFeature}>
            <XCircle style={styles.featureIcon} fill="#3f51b5" />
            <Text style={{ fontSize: 16 }}>Ad-Free Experience</Text>
          </View>
          <View style={styles.upgradeFeature}>
            <Gift style={styles.featureIcon} fill="#3f51b5" />
            <Text style={{ fontSize: 16 }}>AI-curated gift suggestions</Text>
          </View>
          <View style={styles.upgradeFeature}>
            <Postcard style={styles.featureIcon} fill="#3f51b5" />
            <Text style={{ fontSize: 16 }}>
              AI-personalized birthday/event cards(v1.0)
            </Text>
          </View>
          <Text style={styles.upgradeCost}>$2.99/month</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleButtonClick}
          >
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default UpgradePopup;
