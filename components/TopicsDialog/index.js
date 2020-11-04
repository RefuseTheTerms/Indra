import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { ScrollView, View, TouchableOpacity, Text, KeyboardAvoidingView, TextInput, FlatList, Keyboard, Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class TopicsDialog extends React.PureComponent {
    state = {
        tagContent:'',
        tagSuggestion: false
    }

    storeTag = (tag = null) => {
        if(tag === null) {
            this.props.userActions.storeTag(this.props.tabs[this.props.activeTab].url, this.state.tagContent.trim());
        } else {
            this.props.userActions.storeTag(this.props.tabs[this.props.activeTab].url, tag.trim())
            .then(() => {
                this.forceUpdate();
                this.props.userActions.searchTags("");
            });
        }

        this.setState({
            tagContent:''
        })
    }

    removeTag = (tag) => {
        this.props.userActions.removeTag(this.props.tabs[this.props.activeTab].url, tag).then(() => {
            this.forceUpdate();
        });
    }

    handleTagInput = (text) => {
        this.setState({
            tagContent: text
        }, () => {
            this.props.userActions.searchTags(this.state.tagContent);
        })
    }

    handleSpace = (e) => {
        if(e.nativeEvent.key === " " || e.nativeEvent.key === 'Enter') {
            this.storeTag();
        }
    }

    renderUserTags = () => {
        if(this.props.user.tags.length > 0) {
            if(this.props.searchTags.length > 0) {
                return (
                    <ScrollView horizontal={true} keyboardShouldPersistTaps='handled' style={{backgroundColor:'#333333', paddingTop:10, paddingBottom:10}}>
                        {this.props.searchTags.map((tag, i) => (
                            <TouchableOpacity onPress={() => this.storeTag(tag.name)} key={i} style={{backgroundColor:'#1ABC9C', borderRadius:5, paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5, marginLeft:5, marginRight: 5}}>
                                <Text style={{color:'#EEEEEE'}}>{tag.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )
            } else {
                return (
                    <ScrollView horizontal={true} keyboardShouldPersistTaps='handled' style={{backgroundColor:'rgba(0, 0, 0, 0.4)', paddingTop:10, paddingBottom:10}}>
                        {this.props.user.tags.map((tag, i) => (
                            <TouchableOpacity onPress={() => this.storeTag(tag.name)} key={i} style={{backgroundColor:'#1ABC9C', borderRadius:5, paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5, marginLeft:5, marginRight: 5}}>
                                <Text style={{color:'#EEEEEE'}}>{tag.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )
            }
        }
    }

    renderCommentInput = () => {
        let commentInput = {
            flexGrow:1,
            flexDirection:'row',
            minHeight:this.state.commentHeight,
            color:'#222222',
            maxWidth:this.props.width - 70,
            maxHeight:50,
        };

        let iconSize = 25;
        if(Platform.OS === 'ios') {
            commentInput.paddingTop = 15;
            commentInput.paddingBottom = 5;
            commentInput.paddingLeft = 5;
            commentInput.fontSize = 18;
            iconSize = 30;
        }

        let commentInputContainer = {
            flex:0,
            flexDirection:'column',
            width:this.props.width,
            minHeight:50,
            zIndex:9998
        };

        let inputOffset = 0;

        let commentInputContainerNoBorder = {
            flex:0,
            flexDirection:'column',
            width:this.props.width,
            minHeight:50,
            zIndex:9998
        };

        let commentInputWrapper = {
            flex:0,
            flexDirection:'row',
            flexGrow:1,
            justifyContent:'space-between',
            backgroundColor:'#FFFFFF',
            borderTopWidth:1,
            borderTopColor:'#1ABC9C',
            maxHeight:200,
        };

        let paddingBottomFix = 100;
        if(!DeviceInfo.hasNotch()) {
            inputOffset = 20;
            paddingBottomFix = 70;
        }

        let sendInput = {
            flex:1,
            alignItems:'center',
            justifyContent:'flex-start',
            maxWidth:35,
            paddingTop:10
        };

        return (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30} enabled style={[(this.props.sentLoading) ? commentInputContainerNoBorder : commentInputContainer]}>
                {this.renderUserTags()}
                <View style={commentInputWrapper}>
                    <ScrollView style={{flex:1}}>
                        <TextInput
                            style={commentInput}
                            onChangeText={(text) => this.handleTagInput(text)}
                            value={this.state.tagContent}
                            multiline={false}
                            placeholder="Create Topics (Separate with Spaces)"
                            placeholderTextColor="#333333"
                            autoCorrect={false}
                            onKeyPress={this.handleSpace}
                        />
                        </ScrollView>
                </View>
            </KeyboardAvoidingView> 
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
            justifyContent:'space-between',
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
            alignItems:'center'
        };

        let dialogTitle = {
            color:'#FFFFFF',
            fontSize:16
        };

        let topicsContainer = {
            backgroundColor:'#3B4F61',
            borderRadius:5,
            borderWidth:1,
            borderColor:'#1ABC9C',
            padding:15,
            margin:15
        };

        let topicsList = {
            flex:0,
            flexDirection:'row',
            flexWrap:'wrap',
            marginTop:15,
            paddingBottom:30,
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

        let tagItemActive = {
            backgroundColor:'#14967c',
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

        return (
            <View style={dialogContainer}>
                <View style={dialogHeader}>
                    <View style={{width:35}}></View>
                    <View style={dialogTitleContainer}>
                        <Text style={dialogTitle}>Topics</Text>
                    </View>
                    <TouchableOpacity style={closeButton} onPress={() => this.props.userActions.handleFooterTab(0)}>
                        <Icon name="close" size={35} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30} enabled>
                    <ScrollView style={topicsContainer}>
                        <Text style={{fontSize:16, color:'#1ABC9C'}}>CURRENT TOPICS</Text>
                        <View style={topicsList}>
                        {this.props.siteTags.length !== 0 ?
                            this.props.siteTags.map((tag, i) => (
                                <TouchableOpacity style={tagItem} key={i} onPress={() => this.removeTag(tag)}>
                                    <Text style={{color:'#FFFFFF', fontSize:16}}>{tag}</Text>
                                </TouchableOpacity>
                            ))
                            :
                            <Text style={{color:'#FFFFFF'}}>Add Your Topics Below</Text>
                        }
                        </View>
                    </ScrollView>
                    {this.renderCommentInput()}
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.reducer.user.user,
        tabs: state.reducer.user.tabs,
        activeTab: state.reducer.user.activeTab,
        siteTags: state.reducer.user.siteTags,
        searchTags: state.reducer.user.searchTags
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(TopicsDialog);