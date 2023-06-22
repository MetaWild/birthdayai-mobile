import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import DataContext from "../data/data-context";
import styles from "./FeedbackFormStyles";

const FeedbackForm = ({ onClose, openModal, isVisible }) => {
  const [feedback, setFeedback] = useState("");

  const dataCtx = useContext(DataContext);

  const handleFeedbackChange = (text) => {
    if (text.length <= 500) {
      setFeedback(text);
    }
  };

  const handleSubmit = async () => {
    if (feedback.length >= 20) {
      await fetch(
        `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dataCtx.user.accessToken}`,
          },
          body: JSON.stringify({ feedback: feedback }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          openModal();
          onClose();
        })
        .catch((error) => {});
    } else {
      Alert.alert("Please provide at least 20 characters.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.feedbackFormContainer}>
        <View style={styles.feedbackFormModal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Feedback
          </Text>
          <TextInput
            style={styles.feedbackTextarea}
            value={feedback}
            onChangeText={handleFeedbackChange}
            minLength={20}
            placeholder="Please provide at least 20 characters."
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={{ color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackForm;
