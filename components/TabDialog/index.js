import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';
import { ScrollView, TouchableOpacity, Text, View, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

class TabDialog extends React.PureComponent {

    newTab = () => {
        this.props.userActions.newTab().then(() => {
            this.forceUpdate();
        })
    }

    removeTab = (index) => {
        this.props.userActions.removeTab(index).then(() => {
            this.forceUpdate();
        });
    }

    switchTab = (index) => {
        this.props.userActions.switchTab(index).then(() => {
            this.forceUpdate();
            this.props.userActions.handleFooterTab(0);
        });
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
            zIndex:9999,
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

        let tabsContainer = {
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            margin:10
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

        let addButton = {
            backgroundColor:'#1ABC9C',
            width:40,
            height:40,
            marginLeft:10,
            flex:0,
            flexDirction:'row',
            alignItems:'center',
            justifyContent:'center',
            borderRadius:5
        };

        let tabItem = {
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            paddingTop:10,
            paddingBottom:10
        };

        let tabItemActive = {
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            paddingTop:10,
            paddingBottom:10,
            backgroundColor:'#1ABC9C'
        };

        let tabContent = {
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            paddingRight:10
        };
        
        let tabInfo = {
            flex:1,
            flexDirection:'column'
        };

        return (
             <ScrollView style={dialogContainer}>
                <View style={dialogHeader}>
                    <TouchableOpacity style={addButton} onPress={this.newTab}>
                        <Icon name="add" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>Tabs</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(0)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <ScrollView behavior="padding" keyboardVerticalOffset={100} enabled style={tabsContainer}>
                    {this.props.tabs.map((tab, i) => (
                        <View style={this.props.activeTab === i ? tabItemActive : tabItem} key={i}>
                            <TouchableOpacity style={{paddingLeft:10, paddingRight:10}} onPress={() => this.removeTab(i)}>
                                <Icon name="close" size={28} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={tabContent} onPress={() => this.switchTab(i)}>
                                <View style={tabInfo}>
                                    <Text style={{color:'#EEEEEE', fontSize:16}} ellipsizeMode="tail" numberOfLines={1}>{tab.siteName}</Text>
                                    <Text style={{color:'#FFFFFF'}} numberOfLines={1} ellipsizeMode='tail'>{tab.url}</Text>
                                </View>
                                <Icon name="chevron-right" size={32} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => {
    return {
        tabs: state.reducer.user.tabs,
        activeTab: state.reducer.user.activeTab
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabDialog);