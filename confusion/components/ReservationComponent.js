import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

   constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

   static navigationOptions = {
        title: 'Reserve Table',
   };

  async handleReservation() {
      console.log(JSON.stringify(this.state)," is the New Reservation details");
      smokingState = this.state.smoking ? 'Yes' : 'No';
      Alert.alert(
         'Your Reservation OK? ' ,
         'Number of Guests: ' + JSON.stringify(this.state.guests) + '\nSmoking?: ' + smokingState + '\nDate and Time: ' + this.state.date,
         [
           {
             text: 'Cancel',
             onPress: () => {this.resetForm()},
             style: 'cancel',
           },
           {text: 'OK', onPress: () => {
                this.presentLocalNotification(this.state.date),
                this.resetForm()
              }
           },
         ],
         {cancelable: false},
       );

       console.log(this.state.reserved)

       await this.obtainCalendarPermission();
       this.addReservationToCalendar();
   }

  async addReservationToCalendar() {
    console.log("addReservationToCalendar Invoked");
    const calendars = await Calendar.getCalendarsAsync();
    console.log('Here are all your calendars:');
    console.log({ calendars });
    const defaultCalendar = calendars.filter(
    each => each.source.name === 'Default'
    );
    if (defaultCalendar[0] == null) {
        console.log("There is no default calendar, the event will be placed in the first available calendar that can be edited");

        const calendarsThatCanBeEdited = calendars.filter(
        each => each.allowsModifications == true
        );

        if (calendarsThatCanBeEdited[0] == null) {
          console.log("None of the available calendars on the device can be edited");
        }

        if (calendarsThatCanBeEdited[0] !== null) {
          calendarId=JSON.stringify(calendarsThatCanBeEdited[0].id);
          console.log(calendarsThatCanBeEdited[0],"a calendar that can be edited");
          console.log(calendarId,"ID of the chosen calendar");
          await Calendar.createEventAsync(calendarId, {
            startDate: "2020-01-15T08:00:00.000Z",
            endDate: "2020-01-15T09:00:00.000Z",
            title: "Title of Event",
            timeZone: "Asia/Hong_Kong",
            location: "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong"
          })
        }

    }
    if (defaultCalendar[0] !== null) {
      defaultCalendarId=defaultCalendar[0].source.id;
      console.log(defaultCalendarId, " is the default calendar");

      const calendarsThatCanBeEdited = defaultCalendarId.filter(
      each => each.allowsModifications == true
      );

      if (calendarsThatCanBeEdited[0] == null) {
        console.log("The default calendar on the device cannot be edited");
      }

      if (calendarsThatCanBeEdited[0] !== null) {
        calendarId=JSON.stringify(calendarsThatCanBeEdited[0].id);
        console.log(calendarsThatCanBeEdited[0],"The default calendar can be edited");
        console.log(calendarId,"ID of the chosen default calendar");
        await Calendar.createEventAsync(calendarId, {
          startDate: "2020-01-15T08:00:00.000Z",
          endDate: "2020-01-15T09:00:00.000Z",
          title: "Title of Event",
          timeZone: "Asia/Hong_Kong",
          location: "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong"
        })
      }
    }
  }

   resetForm() {
       this.setState({
           guests: 1,
           smoking: false,
           date: '',
           showModal: false
       });
   }

   async obtainCalendarPermission() {
     let permission = await Permissions.getAsync(Permissions.CALENDAR);
     if (permission.status !== 'granted') {
         permission = await Permissions.askAsync(Permissions.CALENDAR);
         if (permission.status !== 'granted') {
           Alert.alert('Permission not granted to show notifications');
         }
     }
     console.log(permission.status, "this is the permission STATUS")
     return permission;
   }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if (permission.status !== 'granted') {
        permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
          Alert.alert('Permission not granted to show notifications');
        }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
        title: 'Your Reservation',
        body: 'Reservation for '+ date + ' requested',
        ios: {
            sound: true
        },
        android: {
            sound: true,
            vibrate: true,
            color: '#512DA8'
        }
    });
  }

    render() {
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
               <Animatable.View animation="zoomIn" style={{ width: '100%'}}>
                   <View style={styles.formRow}>
                   <Text style={styles.formLabel}>Number of Guests</Text>
                   <Picker
                       style={styles.formItem}
                       selectedValue={this.state.guests}
                       onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                       <Picker.Item label="1" value="1" />
                       <Picker.Item label="2" value="2" />
                       <Picker.Item label="3" value="3" />
                       <Picker.Item label="4" value="4" />
                       <Picker.Item label="5" value="5" />
                       <Picker.Item label="6" value="6" />
                   </Picker>
                   </View>
                   <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                      <Switch
                          style={styles.formItem}
                          value={this.state.smoking}
                          trackColor={{ true: "green", false: "null" }}
                          onValueChange={(value) => this.setState({smoking: value})}>
                      </Switch>
                   </View>
                   <View style={styles.formRow}>
                   <Text style={styles.formLabel}>Date and Time</Text>
                   <DatePicker
                       style={{flex: 2, marginRight: 20}}
                       date={this.state.date}
                       format=''
                       mode="datetime"
                       placeholder="select date and Time"
                       minDate="2017-01-01"
                       confirmBtnText="Confirm"
                       cancelBtnText="Cancel"
                       customStyles={{
                       dateIcon: {
                           position: 'absolute',
                           left: 0,
                           top: 4,
                           marginLeft: 0
                       },
                       dateInput: {
                           marginLeft: 36
                       }
                       // ... You can check the source to find the other keys.
                       }}
                       onDateChange={(date) => {this.setState({date: date})}}
                   />
                   </View>
                   <View style={styles.formRow}>
                   <Button
                       onPress={() => this.handleReservation()}
                       title="Reserve"
                       color="#512DA8"
                       accessibilityLabel="Learn more about this purple button"
                       />
                   </View>

               </Animatable.View>
            </View>
        );
    }

};

const styles = StyleSheet.create({
   formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
   formLabel: {
        fontSize: 18,
        flex: 2
    },
   formItem: {
        flex: 1
    },
   modal: {
      justifyContent: 'center',
      margin: 20
   },
   modalTitle: {
       fontSize: 24,
       fontWeight: 'bold',
       backgroundColor: '#512DA8',
       textAlign: 'center',
       color: 'white',
       marginBottom: 20
   },
   modalText: {
       fontSize: 18,
       margin: 10
   }
});

export default Reservation;
