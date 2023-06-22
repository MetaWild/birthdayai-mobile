import React, { useContext } from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PhoneAuth from "./phone/PhoneAuth";
import Home from "./home/Home";
import AddReminder from "./add/AddReminder";
import EditReminder from "./edit/EditReminder";
import Settings from "./settings/Settings";
import ImageGeneration from "./image/ImageGeneration";
import DataContext from "./data/data-context";
import styles from "./AppStyles";

const Stack = createNativeStackNavigator();

function App() {
  const dataCtx = useContext(DataContext);
  const isAuthChecked = dataCtx.isAuthChecked;
  const isDataFetched = dataCtx.isDataFetched;

  if (!isAuthChecked) return null;

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login"
      >
        {isDataFetched ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Add" component={AddReminder} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Edit" component={EditReminder} />
            <Stack.Screen name="Generate" component={ImageGeneration} />
          </>
        ) : (
          <Stack.Screen name="Login" component={PhoneAuth} />
        )}
      </Stack.Navigator>
    </View>
  );
}

export default App;
