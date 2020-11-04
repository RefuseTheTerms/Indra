import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';
import { Toast } from 'native-base';

import { ScrollView, View, TouchableOpacity, TouchableWithoutFeedback, Text, Platform, Clipboard, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

class ContextDialog extends React.PureComponent {

    handleContextClose = () => {
        this.props.userActions.handleFooterTab(0);
        this.props.userActions.setContext({src:'', text:'', href:''});
    }

    openNewTab = (url) => {
        this.props.userActions.newTab(url).then(() => {
            this.forceUpdate();
        });
        this.handleContextClose();
    }

    copyToClipboard = (data) => {
        Clipboard.setString(data);
        Toast.show({text: 'Copied to Clipboard', duration: 3000});
        this.handleContextClose();
    }

    render() {
        let offset = this.props.dialogOffset;

        let dialogContainer = {
            width:this.props.width,
            height:this.props.height - offset,
            position:'absolute',
            left:0,
            top:0,
            zIndex:999999,
            flex:0,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center'
        };

        if(Platform.OS === 'ios') {
            if(!DeviceInfo.hasNotch()) {
                dialogContainer.top = 20;
            } else {
                dialogContainer.top = 40;
            }
        }

        let contextContainer = {
            backgroundColor:'#FFFFFF',
            borderRadius:5,
            maxWidth:this.props.width / 1.5,
            maxHeight:this.props.height - offset / 1.5,
            zIndex:99999

        };

        let contextHeader = {
            flex:0,
            flexDirection:'column',
            borderBottomWidth:1,
            borderBottomColor:'#DDDDDD',
            padding:15
        };

        let contextItem = {
            padding:15
        };

        let contextBackground = {
            width:this.props.width,
            height:this.props.height - offset,
            position:'absolute',
            left:0,
            top:0,
            zIndex:9999,
            backgroundColor:'rgba(0, 0, 0, 0.7)',
        };

        return (
            <View style={dialogContainer}>
                <TouchableWithoutFeedback onPress={this.handleContextClose}><View style={contextBackground}></View></TouchableWithoutFeedback>
                <ScrollView style={contextContainer}>
                    {this.props.contextData.href !== "" && this.props.contextData.href !== null ?
                        <View style={contextContainer}>
                            <View style={contextHeader}>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:12}}>{this.props.contextData.text}</Text>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:12}}>{this.props.contextData.href}</Text>
                            </View>
                            <TouchableOpacity style={contextItem} onPress={() => this.openNewTab(this.props.contextData.href)}>
                                <Text style={{fontSize:16}}>Open in new tab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={contextItem} onPress={() => this.copyToClipboard(this.props.contextData.href)}>
                                <Text style={{fontSize:16}}>Copy link address</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={contextItem} onPress={() => this.copyToClipboard(this.props.contextData.text)}>
                                <Text style={{fontSize:16}}>Copy link text</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    } 
                    {this.props.contextData.src !== "" && this.props.contextData.src !== null ?
                        <TouchableOpacity style={contextItem} onPress={() => this.openNewTab(this.props.contextData.src)}>
                            <Text style={{fontSize:16}}>Open Image in new tab</Text>
                        </TouchableOpacity>
                        : null
                    }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        contextData: state.reducer.user.contextData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(ContextDialog);