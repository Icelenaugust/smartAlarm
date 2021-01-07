import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         Button, 
         TouchableOpacity, 
         Image,
         ImageBackground,
         Dimensions, 
        } from 'react-native';

export default class Home extends Component {
  render() {
    return(
      <View style={styles.container}>
        <ImageBackground
          style={styles.backgrd}
          source={require('../images/homebkgrd.png')}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Alarm')}
          >
            <Text style={styles.text}> Set Alarm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.text}> Log In
            </Text>
          </TouchableOpacity>

        </ImageBackground>
 
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#afa9cf',
    alignItems: 'center',
    flex: 1,
    

  }, 

  backgrd: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   
    
  },

  button: {
    width: 250,
    height: 50,
    backgroundColor: '#e5e2f6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    top: 170
    
  },

  text: {
    fontSize: 22,
    color: '#201b40',
    textAlign: 'center',
    fontFamily: 'Chalkduster'
  }
});


