import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import firebase from "firebase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import Icon from "react-native-vector-icons/FontAwesome";

var updatedURI;
var hasUpdated = false;
const myIcon = <Icon name="users" size={30} color="gray" />;


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token.data);
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      firebase
        .database()
        .ref("users/" + this.currentUser.uid + "/push_token")
        .set(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };
  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    this.setState({ user: this.currentUser, isLoading: false });
    this.retrieveName(this.currentUser);
    this.retrievePic(this.currentUser);
    await this.registerForPushNotificationsAsync();
  }

  // handleFriendReq  = () => {

  // }

  countFriends(user) {
    var someRef = (firebase
      .database()
      .ref("/users/" + user.uid + '/friends/'));

      someRef.once("value").then((snapshot) => {
          var data = snapshot.val();

          if (data == null) {
              return 0;
          } else {
              return data.length;
          }
  });
}



  writeUserData(userId, imageUrl) {
    firebase
      .database()
      .ref("users/" + userId)
      .update({
        profile_picture: imageUrl,
      });
    this.setState({ profile_image: imageUrl });
  }

  uploadImage = async (imageUri) => {
    const path = `users/${this.uid}/profile_picture_uri`;

    return new Promise(async (res, rej) => {
      const response = await fetch(imageUri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  updateProfilePic = async (user) => {
    hasUpdated = true;
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.cancelled) {
          updatedURI = result.uri;
          // console.log(result);
          const url = await this.uploadImage(updatedURI);
          this.writeUserData(user.uid, url);
        }
      }
    }
  };

  retrievePic = (user) => {
    firebase
      .database()
      .ref("users/" + user.uid + "/profile_picture")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        this.setState({ profile_image: data });
      });
  };

  retrieveName = (user) => {
    console.log(user);
    firebase
      .database()
      .ref("users/" + user.uid + "/first_name")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        this.setState({ user_name: data });
      });
  };

  render() {
    var user = this.state.user;



    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("AcceptRequest")}>
          {myIcon}
          </TouchableOpacity>
        </View>
        <View style={{ alignSelf: "center", marginTop: "20%" }}>
          <View style={styles.profileImage}>
            <Image
              source={
                user
                  ? { url: this.state.profile_image }
                  : require("../images/no-profile-pic.jpg")
              }
              style={styles.image}
              resizeMode="cover"
            ></Image>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
            {user ? this.state.user_name : "No User"}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            {/* <Text style={[styles.text, { fontSize: 24 }]}>30</Text> */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("QuestionForm")}
            >
              <Text style={styles.text}>Question Form</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("QuestionBank")}
            >
              <Text style={styles.text}>Question Bank</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Friends")}
            >
              <Text style={[styles.text, { fontSize: 24 }]}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("FriendRequest")}
            >
              <Text style={[styles.text, { fontSize: 24 }]}>Add Friends</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignSelf: "center", margin: 10 }}>
          <Button
            title="Change Profile Picture"
            onPress={() => this.updateProfilePic(user)}
          />
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  icon: {
    justifyContent: 'flex-end',
    marginLeft: '85%',
    marginTop: '3%',
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: '#e5e2f6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
    marginTop: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },

  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
});
