import React, { useContext, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Purchases from "react-native-purchases";

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
  if (
    now.getMonth() === nextBirthday.getMonth() &&
    now.getDate() === nextBirthday.getDate()
  ) {
    diffDays = 0;
  } else {
    if (now > nextBirthday) {
      nextBirthday.setFullYear(year + 1);
    }

    const oneDay = 24 * 60 * 60 * 1000;
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
  const setUserProfile = dataCtx.setUserProfile;

  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const navigation = useNavigation();

  const sortedReminders = [...userProfile.reminders].sort((a, b) => {
    const aDiffDays = calculateDiffDays(a.date);
    const bDiffDays = calculateDiffDays(b.date);

    return aDiffDays - bDiffDays;
  });

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
              let isPremium = false;

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
