import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";

const config = {
  behavior: "web",
  iosClientId:
    "269033281750-360ccmpd1k2il63jp9np28oe9fetri8n.apps.googleusercontent.com",
  scopes: ["profile", "email"],
};

export default class Login extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.uid
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
              console.log("user signed in ");
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now(),
                  })
                  .then((snapshot) => {
                    // console.log("Snapshot", snapshot);
                  });
                  var emailList = [result.user.email];
                  firebase
                  .database()
                  .ref("/requests" + "/friendRequest" + "/requestUsers/" + result.user.uid)
                  .set({
                    //[result.user.uid]: [result.user.email]
                    request: emailList
                  })
                  .then((snapshot) => {
                    //console.log("Snapshot", snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .update({
                    last_logged_in: Date.now(),
                  });
              }
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      })
      .bind(this);
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync(config);

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  render() {
    return (

      <View style={styles.container}>
      <ImageBackground
        style={styles.backgrd}
        source={require("../images/loginBoy.png")}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.signInWithGoogleAsync().then(() =>
              this.props.navigation.navigate("Profile")
            );
          }}
        >

          <Text style={styles.text}>Sign In With Google</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Profile")}
        >
          <Text style={styles.text}>Goto Profile Page</Text>

        </TouchableOpacity>
      </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#afa9cf",
    flex: 1,
  },

  backgrd: {
    width: Dimensions.get("window").width,
    height: "100%",
    alignItems: "center",
    //justifyContent: "center",
  },

  button: {
    width: 330,
    height: 50,
    backgroundColor: "#e5e2f6",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    top: 100

  },

  text: {
    fontSize: 22,
    color: "#201b40",
    textAlign: "center",
    fontFamily: "Chalkduster",
  },
});
