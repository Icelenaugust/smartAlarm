import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from "firebase";

const myIcon = <Icon name="search" size={30} color="gray" />;


var user;

export default class FriendRequest extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            friendMail: '',
            nameList:[], 
            hashID: [],
            friendID: '',
            findFriend: false,
            isLoaded: false,
            foundFriend: false,
            emailArray: []
        }
    }

    async componentDidMount() {
        user = await firebase.auth().currentUser;
        var usersRef = await firebase.database().ref('users/');
        if (!this.state.isLoaded) {
            usersRef.once('value', (snapshot) => {
                var curr = [];
                var hash = [];
                    snapshot.forEach((childSnapshot) => {
                        var pair = [];
                        var userID = childSnapshot.key;
                        var thegmail = childSnapshot.val().gmail;
                        

                        pair.push(thegmail);
                        pair.push(userID);

                        curr.push(thegmail);
                        hash.push(pair);
                        this.setState({ nameList: curr });
                        this.setState({ hashID: hash });
                        
                    }
                    );  
                    //console.log(this.state.hashID);
            });
            this.setState({isLoaded: true})
            //console.log(this.state.isLoaded);
            
        }

    }

    handleUsername = (value) => {
        this.setState({friendMail: value})
        //console.log(this.state.friendMail)
    }

    handleSearch = () => {
        const temp = this.state.nameList.filter(email => email == this.state.friendMail)
        if(temp.length == 1) {
            this.setState({foundFriend: true})
        }
        this.setState({findFriend: true})
    }
    
    sendRequest = () => {
        this.setState({foundFriend: false})
        var friendId;
        for (var i=0; i< this.state.hashID.length; i++) {
            const check = this.state.hashID[i];
            if (this.state.friendMail === check[0]) {
                this.setState({friendID: check[1]});
                friendId = check[1]
                //console.log("hi", check[1])
            }
        }
        
        // var gmailKey = firebase.database().ref().child('users')
        //                 .child('user.uid').child('gmail').push().key;
        
        console.log("yo")
        console.log("hihi", this.state.friendID)

        var requestRef = firebase.database().ref('/requests/' + 'friendRequest/' + 
                                                    'requestUsers/' + friendId + "/request");
        // var data = [];
        // console.log("uuuuuuu", requestRef);
        requestRef.on('value' , (snapshot) => {
            console.log("snap1", snapshot.val());
            var data = snapshot.val();
            // data = snapshot.val() === null ? [] : snapshot.val();
            data.push(user.email);
            console.log("snap2", data);
        

            this.setState({emailArray: data});
            console.log(emailArray);
            // console.log("helloooo", data)

        })

        this.updateRequest(friendId);

    }    

    updateRequest = (friendId) => {
        console.log(this.state.emailArray);
        firebase
            .database()
            .ref("/requests" + "/friendRequest" + "/requestUsers/" + friendId)
                    .update({
                        request: this.state.emailArray
                    }).then((snapshot) => {
                        // console.log("Snapshot", snapshot);
             });
    }
    
    render() {

      return (
        <View style={styles.container}>
             <View style={styles.rowContainer}>
             <TextInput 
               style = {styles.input}
               autoCapitalize = "none"
               onChangeText = {this.handleUsername}/>
               <TouchableOpacity
               style={styles.icon}
               onPress={this.handleSearch}>
                   {myIcon}
               </TouchableOpacity>
               </View>
               { this.state.foundFriend && 
               <View style={styles.rowContainer}>
               <Text style={styles.name}>
                   {this.state.friendMail}
                   </Text>
               <TouchableOpacity
               style={styles.button}
               onPress={()=>this.sendRequest()}
           >
               <Text style={styles.text}>+ Add friend
               </Text>
           </TouchableOpacity>
           </View>
           }
           {this.state.findFriend && !this.state.foundFriend &&
           <Text>Username not found</Text>
           }
            </View>

      )}
}

const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      backgroundColor: "#FFF",
      alignItems: "center",
      flex: 1,
    },
    rowContainer: {
        flexDirection: 'row'
      },
      icon: {
          marginTop: 18
      },
      name: {
        fontSize: 22,
        color: "#201b40",

      },
      button: {
        fontSize: 22,
        marginLeft: 20,
      },
      text: {
          fontSize: 16,
      },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        borderRadius: 3,
        width: 250
     }}
)