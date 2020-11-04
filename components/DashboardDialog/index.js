import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { ScrollView, View, TouchableOpacity, Text, Platform, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import PieGraph from '../PieGraph';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class DashboardDialog extends React.PureComponent {

    setSite = (site) => {
        this.props.userActions.updateActive(site);
        this.props.userActions.handleFooterTab(0);
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

        let dashboardContainer = {
            flex:0,
            flexDirection:'column'
        };

        let dashboardGraph = {
            paddingTop:15,
            paddingBottom:15
        };

        let dashboardTopics = {
            flex:0,
            flexDirection:'column',
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            padding:10,
            margin:10
        };

        let dashboardSites = {
            flex:0,
            flexDirection:'column',
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            margin:10
        };

        let dashboardHistory = {
            flex:0,
            flexDirection:'column',
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            margin:10,
            marginBottom:50
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

        let topicsList = {
            flex:0,
            flexDirection:'row',
            flexWrap:'wrap',
            marginTop:15
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

        let menuHeaderInfo = {
            flex:0,
            flexDirection:'column',
            marginLeft:10
        };

        let menuHeaderStats = {
            flex:0,
            flexDirection:'row',
            flexWrap:'wrap',
            paddingTop:5,
            paddingBottom:5
        };

        let menuHeaderStatsItem = {
            color:'#FFFFFF',
            marginTop:5,
            marginRight:10
        };

        let profileContent = {
            flex:0,
            flexDirection:'column',
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            padding:10,
            margin:10
        };

        return (
            <ScrollView style={dialogContainer}>
                <View style={dialogHeader}>
                    <View style={{width:35}}></View>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>Dashboard</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(0)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={dashboardContainer}>
                    <View style={profileContent}>
                        <View style={{flex:0, flexDirection:'row'}}>
                            <View style={{borderRadius:5, backgroundColor: this.props.user.avatar, height:60, width:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:38, color:'#FFFFFF', textTransform:'uppercase'}}>{this.props.user.name.substr(0, 2)}</Text>
                            </View>
                            <View style={menuHeaderInfo}>
                                <Text style={{fontSize:24, color:'#FFFFFF'}}>{this.props.user.displayName}</Text>
                                <Text style={menuHeaderStatsItem}>@{this.props.user.name}</Text>
                            </View>
                        </View>
                        <View style={menuHeaderStats}>
                            <Text style={menuHeaderStatsItem}>Explored: {this.props.user.sites.length}</Text>
                            <Text style={menuHeaderStatsItem}>Topics: {this.props.user.tags.length}</Text>
                        </View>
                    </View>
                    {this.props.user.tags.length !== 0 ?
                        <View style={dashboardGraph}>
                            <PieGraph slices={this.props.user.tags.slice(0, 50)} />
                        </View>
                        : null
                    }
                    <View style={dashboardTopics}>
                        <Text style={{color:'#1ABC9C'}}>YOUR TOPICS</Text>
                        <View style={topicsList}>
                            {this.props.user.tags.length !== 0 ?
                                this.props.user.tags.map((tag, i) => (
                                    <TouchableOpacity style={tagItem} key={i} onPress={() => this.props.userActions.handleFooterTab(5, tag.name)}>
                                        <Text style={{color:'#FFFFFF', fontSize:16}}>{tag.name}</Text>
                                    </TouchableOpacity>
                                ))
                                :
                                <Text style={{color:'#FFFFFF'}}>No Topics Yet</Text>
                            }
                        </View>

                    </View>
                    <View style={dashboardHistory}>
                        <Text style={{color:'#1ABC9C', padding:10}}>HISTORY</Text>
                        <ScrollView>
                            {this.props.user.sites.length !== 0 ?
                                this.props.user.sites.map((site, i) => (
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
                                ))
                            :
                                <Text style={{color:'#FFFFFF', padding:10}}>No History Yet</Text>
                            }
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.reducer.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(DashboardDialog);