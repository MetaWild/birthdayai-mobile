import React, { useState, useContext } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import XLg from "react-native-bootstrap-icons/icons/x-lg";
import Pencil from "react-native-bootstrap-icons/icons/pencil";
import Calendar from "react-native-bootstrap-icons/icons/calendar";

import DataContext from "../data/data-context";
import styles from "./HomeStyles";

function Other(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const dataCtx = useContext(DataContext);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDelete = () => {
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };

  const now = new Date();
  let year = now.getFullYear();
  const [_, month, day] = props.item.date.split("-");
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
  let daysString = "days left";
  if (diffDays === 1) {
    daysString = "day left";
  } else if (diffDays === 0) {
    daysString = "today";
  }

  const handleDeleteClick = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dataCtx.user.accessToken}`, // Assuming you have user token in your context
      },
    };

    await fetch(
      `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/reminders/${props.item.id}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        dataCtx.deleteReminder(props.item.id);
        openModal();
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  return (
    <>
      <DeleteReminder
        isOpen={isDeleteOpen}
        onConfirm={handleDeleteClick}
        onCancel={closeDelete}
        isVisible={isDeleteOpen}
      />
      <ModalPopup
        onClose={closeModal}
        title="Reminder Deleted"
        message="Your reminder has been deleted."
        isVisible={isModalOpen}
      />
      <View style={styles.aiItem}>
        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.deleteButton} onPress={openDelete}>
            <XLg fill="#3f51b5" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              props.navigation.navigate("Edit", { id: props.item.id })
            }
          >
            <Pencil fill="#3f51b5" />
          </TouchableOpacity>
        </View>
        <View style={styles.svgAndBirthday}>
          <AntDesign name="calendar" size={35} color="#3f51b5" />
          <Text style={styles.aiBirthday}>{props.item.date}</Text>
        </View>
        <View style={styles.leftContent}>
          <Text style={styles.aiName}>{props.item.name}</Text>
        </View>
        <View style={styles.rightContent}>
          {diffDays !== 0 ? (
            <Text style={styles.aiDays}>{diffDays}</Text>
          ) : (
            <MaterialIcons name="local-fire-department" size={35} color="red" />
          )}
          <Text style={styles.aiDaysLeft}>{daysString}</Text>
        </View>
      </View>
    </>
  );
}

export default Other;
