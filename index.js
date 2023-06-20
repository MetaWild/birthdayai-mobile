import "react-native-gesture-handler";
import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import App from "./App";
import DataProvider from "./data/DataProvider";

function Main() {
  return (
    <React.StrictMode>
      <NavigationContainer>
        <DataProvider>
          <App />
        </DataProvider>
      </NavigationContainer>
    </React.StrictMode>
  );
}

registerRootComponent(Main);
