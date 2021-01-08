import React,{ Component, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
//import t from 'tcomb-form-native'; 

export default class Snooze extends Component {
    constructor() {
        super()
        this.state = {
          myAnswer: '',
        //   question: 
        //   t.struct({
        //     question: 'my question',
        //     option_1: 'my frist option',
        //     option_2: 'my second option',
        //     option_3: 'my third option',
        //     correct_answer: 'my third option',
        //   })
          }
        }
        handleSubmit = (value) => {
            this.setState({
                myAnswer: value
            })
          }
    
    render() {
      return(
        <View style={styles.container}>
            <Text style={styles.question}>Question here</Text>
            <TouchableOpacity style={styles.button} value='first' onPress={this.handleSubmit} >
                <Text style={styles.text}>First option</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} value='second' onPress={this.handleSubmit} >
                <Text style={styles.text}>Second option</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} value='third'onPress={this.handleSubmit} >
                <Text style={styles.text}>third option</Text>
            </TouchableOpacity>
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
        //marginLeft: 2
      },
      buttonText: {
        fontSize: 18,
        color: '#201b40',
        textAlign: 'center',
        fontFamily: 'Arial',
        //marginBottom: 20
      },
      text: {
        fontSize: 17,
        color: '#201b40',
        textAlign: 'center',
        fontFamily: 'Arial',
        //marginBottom: 20,
      },
      question: {
        fontSize: 17,
        color: 'gray',
        textAlign: 'center',
        fontFamily: 'Arial',
        marginBottom: 10,
        marginTop: 10,
      }

  });