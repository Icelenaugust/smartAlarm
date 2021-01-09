import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import Icon from "react-native-vector-icons/FontAwesome";

var user;
const tick = <Icon name="check" size={30} color="red" />;
const cross = <Icon name="times" size={30} color="green" />;

export default class AcceptRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailArray: [],
      isLoaded: false,
    };
  }

  async componentDidMount() {
    user = await firebase.auth().currentUser;
  }

  acceptFriend(email, user) {
    this.rejectFriend(email, user);
    var emailList = [email];

    var someRef = firebase.database().ref("/users/" + user.uid + "/friends/");

    someRef.once("value").then((snapshot) => {
      var data = snapshot.val();

      if (data == null) {
        firebase
          .database()
          .ref("/users/" + user.uid)
          .update({
            friends: [{ email: email, user: user.uid }],
          });
      } else {
        data.push(email);
        this.handleAccept(user, data);
      }
    });
  }

  handleAccept = (user, data) => {
    // console.log(this.state.emailArray);
    firebase
      .database()
      .ref("/users/" + user.uid + "/friends/")
      .update({
        friends: data,
      })
      .then((snapshot) => {
        // console.log("Snapshot", snapshot);
      });
  };

  rejectFriend(email, user) {
    const included = [...this.state.emailArray];
    const index = included.findIndex((res) => res == email);
    included.splice(index, 1);
    //this.setState({emailArray: included})

    var requestRef = firebase
      .database()
      .ref(
        "/requests/" +
          "friendRequest/" +
          "requestUsers/" +
          user.uid +
          "/request"
      );
    console.log(included);

    this.handleReject(user.uid, included);
  }

  handleReject(uid, array) {
    firebase
      .database()
      .ref("/requests" + "/friendRequest" + "/requestUsers/" + uid)
      .set({
        request: array,
      })
      .then((snapshot) => {
        // console.log("Snapshot", snapshot);
      });
    }
        
    render() {
        var user = firebase.auth().currentUser;
        if (!this.state.isLoaded) {
            var requestRef = firebase.database().ref(
                "/requests/" +
            "friendRequest/" +
            "requestUsers/" +
            user.uid +
            "/request");

            requestRef.once("value").then((snapshot) => {
            
                var data = snapshot.val() === null ? [] : snapshot.val();
                this.setState({emailArray: data})
                //   this.setState({ emailArray: data });
                // console.log("helloooo", data)
            });
            this.setState({isLoaded: true})

        }

        return(
            <View style={styles.container}>
                <ScrollView>
                    {this.state.emailArray.filter(e => e != user.email).map((item) => {
                        return (
                            <View style={styles.itembox}>
                                <Text style={styles.item}>{item}</Text>
                                {/* <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('Alarm')}
                                >
                                    <Text style={styles.text}>Request
                                    </Text>
                                </TouchableOpacity> */}
                                <View style={styles.iconbox}>
                                    <TouchableOpacity value={item} style={styles.icon}
                                    onPress={()=> {this.acceptFriend(item, user)
                                    && this.props.navigation.navigate("Profile")}}>
                                        {tick}
                                    </TouchableOpacity>
                                    <TouchableOpacity value={item} style={styles.icon}
                                    onPress={()=> {this.rejectFriend(item, user)
                                        && this.props.navigation.navigate("Profile")}}>
                                        {cross}
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        )
                    })}
                </ScrollView>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
    padding: 10,
    backgroundColor: "white",
  },

  itembox: {
    flexDirection: "row",
    backgroundColor: "#e5e2f6",
    margin: 10,
    borderRadius: 20,
    //justifyContent: "center",
  },

  item: {
    paddingVertical: 20,
    marginLeft: 20,
    marginRight: "17%",
    fontSize: 18,
    fontFamily: "Baskerville",
    color: "black",
  },

  iconbox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: 90,
    height: 40,
    backgroundColor: "white",
    borderRadius: 30,
    //marginLeft: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  icon: {
    padding: 10,
  },
});
