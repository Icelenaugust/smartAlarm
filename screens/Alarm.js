import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { WebView } from "react-native-webview";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

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

    schedulePushNotification = async () => {
        const trigger = new Date(this.state.chosenTime);
        for (let i = 0; i < 10; i++) {
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
                <WebView
                    ref={(ref) => (this.webview = ref)}
                    originWhitelist={["*"]}
                    mediaPlaybackRequiresUserAction={false} // Allow autoplay
                    useWebKit={true}
                    source={{
                        html:
                        '<audio id="audio" loop> <source src="https://go.transportili.app/static/sounds/ring.mp3" type="audio/mp3" /> </audio>',
                    }}
                />
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