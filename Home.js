import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export default class Home extends Component {
  render() {
    return(
      <Button
        title="Go to Alarm Page"
        onPress={() =>
          this.props.navigation.navigate('Alarm')
        }
      />
    );
  }
}



