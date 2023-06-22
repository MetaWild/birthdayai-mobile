import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";

import PastImage from "./PastImage";
import DataContext from "../data/data-context";
import styles from "./ImageGenerationStyles";

function PastGenerations({ onClose, isVisible }) {
  const dataCtx = useContext(DataContext);
  const userProfile = dataCtx.userProfile;
  const cards = userProfile.cards;

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
          <Text style={styles.upgradePopupTitle}>Past Generations</Text>
          <ScrollView style={styles.gallery}>
            {cards.map((card, index) => (
              <PastImage key={card.id} card={card} index={index} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default PastGenerations;
