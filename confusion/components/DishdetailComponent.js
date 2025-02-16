import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

      const dish = props.dish;

      const shareDish = (title, message, url) => {
          Share.share({
              title: title,
              message: title + ': ' + message + ' ' + url,
              url: url
          },{
              dialogTitle: 'Share ' + title
          })
      }

      handleViewRef = ref => this.view = ref;

      const recognizeComment = ({ moveX, moveY, dx, dy }) => {
         if ( dx > 200 ) {
            console.log("Recognised Comment done");
            return true;
         }

         else
            return false;
      }

      const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
         if ( dx < -200 )
            return true;
         else
            return false;
      }

      const panResponder = PanResponder.create({
         onStartShouldSetPanResponder: (e, gestureState) => {
              return true;
         },
         onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
         onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)) {
               console.log("Right to Left Swipe Recognised")
               Alert.alert(
                  'Add Favorite',
                  'Are you sure you wish to add ' + dish.name + ' to favorite?',
                  [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                  ],
                  { cancelable: false }
                 );
               return true;
             }

            else if (recognizeComment(gestureState)) {
               console.log("Left to Right Swipe Recognised");
               Alert.alert(
                  'Add Comment',
                  'Are you sure you wish to add a comment?',
                  [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: props.setState},
                  ],
                  { cancelable: false }
                 );
               return true;
            }
         }
      })

      if (dish != null) {
         return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={this.handleViewRef} {...panResponder.panHandlers}>
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
                        onPress={props.setState}
                     />
                     <Icon
                        raised
                        reverse
                        name='share'
                        type='font-awesome'
                        color='#51D2A8'
                        style={styles.cardItem}
                        onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                      />
                  </View>
               </Card>
            </Animatable.View>
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
            <View key={index} style={{margin: 20}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={10} style={styles.stars} fractions={1} startingValue={item.rating}/>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };


    return (
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
         <Card title='Comments' >
         <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
         </Card>
      </Animatable.View>
    );
}

class DishDetail extends Component {

   constructor(props){
      super(props);
      this.state = {
          showModal: false,
          rating: 3,
          author: null,
          comment: null
      }
   }

   markFavorite(dishId) {
      this.props.postFavorite(dishId);
   }

   resetModal() {
      this.setState({
         showModal: false,
         rating: 3
      });
   }

   handleComment(dishId) {
      rating = this.state.rating;
      author = this.state.author;
      comment = this.state.comment;
      this.props.postComment(dishId, rating, author, comment);
      this.setState({
         showModal: false,
      });
   }

   handleRating(RatingSubmitted) {(
      this.setState({rating: RatingSubmitted})
   )}

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
               setState={() => this.setState({showModal: true})}
            />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            <Modal animationType = {"slide"} transparent = {false} visible = {this.state.showModal}>
                <View style = {styles.modal}>
                  <Rating showRating fractions={1} startingValue={3} onFinishRating={(RatingSubmitted) => (this.setState({rating: RatingSubmitted}))} />
                  <Input
                     placeholder='Author'
                     leftIcon={{ type: 'font-awesome', name: 'user' }}
                     leftIconContainerStyle={{margin: 10}}
                     onChangeText={(TextSubmitted) => (this.setState({author: TextSubmitted}))}
                  />
                  <Input
                     placeholder='Comment'
                     leftIcon={{ type: 'font-awesome', name: 'comment' }}
                     leftIconContainerStyle={{margin: 10}}
                     onChangeText={(TextSubmitted) => (this.setState({comment: TextSubmitted}))}
                  />
                  <Button
                     onPress = {() => {this.handleComment(dishId)}}
                     title="SUBMIT"
                     buttonStyle={{backgroundColor:"#512DA8", margin: 10}}
                  />
                  <Button
                     onPress = {() => {this.resetModal()}}
                     title="CANCEL"
                     buttonStyle={{backgroundColor:"#787878", margin: 10}}
                  />
                </View>
            </Modal>
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
    modal: {
      justifyContent: 'center',
      margin: 20
    },
    stars: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
