import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

const isValidDate = (d) => {
    let dt = new Date();
    dt.setHours(dt.getHours(),dt.getMinutes()+1,0,0);
    return d > dt;
}

export default class Alarm extends Component {
    constructor() {
        super()
        this.state = {
          isVisible: false,
          chosenTime: '',
          isAnswerQuestion: false,
        }
    }

    componentDidMount() {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            this.setState({ isAnswerQuestion: true });
        });
        return () => subscription.remove();
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

    schedulePushNotification = async () => {
        const trigger = new Date(this.state.chosenTime);
        if (!isValidDate(trigger)) {
            alert('Sorry! Alarm date must be at least 1 minute from now');
            return;
        }
        for (let i = 0; i < 30; i++) {
            trigger.setSeconds(trigger.getSeconds() + 2);
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "You've got mail!",
                    body: 'Here is the notification body',
                    sound: 'email-sound.wav'
                },
                trigger,
            });
        }
    }

    render() {
        if (this.state.isAnswerQuestion) {
            return(<View style={styles.container}>
                <TouchableOpacity style = {styles.button} onPress={async () => {this.setState({ isAnswerQuestion: false }); await Notifications.cancelAllScheduledNotificationsAsync()}}>
                    <Text style={styles.text}>Solve Question</Text>
                </TouchableOpacity>
            </View>);
        } else {
            return(
                <View style={styles.container}>
                    <Text style={{color: 'red', fontSize: 20}}>
                        {this.state.chosenTime}
                    </Text>
                    <TouchableOpacity style = {styles.button} onPress={this.showPicker}>
                        <Text style={styles.text}>Choose a Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button} onPress={this.schedulePushNotification}>
                        <Text style={styles.text}>Set Alarm</Text>
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