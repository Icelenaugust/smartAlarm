import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import firebase from "firebase";

const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View);

export default class SolveQuestion extends Component {
  constructor() {
    super();
    this.state = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      answer: "",
      questionList: [],
      isLoading: true,
    };
  }
  shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  getFriends = (user) => {
    var usersRef = firebase.database().ref("users/" + user.uid + "/friends");
    // console.log(usersRef);
    var setThis = true;
    usersRef.once("value", (snapshot) => {
      //   var curr = [];
      //   console.log("HELLO", snapshot);
      snapshot.forEach((childSnapshot) => {
        var { email, user } = childSnapshot.val();
        //var curr = this.state.nameList;
        var questionRef = firebase
          .database()
          .ref("questions/" + user)
          .once("value", (snapshot1) => {
            snapshot1.forEach((snapshot2) => {
              var curr = this.state.questionList;
              //console.log(curr);
              curr.push(snapshot2.val());
              //console.log(curr);
              if (setThis) {
                this.setState({
                  question: snapshot2.val().question,
                  option1: snapshot2.val().option1,
                  option2: snapshot2.val().option2,
                  option3: snapshot2.val().option3,
                  answer: snapshot2.val().answer,
                });
                setThis = false;
              }

              this.setState({ questionList: this.shuffle(curr) });
            });
          });
      });
    });
    this.setState({ isLoading: false });
  };

  handleQuestion = (value) => {
    this.setState({ question: value });
  };
  handleOption1 = (value) => {
    this.setState({ option1: value });
  };
  handleOption2 = (value) => {
    this.setState({ option2: value });
  };
  handleOption3 = (value) => {
    this.setState({ option3: value });
  };
  handleAnswer = (value) => {
    this.setState({ answer: value });
  };
  handleSubmit = (val) => {
    if (this.state.answer !== val) {
      Alert.alert("Alert", "Your answer must match one of your options!");
      return;
    } else {
      this.props.submit();
    }
  };

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    // console.log(this.currentUser);
    this.getFriends(this.currentUser);
  }

  // randomQuestion = () => {
  //   const Min = 0;
  //   const Max = this.state.questionList - 1;
  //   let rQuestion = this.state.questionList[Min + (Max - Min) * Math.random()];
  //   this.randomQuestion = rQuestion;
  //   return this.state.questionList[Min + Math.random() * (Max - Min)];
  // };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>
          {this.state.questionList === undefined
            ? "Loading..."
            : this.state.question}
        </Text>
        <TouchableOpacity
          style={styles.button}
          value="first"
          onPress={() => this.handleSubmit(this.state.option1)}
        >
          <Text style={styles.text}>
            {this.state.questionList === undefined
              ? "Loading..."
              : this.state.option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          value="second"
          onPress={() => this.handleSubmit(this.state.option2)}
        >
          <Text style={styles.text}>
            {this.state.questionList === undefined
              ? "Loading..."
              : this.state.option2}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          value="third"
          onPress={() => this.handleSubmit(this.state.option3)}
        >
          <Text style={styles.text}>
            {this.state.questionList[0] === undefined
              ? "Loading..."
              : this.state.option3}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#e5e2f6",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    //marginLeft: 2
  },
  buttonText: {
    fontSize: 18,
    color: "#201b40",
    textAlign: "center",
    fontFamily: "Arial",
    //marginBottom: 20
  },
  text: {
    fontSize: 17,
    color: "#201b40",
    textAlign: "center",
    fontFamily: "Arial",
    //marginBottom: 20,
  },
  question: {
    fontSize: 17,
    color: "gray",
    textAlign: "center",
    fontFamily: "Arial",
    marginBottom: 10,
    marginTop: 10,
  },
});
