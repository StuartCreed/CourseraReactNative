import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
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
                  </View>
               </Card>
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
          showModal: false,
          rating: null
      }
   }

   markFavorite(dishId) {
      this.props.postFavorite(dishId);
   }

   resetModal() {
      this.setState({
         showModal: false,
         rating: null
      });
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
               setState={() => this.setState({showModal: true})}
            />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            <Modal animationType = {"slide"} transparent = {false} visible = {this.state.showModal}>
                <View style = {styles.modal}>
                  <Rating showRating fractions="{1}" startingValue="{3.3}" />
                  <Input
                     placeholder='Author'
                     leftIcon={{ type: 'font-awesome', name: 'user' }}
                     leftIconContainerStyle={{margin: 10}}
                  />
                  <Input
                     placeholder='Comment'
                     leftIcon={{ type: 'font-awesome', name: 'comment' }}
                     leftIconContainerStyle={{margin: 10}}
                  />
                  <Button
                     onPress = {() => {this.resetModal()}}
                     color="#512DA8"
                     title="Close"
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
    modalText: {
       fontSize: 18,
       margin: 10
    },
    modal: {
      justifyContent: 'center',
      margin: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
