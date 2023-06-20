import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "./DeleteReminderStyles"; // assuming styles file is in the same directory and named as 'styles.js'

const DeleteReminder = ({ isOpen, onConfirm, onCancel, isVisible }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeading}>
            Are you sure you want to Delete?
          </Text>
          <View style={styles.modalButtonGroup}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={{ color: "white" }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={{ color: "white" }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteReminder;
