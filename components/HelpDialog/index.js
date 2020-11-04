import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { ScrollView, View, TouchableOpacity, Text, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class HelpDialog extends React.PureComponent {
    render() {
        let offset = this.props.dialogOffset;

        let dialogContainer = {
            width:this.props.width,
            height:this.props.height - offset,
            position:'absolute',
            left:0,
            top:0,
            backgroundColor:'rgba(0, 0, 0, 0.7)',
            zIndex:999999,
        };

        if(Platform.OS === 'ios') {
            if(!DeviceInfo.hasNotch()) {
                dialogContainer.top = 20;
            } else {
                dialogContainer.top = 40;
            }
        }

        let dialogHeader = {
            flex:0,
            flexDirection:'row',
            justifyContent:'space-between',
            height:50,
            width:this.props.width,
            marginTop:5
        };

        let dialogTitleContainer = {
            backgroundColor:'#1ABC9C',
            width:200,
            height:40,
            borderRadius:5,
            flex:0,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
        };

        let dialogTitle = {
            color:'#FFFFFF',
            fontSize:16
        };

        let helpContainer = {
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            padding:15,
            margin:15
         };

         let closeButton = {
            backgroundColor:'#1ABC9C',
            width:40,
            height:40,
            marginRight:10,
            flex:0,
            flexDirction:'row',
            alignItems:'center',
            justifyContent:'center',
            borderRadius:5
        };

        return (
            <ScrollView style={dialogContainer}>
                <View style={dialogHeader}>
                    <View style={{width:35}}></View>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>Help</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(0)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={helpContainer}>
                    <Text style={{color:'#1ABC9C'}}>Indra Interface</Text>
                    <Text style={{color: '#FFFFFF'}}>
                        With Indra you can browse websites by typing in a URL at the top address bar.
                        At the footer, we have the Indra Overlay menus. 
                        These menus will hide upon scrolling down to maximize content viewability and unhide when you scroll back up for easy access.
                        Tapping on the left arrow Icon will return you to the previous url if available.
                        The next Icon, the Indra Logo, will show your most common Topics which you can assign to the site for easy categorization.
                        The final icon will open your personal Dashboard, an overlay containing data on your tags and website history.
                    </Text>
                </View>
                <View style={helpContainer}>
                    <Text style={{color:'#1ABC9C'}}>Topics</Text>
                    <Text style={{color: '#FFFFFF'}}>
                        The Topics Overlay allows you to categorize the websites you frequently visit. You simply need to begin typing your topic and press space or enter to add the topic to assign it to website. The Topics Overaly shows topics you've already assigned to the current website, Topics you've previously used, and an input for adding new topics. If you would like to remove a topic assigned to a website, simply tap on the topic displayed in the first section.
                    </Text>
                </View>
               
                <View style={helpContainer}>
                    <Text style={{color:'#1ABC9C'}}>Dashboard</Text>
                    <Text style={{color: '#FFFFFF'}}>
                        Your Dashboard is broken down into three parts. Your personal information, your topic data, and your historical data. Your personal information displays your generated avatar, username, and name chosen when you signed up. You'll also see the number of sites you've explored and topics you've created. Below, you'll find your topics graph and most recent topics you have used. You can tap on these topics to open up all of your websites associated with a topic. Your history shows all sites you've opened your topics overlay on. If you've left a topic on one of these websites, it will show up below the website. 
                    </Text>
                </View>

            </ScrollView>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect( null, mapDispatchToProps )(HelpDialog);