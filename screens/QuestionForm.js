<<<<<<< HEAD
import React, { Component } from 'react';
import t from 'tcomb-form-native'; 
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
=======
import React, { Component } from "react";
// import t from 'tcomb-form-native';
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
import { v4 as uuidv4 } from "uuid";
>>>>>>> Add question form and question bank

// const Form = t.form.Form;

// const Quiz = t.struct({
//   question: t.String,
//   option_1: t.String,
//   option_2: t.String,
//   option_3: t.String,
//   correct_answer: t.String,
// });

// const formStyles = {
//     ...Form.stylesheet,
//     textbox: {
//         normal: {
//           width: 350,
//           color: 'black',
//           fontSize: 18,
//           height: 38,
//           paddingVertical: Platform.OS === "ios" ? 7 : 0,
//           paddingHorizontal: 7,
//           borderRadius: 4,
//           borderColor: 'gray',
//           borderWidth: 1,
//           marginBottom: 5
//         }
//     }
// }

// handleSubmit = () => {
//     //const myQuiz = this._form.getValue();
//     var value = this.refs.form.getValue();
//     console.log('hello')
//     console.log('quiz: ', myQuiz);
//   }

//   const options = {
//     stylesheet: formStyles,
//     fields: {
//         correct_answer: {
//           help: 'Correct answer must match with an option!'
//         }
//       }
//   }

const DismissKeyboardHOC = (Comp) => {
<<<<<<< HEAD
    return ({ children, ...props }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Comp {...props}>
          {children}
        </Comp>
      </TouchableWithoutFeedback>
    );
  };
  const DismissKeyboardView = DismissKeyboardHOC(View)

export default class QuestionForm extends Component {
    constructor() {
        super()
        this.state = {
            // questionForm: {
            // question: '',
            // option1: '',
            // option2:'',
            // option3:'',
            // answer:'' }
          question: '',
          option1: '',
          option2:'',
          option3:'',
          answer:''
        }
    }

    handleQuestion = (value) => {
        this.setState({question: value})
    }
    handleOption1 = (value) => {
        this.setState({option1: value})
    }
    handleOption2 = (value) => {
        this.setState({option2: value})
    }
    handleOption3 = (value) => {
        this.setState({option2: value})
    }
    handleAnswer = (value) => {
        this.setState({answer: value})
    }
    handleSubmit = () => {
        if(this.state.answer != this.state.option1 && this.state.answer != this.state.option2
            && this.state.answer != this.state.option3) {
            Alert.alert('Alert', 'Your answer must match one of your options!');
        return;
    }
        console.log(this.state.question)
    }

    render() {
      return(
        <View style={styles.container}>
            <DismissKeyboardView>
            <Text style={styles.text}>Create Quiz</Text>
            <Text style={styles.label}>Your Question:</Text>
            <TextInput style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleQuestion}/>
               <Text style={styles.label}>Option 1:</Text>
            <TextInput style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleOption1}/>
                <Text style={styles.label}>Option 2:</Text>
            <TextInput style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleOption2}/>
               <Text style={styles.label}>Option 3:</Text>
            <TextInput style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleOption3}/>
               <Text style={styles.label}>Your answer:</Text>
            <TextInput style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleAnswer}/>
            <TouchableOpacity style={styles.button} onPress={this.handleSubmit} >
          <Text style={styles.buttonText}>Send my quiz</Text>
        </TouchableOpacity>
        </DismissKeyboardView>
            </View>
      )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      marginTop: '10%',
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
      input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        borderRadius: 3
     },
      buttonText: {
        fontSize: 18,
        color: '#201b40',
        textAlign: 'center',
        fontFamily: 'Arial',
        //marginBottom: 20
      },
      text: {
        fontSize: 22,
        color: '#201b40',
        textAlign: 'center',
        fontFamily: 'Arial',
        marginBottom: 20,
      },
      label: {
        fontSize: 15,
        color: '#201b40',
        fontFamily: 'Arial',
        marginLeft: 15
      }
  });
  
=======
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View);

export default class QuestionForm extends Component {
  constructor() {
    super();
    this.state = {
      // questionForm: {
      // question: '',
      // option1: '',
      // option2:'',
      // option3:'',
      // answer:'' }
      question: "",
      option1: "",
      option2: "",
      option3: "",
      answer: "",
    };
  }

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
  handleSubmit = () => {
    if (
      this.state.answer != this.state.option1 &&
      this.state.answer != this.state.option2 &&
      this.state.answer != this.state.option3
    ) {
      Alert.alert("Alert", "Your answer must match one of your options!");
      return;
    } else {
      const id = uuidv4();
      const item = {
        id: id,
        question: this.state.question,
        option1: this.state.option1,
        option2: this.state.option2,
        option3: this.state.option3,
        answer: this.state.answer,
      };
      var requestRef = firebase
        .database()
        .ref(`/questions/${this.state.user.uid}/${id}`)
        .set(item);
      console.log(this.state.question);
    }
  };

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    this.setState({ user: this.currentUser, isLoading: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <Text style={styles.text}>Create Quiz</Text>
          <Text style={styles.label}>Your Question:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleQuestion}
          />
          <Text style={styles.label}>Option 1:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleOption1}
          />
          <Text style={styles.label}>Option 2:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleOption2}
          />
          <Text style={styles.label}>Option 3:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleOption3}
          />
          <Text style={styles.label}>Your answer:</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={this.handleAnswer}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleSubmit()}
          >
            <Text style={styles.buttonText}>Send my quiz</Text>
          </TouchableOpacity>
        </DismissKeyboardView>
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
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    color: "#201b40",
    textAlign: "center",
    fontFamily: "Arial",
    //marginBottom: 20
  },
  text: {
    fontSize: 22,
    color: "#201b40",
    textAlign: "center",
    fontFamily: "Arial",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: "#201b40",
    fontFamily: "Arial",
    marginLeft: 15,
  },
});
>>>>>>> Add question form and question bank
