import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Share,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

import ModalPopup from "../modal/ModalPopup";
import UpgradePopup from "../upgrade/UpgradePopup";
import PastGenerations from "./PastGenerations";
import LoadingModal from "../loading/LoadingModal";
import DataContext from "../data/data-context";
import styles from "./ImageGenerationStyles";

function ImageGeneration() {
  const [type, setType] = useState("Birthday");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [navigateHome, setNavigateHome] = useState(false);
  const [hasButton, setHasButton] = useState(false);
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPastGenerationModalOpen, setIsPastGenerationModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const types = ["Birthday", "Anniversary", "Holiday"];
  const dataCtx = useContext(DataContext);
  const userProfile = dataCtx.userProfile;
  const navigation = useNavigation();

  const openUpgradePopup = () => {
    setIsUpgradePopupOpen(true);
  };

  const closeUpgradePopup = () => {
    setIsUpgradePopupOpen(false);
  };

  const openPastGenerationModal = () => {
    setIsPastGenerationModalOpen(true);
  };

  const closePastGenerationModal = () => {
    setIsPastGenerationModalOpen(false);
  };

  const openLoadingModal = () => {
    setIsLoading(true);
  };

  const closeLoadingModal = () => {
    setIsLoading(false);
  };

  // This function will be used to show the SuccessModal
  const showSuccessModal = () => setIsSuccessModalOpen(true);

  // This function will be used to hide the SuccessModal
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

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
    if (type === "Holiday") {
      if (name === "") {
        openModal("Form Error", "Please enter a holiday.");
        return false;
      }
      if (name.length > 50) {
        openModal(
          "Form Error",
          "Holiday name must be less than 50 characters."
        );
        return false;
      }
    }
    return true;
  }

  async function handleAddCard() {
    if (checkFormValidity()) {
      if (!userProfile.subscription && userProfile.cards.length >= 0) {
        closeLoadingModal();
        openModal(
          "Upgrade Required",
          "This is a premium feature. Please upgrade to generate cards.",
          true,
          false
        );
      } else {
        const newCard = {
          id: uuidv4(),
          name: name,
          type: type.toLowerCase(),
          link: "",
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dataCtx.user.accessToken}`, // Assuming you have user token in your context
          },
          body: JSON.stringify(newCard),
        };

        try {
          const response = await fetch(
            `https://birthdayai.herokuapp.com/api/users/${dataCtx.user.uid}/cards`,
            requestOptions
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          dataCtx.addCard(data.card);

          closeLoadingModal();

          // Assuming data.card.link is a base64 encoded string
          /*const base64Image = data.card.link;

          console.log(base64Image);

          // Create a storage reference
          const profileImageRef = ref(
            storage,
            `userImages/${dataCtx.user.uid}/${data.card.id}.jpg`
          );

          // Upload the base64 string to Firebase Storage
          await uploadString(profileImageRef, base64Image, "base64");

          // Get the download URL
          const photoUrl = await getDownloadURL(profileImageRef);

          console.log(photoUrl);

          const responseImage = await fetch(data.card.link);
          const photoBlob = await responseImage.blob();

          const profileImageRef = ref(
            storage,
            `userImages/${dataCtx.user.uid}/${data.card.id}.jpg`
          );

          await uploadBytes(profileImageRef, photoBlob);
          const photoUrl = await getDownloadURL(profileImageRef);*/

          setImageLink(data.card.link);

          openModal("Card Generated", "Your card has been generated.");

          /*const requestOptionsLink = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${dataCtx.user.accessToken}`, // Assuming you have user token in your context
            },
            body: JSON.stringify({
              id: data.card.id,
              name: data.card.name,
              type: data.card.type,
              link: photoUrl,
            }),
          };

          const responseLink = await fetch(
            `${process.env.REACT_APP_backendUrl}/api/users/${dataCtx.user.uid}/cards/${data.card.id}`,
            requestOptionsLink
          );

          if (!responseLink.ok) {
            throw new Error("Network response was not ok");
          }

          const dataLink = await responseLink.json();
          dataCtx.editCard(dataLink.card);*/
        } catch (error) {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        }
      }
    }
  }

  const onLongPress = async () => {
    try {
      const result = await Share.share({
        url: imageLink,
        title: "Share this image",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <LoadingModal isVisible={isLoading} onClose={closeLoadingModal} />
      <PastGenerations
        isVisible={isPastGenerationModalOpen}
        onClose={closePastGenerationModal}
      />
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
        <View style={styles.leftIcon}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.textButtons}
          >
            <Text style={styles.textButtons}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.addReminderH1}>Generate Card</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.textButtons}
            onPress={() => {
              openLoadingModal();
              handleAddCard();
            }}
          >
            <Text style={styles.textButtons}>Generate</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.addReminderBody}>
        <Text style={styles.label}>Type of Card:</Text>
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
        {type === "Holiday" && (
          <>
            <Text style={styles.label}>Holiday:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter holiday name"
            />
          </>
        )}
        <View style={styles.imagePreview}>
          {imageLink ? (
            <TouchableOpacity onLongPress={onLongPress}>
              <Image
                source={{ uri: imageLink }}
                style={styles.imagePreviewImage}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={require("../assets/AICard.jpeg")}
              style={styles.imagePreviewImage}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            openLoadingModal();
            handleAddCard();
          }}
        >
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewPastButton}
          onPress={openPastGenerationModal}
        >
          <Text style={styles.buttonText}>View Past Generations</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default ImageGeneration;
