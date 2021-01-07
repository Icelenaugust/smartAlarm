import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'



export default class Alarm extends Component {
    constructor() {
        super()
        this.state = {
          isVisible: false,
          chosenTime: ''
        }
    }

    
    

    handlePicker = (datetime) => {
        this.setState({
            isVisible: false,
            chosenTime: moment(datetime).format('DD MMMM, YYYY HH:mm')
        })
        
    }

    showPicker = () => {
        this.setState({
            isVisible: true
        })
    }

    hidePicker = () => {
        this.setState({
            isVisible: false
        })
        
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{color: 'red', fontSize: 20}}>
                    {this.state.chosenTime}
                </Text>
                <TouchableOpacity style = {styles.button} onPress={this.showPicker}>
                    <Text style={styles.text}>Choose a Time</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={this.state.isVisible}
                    onConfirm={this.handlePicker}
                    onCancel={this.hidePicker}
                    mode={'datetime'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    button: {
      width: 250,
      height: 50,
      backgroundColor: 'rgb(0, 0, 0)',
      borderRadius: 30,
      justifyContent: 'center',
      marginTop: 15
    },
  
    text: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center'
    }
});