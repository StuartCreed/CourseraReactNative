import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import { LEADERS } from '../shared/leaders';


function History() {
   return (
      <Card
      title="Our History"
      >
          <Text style={{margin: 10}}>
               Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
          </Text>
          <Text style={{margin: 10}}>
               The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
          </Text>
      </Card>
   )
}

function RenderLeader(leader) {

        if (leader != null) {
            return(
                   <Card
                   featuredTitle={leader.name}
                   image={require('./images/alberto.png')}>
                       <Text style={{margin: 10}}>
                           {leader.description}
                       </Text>
                   </Card>
            );
        }
        else {
            return(<View></View>);
        }

}

function CorporateLeadership(props) {

   const leaders = props.leaders.map((item) => {
       return (
            <RenderLeader leader={item} />
       );
   });

   return (
      <Card
      title="Corporate Leadership"
      >
      {leaders}
      </Card>
   )
}

class AboutUs extends Component {

   constructor(props) {
         super(props);
         this.state = {
            leaders: LEADERS
      };
   }

   render() {
      return(
         <ScrollView>
            <History />
            <CorporateLeadership leaders={this.state.leaders}/>
         </ScrollView>
      );
   }
}

export default AboutUs;
