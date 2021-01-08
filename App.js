import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import * as firebase from "firebase";
import { firebaseConfig } from "./config/firebaseConfig";
firebase.initializeApp(firebaseConfig);

import Home from "./screens/Home";
import Alarm from "./screens/Alarm";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Friends from "./screens/Friends";
import FriendRequest from "./screens/FriendRequest";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Alarm" component={Alarm} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="FriendRequest" component={FriendRequest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
