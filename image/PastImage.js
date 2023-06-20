import React, { useState, useContext } from "react";
import { View, TouchableOpacity, Image, Share } from "react-native";
import XLg from "react-native-bootstrap-icons/icons/x-lg";
import * as FileSystem from "expo-file-system";
//import * as MediaLibrary from "expo-media-library";
import ModalPopup from "../modal/ModalPopup";

import DeleteReminder from "../delete/DeleteReminder";
import DataContext from "../data/data-context";
import styles from "./ImageGenerationStyles"; // Assuming you have converted your CSS to RN styles

function PastImage(props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const dataCtx = useContext(DataContext);

  const openDelete = () => {
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };

  function handleDelete() {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dataCtx.user.accessToken}`,
      },
    };

    fetch(
      `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/cards/${props.card.id}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        dataCtx.deleteCard(props.card.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  /*const onLongPress = async () => {
    try {
      // Download the image to the device's cache directory
      const { uri: localUri } = await FileSystem.downloadAsync(
        props.card.link,
        FileSystem.cacheDirectory + "image.jpg"
      );

      // Request permission to access the media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Save the image to the media library
        await MediaLibrary.saveToLibraryAsync(localUri);
        alert("Image saved to photo library");
      } else {
        setIsSettingsModalOpen(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };*/

  return (
    <>
      <ModalPopup
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Permission Denied"
        content="Please enable access to the media library in your settings."
        hasLinkToSettings={true}
      />
      <DeleteReminder
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onCancel={closeDelete}
        isVisible={isDeleteOpen}
      />
      <View key={props.card.id} style={styles.card}>
        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.deleteButton} onPress={openDelete}>
            <XLg fill="#3f51b5" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onLongPress={onLongPress}
          style={{
            flexGrow: 1,
          }}
        >
          <Image
            source={{ uri: props.card.link }}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default PastImage;
