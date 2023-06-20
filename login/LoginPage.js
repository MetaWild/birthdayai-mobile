import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./LoginStyles";
import firebase from "firebase/app";
import "firebase/auth";

const LoginPage = () => {
  // TODO: configure Firebase Auth SDK

  return (
    <View style={styles.loginBody}>
      <View style={styles.loginContainer}>
        <Image
          style={styles.loginLogo}
          source={require("../assets/icon.png")}
        />
        <Text style={styles.welcomeText}>Welcome!</Text>
        {/* TODO: create your custom login component */}
      </View>
    </View>
  );
};

export default LoginPage;
