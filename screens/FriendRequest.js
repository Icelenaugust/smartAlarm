import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";

const myIcon = <Icon name="search" size={30} color="gray" />;

var user;

export default class FriendRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendMail: "",
      nameList: [],
      hashID: [],
      friendID: "",
      findFriend: true,
      isLoaded: false,
      foundFriend: false,
      emailArray: [],
    };
  }

  async componentDidMount() {
    user = await firebase.auth().currentUser;
    var usersRef = await firebase.database().ref("users/");
    if (!this.state.isLoaded) {
      usersRef.once("value", (snapshot) => {
        var curr = [];
        var hash = [];
        snapshot.forEach((childSnapshot) => {
          var pair = [];
          var userID = childSnapshot.key;
          var thegmail = childSnapshot.val().gmail;

          pair.push(thegmail);
          pair.push(userID);

          curr.push(thegmail);
          hash.push(pair);
          this.setState({ nameList: curr, hashID: hash });
        });
      });
      this.setState({ isLoaded: true });
    }
  }

  handleUsername = (value) => {
    this.setState({ friendMail: value });
  };

  handleSearch = () => {
    const temp = this.state.nameList.filter(
      (email) => email == this.state.friendMail
    );
    if (temp.length == 1) {
      this.setState({ foundFriend: true });
    }
    this.setState({ findFriend: false });
  };

  sendRequest = () => {
    this.setState({findFriend: true})
    this.setState({foundFriend: false})
    var friendId;
    for (var i = 0; i < this.state.hashID.length; i++) {
      const check = this.state.hashID[i];
      if (this.state.friendMail === check[0]) {
        this.setState({ friendID: check[1] });
        friendId = check[1];
      }
    }
    this.setState({friendMail: ""})

    // var gmailKey = firebase.database().ref().child('users')
    //                 .child('user.uid').child('gmail').push().key

    var requestRef = firebase
      .database()
      .ref(
        "/requests/" +
          "friendRequest/" +
          "requestUsers/" +
          friendId +
          "/request"
      );
    // var data = [];
    requestRef.once("value").then((snapshot) => {
      console.log("snap1", snapshot.val());
      var data = snapshot.val() === null ? [] : snapshot.val();
      data.push(user.email);
      console.log("snap2", data);

      this.updateRequest(friendId, data);
    });
  };

  updateRequest = (friendId, data) => {
    firebase
      .database()
      .ref("/requests" + "/friendRequest" + "/requestUsers/" + friendId)
      .update({
        request: data,
      })
      .then((snapshot) => {
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.lable}>Enter email address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleUsername}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.handleSearch()}
          >
            {myIcon}
          </TouchableOpacity>
        </View>
        {this.state.foundFriend && (
          <View style={styles.rowContainer}>
            <Text style={styles.name}>{this.state.friendMail}</Text>
            <TouchableOpacity
              style={styles.button}
            onPress={() => {this.sendRequest()}}
            >
              <Text style={styles.add}>+ Add friend</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.requestSent && (
          <Text style={styles.text}>Friend request sent!</Text>
        )}
        {!this.state.findFriend  && !this.state.foundFriend  && (
          <Text style={styles.text}>Username not found</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: '#e5e2f6',
    margin: 10,
    height: 45,
    width:'90%',
    padding: 8,
    borderRadius: 3

  },
  icon: {
    marginTop: 18,
  },
  name: {
    fontSize: 18,
    color: "#201b40",
  },
  button: {
    fontSize: 22,
    marginLeft: 20,
  },
  text: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
  add: {
    fontSize: 18,
    marginLeft: 15
  },
  lable: {
    fontSize: 18,
    marginRight: '48%',
    marginTop: 10,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1,
    borderRadius: 3,
    width: '80%',
    fontSize: 18,
  },
});
