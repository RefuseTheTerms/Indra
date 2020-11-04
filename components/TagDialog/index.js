import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { ScrollView, View,TouchableOpacity, Text, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class TagDialog extends React.PureComponent {

    setSite = (site) => {
        this.props.userActions.updateActive(site);
        this.props.userActions.handleFooterTab(0);
    }

    renderHistoryTitle = (history, i) => {
        if(history.metaData && history.metaData.title) {
            return(
                <Text style={{color:'#EEEEEE', fontSize:16}} ellipsizeMode="tail" numberOfLines={1}>{history.metaData.title}</Text>
            )
        } 
        else if(history.title) {
            return(
                <Text style={{color:'#EEEEEE', fontSize:16}} ellipsizeMode="tail" numberOfLines={1}>{history.title}</Text>
            )
        } else {
            return(
                <Text style={{color:'#EEEEEE', fontSize:16}} ellipsizeMode="tail" numberOfLines={1}>History #{i}</Text>
            )
        }
    }

    renderRating = (score) => {
        let ratingRow = {
            flex:0,
            flexDirection:'row',
            justifyContent:'center'
        };

        let ratings = [];

        for(let i = 0; i < score; i++) {
            ratings.push('#FFFFFF');
        }

        for(let i = 0; i < 5 - score; i++) {
            ratings.push('#3B4F61');
        }
        return (
            <View style={{flex:0, flexDirection:'column', justifyContent:'center'}}>
                <View style={ratingRow}>
                    {ratings.map((rating, i) => (
                        <View key={i} style={{
                            height:20,
                            width:20,
                            marginRight:5,
                        }}>
                            <Icon name="star" size={20} color={rating} />
                        </View>
                    ))}
                </View>
            </View>
        )
    }

    render() {
        let offset = this.props.dialogOffset;

        let dialogContainer = {
            width:this.props.width,
            height:this.props.height - offset,
            position:'absolute',
            left:0,
            top:0,
            backgroundColor:'rgba(0, 0, 0, 0.7)',
            flex:0,
            flexDirection:'column',
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

        let profileContainer = {
            flex:0,
            flexDirection:'column'
        };

        let profileHistory = {
            flex:0,
            flexDirection:'column',
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            margin:10
        };

        let historyItem = {
            flex:0,
            flexDirection:'column',
            marginTop:5,
            marginBottom:5
        };

        let historyItemTop = {
            flex:1,
            flexDirection:'column',
            backgroundColor:'#1ABC9C',
            padding:5
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

        let tagItem = {
            backgroundColor:'#1ABC9C',
            paddingTop:5,
            paddingBottom:5,
            paddingLeft:10,
            paddingRight:10,
            margin:5,
            borderRadius:5
        };

        return (
            <ScrollView style={dialogContainer}>
                <View style={dialogHeader}>
                    <View style={{width:35}}></View>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>{this.props.tag.name}</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(2)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={profileContainer}>
                    <View style={profileHistory}>
                        <Text style={{color:'#1ABC9C', padding:10}}>SITES</Text>
                        <ScrollView>
                            {this.props.tag.sites.map((site, i) => (
                                <View style={historyItem} key={i}>
                                    <TouchableOpacity style={historyItemTop} onPress={() => this.setSite(site.url)}>
                                        <Text style={{color:'#EEEEEE', fontSize:16}} ellipsizeMode="tail" numberOfLines={1}>{site.siteName}</Text>
                                        <Text style={{color:'#FFFFFF'}} numberOfLines={1} ellipsizeMode='tail'>{site.url}</Text>
                                    </TouchableOpacity>
                                    <ScrollView horizontal={true} style={{backgroundColor:'rgba(0, 0, 0, 0.4)', borderBottomWidth:1, borderBottomColor:'#777777'}}>
                                        {site.tags.map((tag, j) => (
                                            <TouchableOpacity style={tagItem} key={j} onPress={() => this.props.userActions.handleFooterTab(5, tag)}>
                                                <Text style={{color:'#FFFFFF', fontSize:16}}>{tag}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

            </ScrollView>
        )
    }

}

const mapStateToProps = state => {
    return {  
        tag: state.reducer.user.tag
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(TagDialog);