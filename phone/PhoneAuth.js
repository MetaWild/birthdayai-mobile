import { useRef, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image } from "react-native";
import { Card } from "react-native-paper";

import PhoneSignIn from "./PhoneSignIn";
import VerifyPhone from "./VerifyPhone";
import { auth, app } from "../firebase/firebaseConfig";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "@firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import ModalPopup from "../modal/ModalPopup";
import LoadingModal from "../loading/LoadingModal";
import DataContext from "../data/data-context";
import styles from "../login/LoginStyles";

export default function PhoneAuth() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [verificationWrong, setVerificationWrong] = useState(false);
  const navigation = useNavigation();
  const { loading, setLoading } = useContext(DataContext);

  const loginWithPhoneNumber = async (phoneNumber) => {
    const result = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier.current
    );
    setConfirmationResult(result);
    setIsVerifying(true);
  };

  const verifyCode = async (code) => {
    if (confirmationResult) {
      try {
        const userCredential = await confirmationResult.confirm(code);
        /*console.log("LOGGED IN HOORAY!", userCredential.user.uid);
      if (userCredential) {
        await fetch(`https://birthdayai.herokuapp.com/api/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userCredential._tokenResponse.idToken}`,
          },
          body: JSON.stringify({
            id: userCredential.user.uid,
            phoneNumber: userCredential.user.phoneNumber,
          }),
        }).then((response) => response.json()).then((data) => {
            let userProfile = { ...data.user };
            userProfile.reminders = Object.values(userProfile.reminders);
            setUserProfile(userProfile);
          }).catch((error) => {
            console.error("Error:", error);
          });
        navigation.navigate("Home");
      }*/
      } catch (error) {
        console.error("Error confirming code: ", error);
        setVerificationWrong(true); // Set verificationWrong state to true
      }
    } else {
      console.error("No confirmation result to verify code with");
    }
  };

  return isVerifying ? (
    <View>
      <ModalPopup
        isVisible={verificationWrong}
        onClose={() => setVerificationWrong(false)}
        title="Verification Failed"
        content="The verification code you entered is incorrect. Please try again."
      />
      <Card style={styles.loginContainer}>
        <Image
          style={styles.loginLogo}
          source={require("../assets/icon.png")}
        />
        <Text style={styles.welcomeText}>Welcome!</Text>
      </Card>
      <VerifyPhone
        onVerify={verifyCode}
        onVerificationRetry={() => {
          setConfirmationResult(null);
          setVerificationWrong(false);
          setIsVerifying(false);
        }}
      />
    </View>
  ) : (
    <View>
      <Card style={styles.loginContainer}>
        <Image
          style={styles.loginLogo}
          source={require("../assets/icon.png")}
        />
        <Text style={styles.welcomeText}>Welcome!</Text>
      </Card>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <PhoneSignIn onPhoneNumberSubmit={loginWithPhoneNumber} />
    </View>
  );
}
