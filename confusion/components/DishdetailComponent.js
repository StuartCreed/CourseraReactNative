import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderDish(props) {

    const dish = props.dish;

        if (dish != null) {
            return(
               <>
               <Card
               featuredTitle={dish.name}
               image={{uri: baseUrl + dish.image}}>
                  <Text style={{margin: 10}}>
                       {dish.description}
                  </Text>
                  <View
                     style={styles.icons}
                     >
                     <Icon
                          raised
                          reverse
                          name={ props.favorite ? 'heart' : 'heart-o'}
                          type='font-awesome'
                          color='#f50'
                          onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                     />
                     <Icon
                        raised
                        reverse
                        name={'pencil'}
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.toggleModal()}
                     />
                  </View>
               </Card>
               <Modal animationType = {"slide"} transparent = {false} visible = {props.modalState}>
                  <View style = {styles.modal}>
                     <Text style = {styles.modalTitle}>Your Reservation</Text>
                     <Text style = {styles.modalText}>Number of Guests: </Text>
                     <Text style = {styles.modalText}>Smoking?: </Text>
                     <Text style = {styles.modalText}>Date and Time:</Text>

                     <Button
                          onPress = {() => {props.resetModal()}}
                          color="#512DA8"
                          title="Close"
                          />
                  </View>
               </Modal>
               </>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {

        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Card title='Comments' >
        <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

   constructor(props){
      super(props);
      this.state = {
          showModal: false
      }
   }

   markFavorite(dishId) {
      this.props.postFavorite(dishId);
   }

   toggleModal() {
      console.log(this.state.showModal, "currentState");
      this.setState({showModal: true});
      console.log(this.state.showModal, " state after modal toggle");
   }

   resetModal() {
      this.setState({showModal: false});
   }

   modalState() {
      return (this.state.showModal);
   }

   static navigationOptions = {
      title: 'Dish Details'
   };

   render() {
      const dishId = this.props.navigation.getParam('dishId','');
      return(
         <ScrollView>
             <RenderDish dish={this.props.dishes.dishes[+dishId]}
                 favorite={this.props.favorites.some(el => el === dishId)}
                 onPress={() => this.markFavorite(dishId)}
                 toggleModal={() => this.toggleModal()}
                 resetModal={() => this.resetModal()}
                 modalState={() => this.modalState()}
                 />
             <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
         </ScrollView>
      );
   }

}

const styles = StyleSheet.create({
   icons: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
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
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
