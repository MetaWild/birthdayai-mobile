import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import ModalPopup from "../modal/ModalPopup";
import styles from "./EditReminderStyles";
import { useNavigation } from "@react-navigation/native";
import DataContext from "../data/data-context";

function useDidMount() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return didMount;
}

function EditReminder({ route }) {
  const didMount = useDidMount();
  const navigation = useNavigation();
  const dataCtx = useContext(DataContext);
  const userProfile = dataCtx.userProfile;
  const { id } = route.params;
  const editingReminder = userProfile.reminders.find(
    (reminder) => reminder.id === id
  );
  const [type, setType] = useState(
    editingReminder?.type.charAt(0).toUpperCase() +
      editingReminder?.type.slice(1).toLowerCase() || "Birthday"
  );
  const [name, setName] = useState(editingReminder?.name || "");
  const [date, setDate] = useState(
    editingReminder?.date
      ? new Date(editingReminder.date + "T00:00:00")
      : new Date()
  );
  const [relationship, setRelationship] = useState(
    editingReminder?.relationship.charAt(0).toUpperCase() +
      editingReminder?.relationship.slice(1).toLowerCase() || "Friend"
  );
  const [style, setStyle] = useState(
    editingReminder?.style.charAt(0).toUpperCase() +
      editingReminder?.style.slice(1).toLowerCase() || "Simple"
  );
  const [description, setDescription] = useState(
    editingReminder?.description || ""
  );
  const [card, setCard] = useState(editingReminder?.card || false);
  const [gift, setGift] = useState(editingReminder?.gift || false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [navigateHome, setNavigateHome] = useState(false);
  const [hasButton, setHasButton] = useState(false);

  useEffect(() => {
    if (didMount) {
      setRelationship("Friend");
      setStyle("Simple");
      setCard(false);
      setGift(false);
      setDescription("");
    }
  }, [type]);

  const types = userProfile.subscription
    ? ["Birthday", "Anniversary", "Holiday", "Other"]
    : ["Birthday"];

  const relationships = [
    "Friend",
    "Family",
    "Father",
    "Mother",
    "Uncle",
    "Aunt",
    "Cousin",
    "Grandfather",
    "Grandmother",
    "Brother",
    "Sister",
    "Son",
    "Daughter",
    "Nephew",
    "Niece",
    "Boyfriend",
    "Girlfriend",
    "Husband",
    "Wife",
    "Partner",
    "Co-worker",
    "Boss",
    "Teacher",
    "Student",
    "Neighbor",
    "Brother-in-law",
    "Sister-in-law",
    "Father-in-law",
    "Mother-in-law",
  ];

  const styleList = [
    "Simple",
    "Funny",
    "Romantic",
    "Sentimental",
    "Cheerful",
    "Warm",
    "Formal",
    "Casual",
    "Witty",
    "Inspirational",
    "Sincere",
    "Heartfelt",
    "Enthusiastic",
    "Youthful",
    "Nostalgic",
    "Playful",
    "Energetic",
    "Classy",
    "Sophisticated",
    "Motivational",
    "Creative",
    "Joyful",
  ];

  let nameText = "Name";
  if (type === "Holiday") {
    nameText = "Holiday";
  } else if (type === "Other") {
    nameText = "Event";
  }

  const openModal = (title, content, booleanButton = false, home = false) => {
    if (booleanButton !== hasButton) {
      setHasButton(booleanButton);
    }
    if (home !== navigateHome) {
      setNavigateHome(home);
    }
    setTitle(title);
    setContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function checkFormValidity() {
    if (name === "") {
      openModal("Form Error", "Please enter a name.");
      return false;
    }
    if (name.length > 20) {
      openModal("Form Error", "Name must be less than 20 characters.");
      return false;
    }
    if (date === "") {
      openModal("Form Error", "Please enter a date.");
      return false;
    }
    if (type === "Birthday") {
      if (relationship === "") {
        openModal("Form Error", "Please enter a relationship.");
        return false;
      }
    }
    if (type !== "Other") {
      if (style === "") {
        openModal("Form Error", "Please enter a style.");
        return false;
      }
    }
    if (gift) {
      if (description === "") {
        openModal("Form Error", "Please enter a description.");
        return false;
      }
      if (description.length > 150) {
        openModal(
          "Form Error",
          "Description must be less than 150 characters."
        );
        return false;
      }
    }
    return true;
  }

  async function handleEditReminder() {
    if (checkFormValidity()) {
      let parsedDate = new Date(date);
      let year = parsedDate.getFullYear();
      let month = parsedDate.getMonth() + 1;
      let day = parsedDate.getDate();

      let formattedMonth = month.toString().padStart(2, "0");
      let formattedDay = day.toString().padStart(2, "0");

      let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
      const newReminder = {
        id: id,
        name: name,
        relationship: relationship.toLowerCase(),
        date: formattedDate,
        type: type.toLowerCase(),
        description: description,
        card: card,
        gift: gift,
        style: style.toLowerCase(),
      };
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataCtx.user.accessToken}`,
        },
        body: JSON.stringify(newReminder),
      };

      await fetch(
        `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/reminders/${id}`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dataCtx.editReminder(newReminder);
          openModal(
            "Reminder Updated",
            "Your reminder has been updated.",
            false,
            true
          );
        })
        .catch((error) => {});
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <ModalPopup
          onClose={closeModal}
          title={title}
          content={content}
          hasButton={hasButton}
          navigateHome={navigateHome}
          isVisible={isModalOpen}
        />

        <View style={styles.topPanel}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textButtons}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topPanelTitle}>Edit Reminder</Text>
          <TouchableOpacity
            style={styles.rightIcons}
            onPress={handleEditReminder}
          >
            <Text style={styles.textButtons}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addReminderBody}>
          <Text style={styles.label}>Type of Reminder:</Text>
          <Picker
            style={styles.picker}
            itemStyle={{ height: 110, marginTop: -25 }}
            selectedValue={type}
            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
          >
            {types.map((rel, index) => (
              <Picker.Item key={index} label={rel} value={rel} />
            ))}
          </Picker>

          <Text style={styles.label}>{nameText}:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
          />

          <Text style={styles.label}>Date:</Text>
          <View style={styles.input}>
            <DateTimePicker
              value={date}
              mode={"date"}
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
            />
          </View>

          {type === "Birthday" && (
            <>
              <Text style={styles.label}>Relationship:</Text>
              <Picker
                style={styles.picker}
                itemStyle={{ height: 110, marginTop: -25 }}
                selectedValue={relationship}
                onValueChange={(itemValue, itemIndex) =>
                  setRelationship(itemValue)
                }
              >
                {relationships.map((rel, index) => (
                  <Picker.Item key={index} label={rel} value={rel} />
                ))}
              </Picker>
            </>
          )}

          {type !== "Other" && (
            <>
              <Text style={styles.label}>
                Style for AI Recommended Messages:
              </Text>
              <Picker
                style={styles.picker}
                itemStyle={{ height: 110, marginTop: -25 }}
                selectedValue={style}
                onValueChange={(itemValue, itemIndex) => setStyle(itemValue)}
              >
                {styleList.map((sty, index) => (
                  <Picker.Item key={index} label={sty} value={sty} />
                ))}
              </Picker>
            </>
          )}

          {userProfile.subscription && type !== "Other" && (
            <>
              <Text style={styles.label}>Add-Ons:</Text>
              <View style={styles.checkboxWrapper}>
                {(type === "Birthday" ||
                  type === "Anniversary" ||
                  type === "") && (
                  <View style={styles.checkboxContainer}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={gift ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(newValue) => setGift(newValue)}
                      value={gift}
                    />
                    <Text style={styles.checkboxLabel}>
                      Gift Recommendation
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {gift && (
            <>
              <Text style={styles.label}>Brief Description of Individual:</Text>
              <TextInput
                style={styles.description}
                onChangeText={(text) => setDescription(text)}
                value={description}
                placeholder="To help AI make better gift suggestions"
              />
            </>
          )}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleEditReminder}
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditReminder;
