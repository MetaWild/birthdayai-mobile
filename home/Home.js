import React, { useContext, useState, useEffect } from "react";
import { Text, View, Button, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Purchases from "react-native-purchases";
import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import GearFill from "react-native-bootstrap-icons/icons/gear-fill";
import PlusLg from "react-native-bootstrap-icons/icons/plus-lg";

import UpgradePopup from "../upgrade/UpgradePopup";
import ModalPopup from "../modal/ModalPopup";
import DataContext from "../data/data-context";
import Anniversary from "./Anniversary";
import Birthday from "./Birthday";
import Holiday from "./Holiday";
import Other from "./Other";
import styles from "./HomeStyles";

function calculateDiffDays(birthday) {
  const now = new Date();
  let year = now.getFullYear();
  const [_, month, day] = birthday.split("-");
  let nextBirthday = new Date(year, month - 1, day);

  let diffDays;
  // If today is the birthday
  if (
    now.getMonth() === nextBirthday.getMonth() &&
    now.getDate() === nextBirthday.getDate()
  ) {
    diffDays = 0;
  } else {
    // If the birthday has already passed this year, set to next year
    if (now > nextBirthday) {
      nextBirthday.setFullYear(year + 1);
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    diffDays = Math.floor(Math.abs((now - nextBirthday) / oneDay)) + 1;
  }

  return diffDays;
}

export default function Home() {
  let [success, setSuccess] = useState(false);
  let [failure, setFailure] = useState(false);
  const dataCtx = useContext(DataContext);
  const user = dataCtx.user;
  const userProfile = dataCtx.userProfile;
  const sessionId = dataCtx.sessionId;
  const setSessionId = dataCtx.setSessionId;
  const setUserProfile = dataCtx.setUserProfile;

  // Add the showUpgradePopup state variable
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const navigation = useNavigation();

  /*useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Birthday], // Add birthday field here if supported
        });

        if (data.length > 0) {
          const contactsWithBirthdays = data.map((contact) => {
            return {
              name: contact.name,
              birthday: contact.birthday, // This line may need to be changed depending on API support
            };
          });
          console.log(contactsWithBirthdays);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const birthdayCalendars = calendars.filter((calendar) =>
          calendar.title.toLowerCase().includes("birthday")
        );

        if (birthdayCalendars.length > 0) {
          const birthdayEvents = [];
          for (const calendar of birthdayCalendars) {
            const events = await Calendar.getEventsAsync(
              [calendar.id],
              new Date("1970-01-01T00:00:00.000Z"),
              new Date("2099-12-31T00:00:00.000Z")
            );
            const birthdays = events.filter((event) =>
              event.title.toLowerCase().includes("birthday")
            );
            birthdayEvents.push(...birthdays);
          }

          const birthdayData = birthdayEvents.map((event) => {
            return {
              title: event.title,
              startDate: event.startDate,
              endDate: event.endDate,
            };
          });
          console.log(birthdayData);
        }
      }
    })();
  }, []);*/

  /*useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("success")) {
      setSuccess(true);
      setSessionId(urlParams.get("session_id"));
    }

    if (urlParams.get("canceled")) {
      setFailure(true);
    }
  }, [sessionId]);*/

  const sortedReminders = [...userProfile.reminders].sort((a, b) => {
    const aDiffDays = calculateDiffDays(a.date);
    const bDiffDays = calculateDiffDays(b.date);

    return aDiffDays - bDiffDays;
  });

  // These functions will be used to toggle the UpgradePopup and SuccessModal
  const showPopup = () => setShowUpgradePopup(true);
  const closePopup = () => setShowUpgradePopup(false);
  const showSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  return (
    <View style={styles.container}>
      <ModalPopup
        onClose={() => setSuccess(false)}
        title="Congratulations!"
        content="You have successfully upgraded your account!"
        isVisible={success}
      />
      <ModalPopup
        onClose={() => setFailure(false)}
        title="Oops!"
        content="Something went wrong with your payment. Please try again."
        isVisible={failure}
      />
      <ModalPopup
        onClose={closeSuccessModal}
        title="Congratulations!"
        content="You have successfully upgraded your account!"
        isVisible={isSuccessModalOpen}
      />
      <UpgradePopup
        onClose={closePopup}
        openModal={showSuccessModal}
        isVisible={showUpgradePopup}
      />
      <View style={styles.topPanel}>
        {/* Settings button */}
        <View style={styles.leftIcon}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <FontAwesome name="gear" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Generate")}>
            <EvilIcons name="image" size={36} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.topPanelTitle}>BirthdayAI</Text>
        <View style={styles.rightIcons}>
          {!userProfile.subscription && (
            <TouchableOpacity style={styles.upgradeButton} onPress={showPopup}>
              <Text style={{ color: "#3f51b5" }}>Upgrade</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={async () => {
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
              navigation.navigate("Add");
            }}
          >
            <AntDesign name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.aiItems}>
        {sortedReminders.map((item) => {
          if (item.type === "birthday") {
            return (
              <Birthday navigation={navigation} item={item} key={item.id} />
            );
          } else if (item.type === "anniversary") {
            return (
              <Anniversary navigation={navigation} item={item} key={item.id} />
            );
          } else if (item.type === "holiday") {
            return (
              <Holiday navigation={navigation} item={item} key={item.id} />
            );
          } else {
            return <Other navigation={navigation} item={item} key={item.id} />;
          }
        })}
        {!userProfile.subscription && (
          <Text style={styles.aiUpgradeText}>
            Add up to 5 reminders or upgrade to get more!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
