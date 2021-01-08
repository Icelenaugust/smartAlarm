import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import { color } from "react-native-reanimated";

export default class QuestionBank extends Component {
  constructor(props) {
    super(props);
    this.state = { questionList: [], isLoaded: false };
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    this.setState({ user: this.currentUser, isLoading: false });
    if (!this.state.isLoaded) {
      firebase
        .database()
        .ref(`/questions/${this.state.user.uid}`)
        .once("value", (snapshot) => {
          var curr = [];
          console.log(snapshot);

          snapshot.forEach((childSnapshot) => {
            var question = childSnapshot.val();
            console.log(question);
            curr.push(question);
            this.setState({ questionList: curr });
          });
        });
      this.setState({ isLoaded: true });
    }
  }

  handleDelete = (id) => {
    console.log(id);
    firebase.database().ref(`/questions/${this.state.user.uid}/${id}`).remove();
    this.props.navigation.navigate("Profile");
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.questionList.map((item) => {
            return (
              <View style={styles.itembox}>
                <Text style={styles.item}>{item.question}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.handleDelete(item.id)}
                >
                  <Text style={styles.text}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
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
    marginRight: "40%",
    fontSize: 30,
    fontFamily: "Baskerville",
    color: "black",
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
});
