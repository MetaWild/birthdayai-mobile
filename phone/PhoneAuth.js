import { useRef, useState, useContext } from "react";
import { View, Image } from "react-native";
import { Card } from "react-native-paper";
import { signInWithPhoneNumber } from "@firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

import PhoneSignIn from "./PhoneSignIn";
import VerifyPhone from "./VerifyPhone";
import { auth, app } from "../firebase/firebaseConfig";
import ModalPopup from "../modal/ModalPopup";
import LoadingModal from "../loading/LoadingModal";
import DataContext from "../data/data-context";
import styles from "../login/LoginStyles";

export default function PhoneAuth() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [verificationWrong, setVerificationWrong] = useState(false);
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
        setLoading(true);
      } catch (error) {
        setVerificationWrong(true);
      }
    } else {
    }
  };

  return isVerifying ? (
    <View>
      <LoadingModal isVisible={loading} onClose={() => setLoading(false)} />
      <ModalPopup
        isVisible={verificationWrong}
        onClose={() => setVerificationWrong(false)}
        title="Verification Failed"
        content="The verification code you entered is incorrect. Please try again."
      />
      <Card style={styles.loginContainer}>
        <Image
          style={styles.loginLogo}
          source={require("../assets/BirthdayAIBanner.jpg")}
        />
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
          source={require("../assets/BirthdayAIBanner.jpg")}
        />
      </Card>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <PhoneSignIn onPhoneNumberSubmit={loginWithPhoneNumber} />
    </View>
  );
}
