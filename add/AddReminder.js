import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
  ActionSheetIOS,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigation } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import { MaterialIcons } from "@expo/vector-icons";

import UpgradePopup from "../upgrade/UpgradePopup";
import ModalPopup from "../modal/ModalPopup";
import DataContext from "../data/data-context";
import styles from "./AddReminderStyles";

function AddReminder() {
  const [type, setType] = useState("Birthday");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [relationship, setRelationship] = useState("Friend");
  const [style, setStyle] = useState("Simple");
  const [description, setDescription] = useState("");
  const [card, setCard] = useState(false);
  const [gift, setGift] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [navigateHome, setNavigateHome] = useState(false);
  const [hasButton, setHasButton] = useState(false);
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [contactsList, setContactsList] = useState([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarList, setCalendarList] = useState([]);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvList, setCsvList] = useState([]);

  const navigation = useNavigation();
  const dataCtx = useContext(DataContext);
  const userProfile = dataCtx.userProfile;

  useEffect(() => {
    setRelationship("Friend");
    setStyle("Simple");
    setCard(false);
    setGift(false);
    setDescription("");
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

  const openUpgradePopup = () => {
    setIsUpgradePopupOpen(true);
  };

  const closeUpgradePopup = () => {
    setIsUpgradePopupOpen(false);
  };

  // This function will be used to show the SuccessModal
  const showSuccessModal = () => setIsSuccessModalOpen(true);

  // This function will be used to hide the SuccessModal
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  // This function will be used to show the SettingsModal
  const showSettingsModal = () => setIsSettingsModalOpen(true);

  // This function will be used to hide the SettingsModal
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

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

  async function handleAddReminder() {
    if (checkFormValidity()) {
      if (!userProfile.subscription && userProfile.reminders.length >= 5) {
        openModal(
          "Upgrade Required",
          "You have reached the maximum number of reminders. Please upgrade to add more reminders.",
          true,
          false
        );
      } else {
        let parsedDate = new Date(date);
        let year = parsedDate.getFullYear();
        let month = parsedDate.getMonth() + 1;
        let day = parsedDate.getDate();

        let formattedMonth = month.toString().padStart(2, "0");
        let formattedDay = day.toString().padStart(2, "0");

        let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
        const newReminder = {
          id: uuidv4(),
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dataCtx.user.accessToken}`, // Assuming you have user token in your context
          },
          body: JSON.stringify(newReminder),
        };

        await fetch(
          `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/reminders`,
          requestOptions
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            dataCtx.addReminder(newReminder);
            openModal(
              "Reminder Added",
              "Your reminder has been added.",
              false,
              true
            );
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          });
      }
    }
  }

  async function handleImportCalendar() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const allEvents = [];

      const currentYear = new Date().getFullYear(); // Get the current year
      const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`); // Start of current year
      const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`); // End of current year

      for (const calendar of calendars) {
        const events = await Calendar.getEventsAsync(
          [calendar.id],
          startDate,
          endDate
        );
        allEvents.push(...events);
      }

      const eventData = allEvents.map((event) => {
        return {
          name: event.title,
          date: event.startDate,
        };
      });

      setCalendarList(eventData);
      setIsCalendarModalOpen(true);
    } else {
      showSettingsModal();
    }
  }

  async function handleImportContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Birthday], // Add birthday field here if supported
      });

      if (data.length > 0) {
        const contactsWithBirthdays = data
          .map((contact) => {
            return {
              name: contact.name,
              birthday: contact.birthday, // This line may need to be changed depending on API support
            };
          })
          .filter((contact) => contact.birthday !== undefined);
        setContactsList(contactsWithBirthdays);
        setIsContactsModalOpen(true);
      }
    } else {
      showSettingsModal();
    }
  }

  async function handleImportCSV() {
    try {
      // Pick a document
      const document = await DocumentPicker.getDocumentAsync({
        type: "text/csv", // Only allows picking of CSV files
      });

      // Check if a document was picked and not cancelled
      if (document.type === "success") {
        const csvContent = await FileSystem.readAsStringAsync(document.uri);
        const results = Papa.parse(csvContent, {
          header: true, // Indicate that the CSV file contains a header
          dynamicTyping: true, // Convert strings to their native types
          skipEmptyLines: true, // Skip empty lines
        });

        // Check for errors during parsing
        if (results.errors.length > 0) {
          openModal(
            "CSV Error",
            "There was an error parsing your CSV file. Please check your file and try again."
          );
          return;
        }

        // Process data
        const processedData = results.data.map((row) => {
          // Set default event type if not specified
          if (
            !row["Event Type"] ||
            (row["Event Type"] !== "Birthday" &&
              row["Event Type"] !== "Anniversary" &&
              row["Event Type"] !== "Other" &&
              row["Event Type"] !== "Holiday")
          ) {
            row["Event Type"] = "Birthday";
          }

          // Convert day, month, and year into a date object
          if (row["Day"] && row["Month"]) {
            if (row["Year"]) {
              row["Date"] = new Date(row["Year"], row["Month"] - 1, row["Day"]);
            } else {
              row["Date"] = new Date(1970, row["Month"] - 1, row["Day"]); // Use 1970 as default year
            }
          }

          return row;
        });

        const finalData = processedData.map((row) => {
          const newReminder = {
            name: row["First Name"] + " " + row["Last Name"],
            event: row["Event Type"],
            date: row["Date"],
          };
          return newReminder;
        });
        setCsvList(finalData);
        setIsCsvModalOpen(true);
      } else if (document.type === "cancel") {
      } else {
        openModal("Import Error", "There was an error importing your file.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <ModalPopup
          onClose={closeSettingsModal}
          title="Permission not granted"
          content="This application needs access in order to import birthdays. Please grant the permission from your settings."
          isVisible={isSettingsModalOpen}
          hasLinkToSettings={true}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isContactsModalOpen}
          onRequestClose={() => {
            setIsContactsModalOpen(!isContactsModalOpen);
          }}
        >
          <View style={styles.modalFormContainer}>
            <View style={styles.modalFormModal}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Select a contact:
              </Text>
              <ScrollView style={styles.userList}>
                {contactsList.map((user, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.userListItem}
                    onPress={() => {
                      setName(user.name);
                      const { year, month, day } = user.birthday; // Destructure the birthday object
                      setDate(new Date(year, month, day)); // Create a new Date object
                      setIsContactsModalOpen(false);
                    }}
                  >
                    <Text>{user.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => setIsContactsModalOpen(false)}
              />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCalendarModalOpen}
          onRequestClose={() => {
            setIsCalendarModalOpen(!isCalendarModalOpen);
          }}
        >
          <View style={styles.modalFormContainer}>
            <View style={styles.modalFormModal}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Select an event:
              </Text>
              <ScrollView style={styles.userList}>
                {calendarList.map((user, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.userListItem}
                    onPress={() => {
                      setName(user.name); // Destructure the birthday object
                      setDate(new Date(Date.parse(user.date))); // Create a new Date object
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <Text>{user.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => setIsCalendarModalOpen(false)}
              />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCsvModalOpen}
          onRequestClose={() => {
            setIsCsvModalOpen(!isCsvModalOpen);
          }}
        >
          <View style={styles.modalFormContainer}>
            <View style={styles.modalFormModal}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Select an event:
              </Text>
              <ScrollView style={styles.userList}>
                {csvList.map((user, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.userListItem}
                    onPress={() => {
                      setName(user.name); // Destructure the birthday object
                      setDate(new Date(Date.parse(user.date))); // Create a new Date object
                      setType(user.event);
                      setIsCsvModalOpen(false);
                    }}
                  >
                    <Text>{user.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Close" onPress={() => setIsCsvModalOpen(false)} />
            </View>
          </View>
        </Modal>
        <ModalPopup
          onClose={closeSuccessModal}
          title="Congratulations!"
          content="You have successfully upgraded your account!"
          isVisible={isSuccessModalOpen}
        />
        <UpgradePopup
          onClose={closeUpgradePopup}
          openModal={showSuccessModal}
          isVisible={isUpgradePopupOpen}
        />
        <ModalPopup
          onClose={closeModal}
          isVisible={isModalOpen}
          title={title}
          content={content}
          hasButton={hasButton}
          navigateHome={navigateHome}
          openUpgradePopup={openUpgradePopup}
        />
        <View style={styles.topPanel}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.textButtons}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topPanelTitle}>Add Reminder</Text>
          <TouchableOpacity
            style={styles.rightIcons}
            onPress={handleAddReminder}
          >
            <Text style={styles.textButtons}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addReminderBody}>
          <Text style={styles.label}>Import from:</Text>
          <View style={styles.import}>
            <TouchableOpacity
              style={styles.textButtons}
              onPress={handleImportCSV}
            >
              <View style={styles.importButton}>
                <Text style={{ color: "#fff" }}>CSV</Text>
                <MaterialIcons name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textButtons}
              onPress={handleImportContacts}
            >
              <View style={styles.importButton}>
                <Text style={{ color: "#fff" }}>Contacts</Text>
                <MaterialIcons name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textButtons}
              onPress={handleImportCalendar}
            >
              <View style={styles.importButton}>
                <Text style={{ color: "#fff" }}>Calendar</Text>
                <MaterialIcons name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Type of Reminder:</Text>
          <Picker
            style={styles.picker}
            itemStyle={{ height: 110, marginTop: -25 }}
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            mode="dropdown"
          >
            {types.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
          <Text style={styles.label}>{nameText}:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
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
                onValueChange={(itemValue) => setRelationship(itemValue)}
              >
                {relationships.map((relationship, index) => (
                  <Picker.Item
                    key={index}
                    label={relationship}
                    value={relationship}
                  />
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
                selectedValue={style}
                itemStyle={{ height: 110, marginTop: -25 }}
                onValueChange={(itemValue) => setStyle(itemValue)}
              >
                {styleList.map((style, index) => (
                  <Picker.Item key={index} label={style} value={style} />
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
                placeholder="To help AI make better gift suggestions"
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </>
          )}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAddReminder}
          >
            <Text style={{ color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AddReminder;
