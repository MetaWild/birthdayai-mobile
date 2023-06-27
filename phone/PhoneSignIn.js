import * as React from "react";
import { Button, TextInput, DefaultTheme, Text } from "react-native-paper";
import { Linking } from "react-native";

export default function PhoneSignIn({ onPhoneNumberSubmit }) {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [validPhoneNumber, setValidPhoneNumber] = React.useState(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#3f51b5",
      underlineColor: "transparent",
      background: "#00000000",
    },
  };

  const onChangePhoneNumber = (text) => {
    let cleaned = text.replace(/\D/g, "");
    let formatted = " ";
    if (text.length < phoneNumber.length) {
      if (
        text.endsWith(" ") ||
        text.endsWith("-") ||
        text.endsWith("(") ||
        text.endsWith(")")
      ) {
        setPhoneNumber(text.slice(0, text.length - 1));
      } else {
        setPhoneNumber(text);
      }
    } else {
      if (cleaned.length >= 1) formatted += "(";
      if (cleaned.length >= 1) formatted += cleaned.slice(0, 3);
      if (cleaned.length >= 3) formatted += ") ";
      if (cleaned.length >= 4) formatted += cleaned.slice(3, 6);
      if (cleaned.length >= 6) formatted += "-";
      if (cleaned.length >= 6) formatted += cleaned.slice(6, 10);
      setPhoneNumber(formatted);
    }

    cleaned = formatted.replace(/\D/g, "");

    setValidPhoneNumber(cleaned.length === 10);
  };

  const handleOpenURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
      }
    });
  };

  return (
    <>
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={onChangePhoneNumber}
        style={{ margin: 20 }}
        theme={theme}
        left={<TextInput.Affix text="+1" />}
      />
      <Button
        mode="contained"
        disabled={!validPhoneNumber}
        buttonColor="#3f51b5"
        onPress={() => {
          let submittedNumber = "+1" + phoneNumber.replace(/\D/g, "");
          onPhoneNumberSubmit(submittedNumber);
        }}
        style={{ margin: 20 }}
      >
        Sign In
      </Button>
      <Text style={{ margin: 20, textAlign: "center" }}>
        By clicking Sign In you are consenting to the{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() =>
            handleOpenURL(
              "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            )
          }
        >
          Terms of Conditions
        </Text>{" "}
        and the{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => handleOpenURL("https://birthdayaiapp.com/privacy")}
        >
          Privacy Policy
        </Text>{" "}
        of BirthdayAI
      </Text>
    </>
  );
}
