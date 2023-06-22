import { useContext } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Purchases from "react-native-purchases";

import DataContext from "../data/data-context";
import Alarm from "react-native-bootstrap-icons/icons/alarm";
import Tree from "react-native-bootstrap-icons/icons/tree";
import XCircle from "react-native-bootstrap-icons/icons/x-circle";
import Gift from "react-native-bootstrap-icons/icons/gift";
import Postcard from "react-native-bootstrap-icons/icons/card-image";
import styles from "./UpgradeStyles";

function UpgradePopup({ onClose, openModal, isVisible }) {
  const dataCtx = useContext(DataContext);
  const currentOffering = dataCtx.currentOffering;

  const handleButtonClick = () => {
    handleUpgrade();
  };

  async function handleUpgrade() {
    const packageToPurchase = currentOffering.availablePackages[0];
    try {
      const { customerInfo, productIdentifier } =
        await Purchases.purchasePackage(packageToPurchase);
      if (customerInfo.entitlements.active.premium === true) {
        openModal();
      }
    } catch (err) {}
    onClose();
  }
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
              AI-personalized birthday/event cards
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
