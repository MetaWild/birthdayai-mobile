import React, { useState, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import XLg from "react-native-bootstrap-icons/icons/x-lg";
import Pencil from "react-native-bootstrap-icons/icons/pencil";

import DeleteReminder from "../delete/DeleteReminder";
import ModalPopup from "../modal/ModalPopup";
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
        Authorization: `Bearer ${dataCtx.user.accessToken}`,
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
      .catch((error) => {});
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
