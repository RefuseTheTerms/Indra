import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';
import { ScrollView, TouchableOpacity, Text, View, TextInput, KeyboardAvoidingView, Linking, Platform } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

class SignInDialog extends React.PureComponent {
    state = {
        email:'',
        password:''
    }

    signIn = () => {
        this.props.userActions.signIn({ email: this.state.email, password: this.state.password })
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

        let authContainer = {
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

        let subText = {
            color:'#AAAAAA',
            textAlign:'center'
        };

        let primaryButton = {
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#1ABC9C',
            height:50,
            color:'#FFFFFF',
            marginTop:10,
            borderRadius:5,
            marginBottom:20
        };

        let accentButton = {
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'transparent',
            height:50,
            color:'#FFFFFF',
            marginTop:10,
            borderRadius:5
        };

        let nameInput = {
            flex:0,
            flexDirection:'row',
            backgroundColor:'#FFFFFF',
            height:45,
            marginTop:10,
            marginBottom:10,
            borderRadius:5,
            color:'#222222',
            paddingLeft:5,
            paddingRight:5
        };

        let buttonText = {
            color:'#FFFFFF',
            fontSize:18
        };

        return(
            <ScrollView style={dialogContainer}>
                <View style={dialogHeader}>
                    <View style={{width:35}}></View>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>Sign In</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(0)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} enabled style={authContainer}>
                    <TextInput
                        onChangeText={(text) => this.setState({email:text})}
                        value={this.state.email}
                        placeholder="E-mail"
                        placeholderTextColor="#AAAAAA"
                        autoCorrect={false}
                        style={nameInput}
                        onSubmitEditing={this.signIn}
                    />
                    <TextInput
                        onChangeText={(text) => this.setState({password:text})}
                        value={this.state.password}
                        placeholder="Password"
                        placeholderTextColor="#AAAAAA"
                        autoCorrect={false}
                        style={nameInput}
                        secureTextEntry={true}
                        onSubmitEditing={this.signIn}
                    />
                    <Button full onPress={this.signIn} style={primaryButton}>
                        <Text style={buttonText}>Confirm</Text>
                    </Button>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInDialog);