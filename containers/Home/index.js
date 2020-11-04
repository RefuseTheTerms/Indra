import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { ScrollView, Text, View, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler, Platform, Image, Animated, Dimensions } from 'react-native';
import { Container } from 'native-base';
import { WebView } from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Mcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Progress from '../../components/Progress';
import TopicsDialog from '../../components/TopicsDialog';
import DashboardDialog from '../../components/DashboardDialog';
import TagDialog from '../../components/TagDialog';
import HelpDialog from '../../components/HelpDialog';
import SignUpDialog from '../../components/SignUpDialog';
import SignInDialog from '../../components/SignInDialog';
import TabDialog from '../../components/TabDialog';
import ContextDialog from '../../components/ContextDialog';

let verticalOffset = 30;
if(Platform.OS === 'ios') {
    verticalOffset = 0;
}

class Home extends React.PureComponent {
    state = {
        currentSite:'',
        refreshing:false,
        showSite:false,
        stateChange: false,
        fadeAnim: new Animated.Value(1),
        offsetHeight:100,
        intervalId:null,
        currentCount:3,
        loadInterval:null,
        currentLoad:0.25,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        dialogOffset: 70,
        contentOffset: 140,
        showDropMenu:false
    };
    webView = {
        canGoBack: true,
        canGoForward: true,
        ref: null
    };

    componentDidMount() {
        if(Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton(-1));
        }

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                this.setState({
                    offsetHeight: 120
                })
            }
        }
    }

    componentWillUnmount() {
        if(Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
        this.keyboardDidHideListener.remove();
        clearInterval(this.state.intervalId);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.tabs[this.props.activeTab].url !== this.props.tabs[this.props.activeTab].url) {
            this.setState({
                currentSite: this.props.tabs[this.props.activeTab].url
            })
        }
    }

    
    keyboardDidHide = () => {
        this.handleSitePress(false);
    }
    
    handleBackButton = (index = -1) => {
        if(this.props.tabs[this.props.activeTab].history.length > this.props.tabs[this.props.activeTab].activeHistory + 1) {
            this.props.userActions.backTabHistory(index).then(() => {
                this.forceUpdate();
            });
        }
    }

    handleForwardButton = (index = -1) => {
        this.handleDropMenu(false);
        if(this.props.tabs[this.props.activeTab].activeHistory > 0) {
            this.props.userActions.forwardTabHistory(index).then(() => {
                this.forceUpdate();
            })
        }
    }

    handleReloadButton = () => {
        this.handleDropMenu(false);
        this.webView.ref.reload();
    }

    handleDropMenu = (showDropMenu) => {
        this.setState({showDropMenu})
    }

    handleReloadEnd = () => {
        this.setState({refreshing: false});
    }

    handleSiteInput = (text) => {
        this.setState({
            currentSite:text.toLowerCase(),
            //displaySite:text.toLowerCase().split('/')[2]
        }, () => {
            this.props.userActions.searchHistory(this.state.currentSite);
        })
    }

    handleHeaderBlur = () => {
        this.setState({
            currentSite: this.props.tabs[this.props.activeTab].url,
            showSite:false
        })
    }

    handleFooterTab = (index, query = null) => {
        this.props.userActions.handleFooterTab(index, query);
        this.handleDropMenu(false);
    }

    loadStart = () => {
        this.props.userActions.showProgress({ show: true, data: 0.25});
        let loadInterval = setInterval(this.loadTimer, 400);
        this.setState({loadInterval});
    }

    loadTimer = () => {
        if(this.state.currentLoad < 95) {
            this.props.userActions.showProgress({ show: true, data: this.state.currentLoad + 0.10});
            this.setState({
                currentLoad: this.state.currentLoad + 0.10
            })
        } else {
            clearInterval(this.state.loadInterval);
        }
    }

    loadProgress = () => {
        clearInterval(this.state.loadInterval);
        this.setState({ currentLoad: 0.25 })
        this.props.userActions.showProgress({ show: true, data: 1 });
    }

    loadEnd = () => {
        setTimeout(() => {
            this.props.userActions.showProgress({show: false, data: 0})
        }, 150);
    }

    timer = () => {
        if(this.state.currentCount > 0) {
            this.setState({ currentCount: this.state.currentCount - 1 });
        }
    }

    onLayout = (e) => {
        const { width, height } = Dimensions.get('window');
        let dialogOffset = 70;
        let contentOffset = 140;

        if(this.state.width < width) {
            if(Platform.OS === 'ios') {
                if(DeviceInfo.hasNotch()) {
                    dialogOffset = 150;
                    contentoffset = 220;
                }
            } else {
                if(DeviceInfo.hasNotch()) {
                    dialogOffset = 80;
                    contentOffset = 150;
                }
            }
        } else {
            if(Platform.OS === 'ios') {
                if(DeviceInfo.hasNotch()) {
                    dialogOffset = 120;
                    contentOffset = 190;
                }
            } else {
                if(DeviceInfo.hasNotch()) {
                    dialogOffset = 50;
                    contentOffset = 120;
                }
            }
        }

        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            dialogOffset: dialogOffset,
            contentOffset: contentOffset
        });
    }

    onNavigationStateChange = (webViewState) => {
        let offsetHeight = 100;
        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                offsetHeight = 120;
            }
        }

        let intervalId = setInterval(this.timer, 1000);
        if(webViewState.url !== this.props.tabs[this.props.activeTab].url && webViewState.url !== "about:blank" && this.state.stateChange === false && this.state.currentCount === 0) {
            clearInterval(this.state.intervalId);
            this.props.userActions.updateActive(webViewState.url);
            this.props.userActions.storeTabHistory(webViewState.url);
            this.setState({
                offsetHeight:offsetHeight,
                stateChange: false,
                intervalId: intervalId,
                currentCount:3
            }, () => {
                Animated.timing(
                    this.state.fadeAnim,
                    {toValue: 1},
                ).start();
            })
        }
    }
    
    handleSitePress = (option) => {
        this.setState({
            showSite: option
        });
    }

    renderSiteInput = () => {

        let headerInput = {
            backgroundColor:'#FFFFFF',
            color:'#222222',
            flex:1,
            flexGrow:1,
            width:this.state.width - 100,
            borderRadius:25,
            fontSize:16,
            maxHeight:40,
            paddingLeft:10,
        };

        let headerDisplay = {
            backgroundColor:'#FFFFFF',
            color:'#222222',
            flex:1,
            flexGrow:1,
            width:this.state.width - 100,
            height:35,
            borderRadius:25,
            justifyContent:'center',
            paddingLeft:10,
        };

        let siteSplit = this.props.tabs[this.props.activeTab].url.split('/');
        let displaySite = siteSplit[0];
        if(siteSplit[2]) {
            displaySite = siteSplit[2];
        }

        if(this.state.showSite === true) {
            return(
                <TextInput
                    onChangeText={(text) => this.handleSiteInput(text)}
                    value={this.state.currentSite}
                    style={headerInput}
                    placeholder="Search or Enter Site"
                    placeholderTextColor="#222222"
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                    onSubmitEditing={() => this.setSite(this.state.currentSite)}
                    selectTextOnFocus={true}
                    onBlur={this.handleHeaderBlur}
                    autoFocus
                    autoCorrect={false}
                />
            )
        } else {
            return (
                <TouchableWithoutFeedback onPress={() => this.handleSitePress(true)}>
                    <View style={headerDisplay}>
                        <Text style={{color:'#222222', fontSize:18,}}>{displaySite}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

    renderHistorySearch = () => {
        let historySearch = {
            backgroundColor:'rgba(22,22,22, 0.9)',
            paddingLeft:15,
            paddingRight:15,
            position:'absolute',
            width:this.state.width,
            maxHeight:this.state.height / 2,
            top:48.8,
            zIndex:1
        };

        let historyItem = {
            borderBottomColor:'#555555',
            borderBottomWidth:1,
            paddingBottom:15,
            paddingTop:15
         };

        if(this.props.search.length > 0) {
            return (
                <ScrollView style={historySearch} keyboardShouldPersistTaps='handled'>
                    {this.props.search.map((site, i) => (
                        <TouchableHighlight style={historyItem} key={i} onPress={() => this.setSite(site.url)}>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'#CCCCCC'}}  ellipsizeMode="tail" numberOfLines={1}>{site.url}</Text>
                                <Mcon name="arrow-top-left" size={20} color="#555555" />
                            </View>
                        </TouchableHighlight>
                    ))}
                </ScrollView>
            )
        }
    }

    setSite = (site) => {
        this.props.userActions.updateActive(site).then(() => {
            this.forceUpdate();
            this.props.userActions.searchHistory("");
            this.handleHeaderBlur();
        });
    }

    renderTopicsButton = () => {
        let footerItem = {
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            width:this.state.width / 5
        };

        return (
            <TouchableOpacity style={footerItem} onPress={() => this.handleFooterTab(1)}>
                <Image source={require('../../logo.png')} style={{width:36, height:36}} />
            </TouchableOpacity>
        )
    }

    renderDashboardButton = () => {
         let footerItem = {
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            width:this.state.width / 5
        };

        return (
            <TouchableOpacity style={footerItem}  onPress={() => this.handleFooterTab(2)}>
                <Icon name="person" size={36} color="#FFFFFF" />
            </TouchableOpacity>
        )
    }

    renderTopicsDialog = () => {
        if(this.props.footerTab === 1) {
            return (
                <TopicsDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderDashboardDialog = () => {
        if(this.props.footerTab === 2) {
            return (
                <DashboardDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderSignUpDialog = () => {
        if(this.props.footerTab === 3) {
            return (
                <SignUpDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderSignInDialog = () => {
        if(this.props.footerTab === 4) {
            return (
                <SignInDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderTagDialog = () => {
        if(this.props.footerTab === 5) {
            return (
                <TagDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderHelpDialog = () => {
        if(this.props.footerTab === 6) {
            return (
                <HelpDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderTabDialog = () => {
        if(this.props.footerTab === 7) {
            return (
                <TabDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderContextDialog = () => {
        if(this.props.footerTab === 8) {
            return (
                <ContextDialog width={this.state.width} height={this.state.height} dialogOffset={this.state.dialogOffset}/>
            )
        }
    }

    renderDropMenu = () => {
        const menuWrapper = {
            width:this.state.width,
            height:this.state.height - 50,
            position:'absolute',
            left:0,
            top:0,
            backgroundColor:'transparent',
            zIndex:999999,
        };

        const menuBackground = {
            width:this.state.width,
            height:this.state.height - 50,
            position:'absolute',
            left:0,
            top:0,
            zIndex:9999,
        }

        const menuContainer = {
            backgroundColor:'#FFFFFF',
            elevation:4,
            width:Dimensions.get('window').width / 3,
            position:'absolute',
            right:0,
            top:50,
            zIndex:99999
        };

        const menuItem = {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            padding:10
        };
        if(this.state.showDropMenu === true) {
            return (
                <View style={menuWrapper}>
                    <TouchableWithoutFeedback onPress={() => this.handleDropMenu(false)}><View style={menuBackground}></View></TouchableWithoutFeedback>
                    <View style={menuContainer}>
                        <TouchableOpacity style={menuItem} onPress={this.handleReloadButton}>
                            <Icon name="refresh" size={24} />
                            <Text style={{fontSize:16, marginLeft: 10}}>Reload</Text>
                        </TouchableOpacity>
                        {this.props.tabs[this.props.activeTab].activeHistory > 0 ?
                            <TouchableOpacity style={menuItem} onPress={() => this.handleForwardButton(-1)}>
                                <Icon name="chevron-right" size={24} />
                                <Text style={{fontSize:16, marginLeft: 10}}>Forward</Text>
                            </TouchableOpacity>
                            :
                            <View style={menuItem}>
                                <Icon name="chevron-right" size={24} color="#AAAAAA"/>
                                <Text style={{fontSize:16, marginLeft: 10, color:'#AAAAAA'}}>Forward</Text>
                            </View>
                        }
                        <TouchableOpacity style={menuItem} onPress={() => this.handleFooterTab(6)}>
                            <Icon name="help-outline" size={24} />
                            <Text style={{fontSize:16, marginLeft: 10}}>Help</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    renderBackButton = () => {
        let footerItem = {
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            width:this.state.width / 5
        };

        if(this.props.footerTab === 0) {
            if(this.props.tabs[this.props.activeTab].history.length > this.props.tabs[this.props.activeTab].activeHistory + 1) {
                return(
                    <TouchableOpacity style={footerItem} onPress={() => this.handleBackButton(-1)}>
                        <Icon name="navigate-before" size={36} color="#FFFFFF" />
                    </TouchableOpacity>
                )
            } else {
                return (
                    <View style={footerItem}>
                        <Icon name="navigate-before" size={36} color="#AAAAAA" />
                    </View>
                )
            }
        } else {
            return (
                <TouchableOpacity style={footerItem} onPress={() => this.handleFooterTab(0)}>
                    <Mcon name="chevron-down" size={36} color="#FFFFFF" />
                </TouchableOpacity>
            )
        }
        
    }

    renderFooter = () => {

        let outputMin = 100;
        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                outputMin = 130;
            }
        }

        let footer = {
            flex:0,
            flexDirection:'row',
            justifyContent:'space-between',
            height:50,
            width:this.state.width,
            backgroundColor:'#3B4F61',
            position:'absolute',
            bottom:0,
            left:0,
            zIndex:9999,
            transform: [{ 
                translateY: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [outputMin, 0]
                })
            }]
        };

        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                footer.height = 80;
            }
        }

        return (
            <Animated.View style={footer}>    
                {this.renderBackButton()}
                {this.renderTopicsButton()}
                {this.renderDashboardButton()}
            </Animated.View>
        )
    
    }

    renderHeader = () => {
        let headerOffset = 0;
        let outputMin = -100;
        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                headerOffset = 40;
                outputMin = -140;
            } else {
                headerOffset = 20;
            }
        }

        let headerContainer = {
            position: 'absolute',
            height:50,
            width:this.state.width,
            top: headerOffset,
            left: 0,
            zIndex:9999,
            transform: [{ 
                translateY: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [outputMin, 0]
                })
            }],
            backgroundColor:'#3B4F61',
            flex:0,
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            paddingLeft:5,
            paddingRight:5
        };

        let headerRow = {
            flex:0,
            flexDirection:'row',
            alignItems:'center'
        };

        let tabsButton = {
            borderWidth:2,
            borderColor:'#FFFFFF',
            borderRadius:3,
            width:26,
            height:26,
            flex:0,
            justifyContent:'center',
            alignItems:'center',
            marginLeft:10,
            marginRight:1
        };

        return (
            <Animated.View style={headerContainer}>
                <StatusBar backgroundColor="#3B4F61" barStyle="light-content" />
                <View style={headerRow}>
                    {this.renderSiteInput()}
                    <TouchableOpacity style={tabsButton} onPress={() => this.handleFooterTab(7)}>
                        {this.props.tabs.length < 100 ?
                            <Text style={{color:'#FFFFFF', fontSize:16, fontWeight:'bold'}}>{this.props.tabs.length}</Text>
                            :
                            <Text style={{color:'#FFFFFF', fontSize:16, fontWeight:'bold'}}>:D</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleDropMenu(true)}>
                        <Mcon name="dots-vertical" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }

    renderWebView = () => {
        let useWebKit = false;
        if(Platform.OS === 'ios') {
            useWebKit = false;
        }

        return (
            <WebView
                useWebKit={useWebKit}
                bounces={false}
                mediaPlaybackRequiresUserAction={false}
                scalesPageToFit
                javaScriptEnabledAndroid={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                source={{uri: this.props.tabs[this.props.activeTab].url}}
                onNavigationStateChange={ this.onNavigationStateChange.bind(this) }
                originWhitelist={["*"]}
                injectedJavaScript={`
                    (function() {
                        function wrap(fn) {
                            return function wrapper() {
                                var res = fn.apply(this, arguments);
                                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'site', content: window.location.href}));
                                return res;
                            }
                        }

                        history.pushState = wrap(history.pushState);
                        history.replaceState = wrap(history.replaceState);
                        window.addEventListener('popstate', function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'site', content: window.location.href}));
                        });

                        function getSiteName() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'siteName', content: document.title}));
                        }

                        function getLongPress(event) {
                            event = event || window.event;
                            let target = event.target || event.srcElement;
                            let href = "";
                            let text = "";
                            let src = "";

                            let anchor = target.closest("a"); 
                            href = anchor.getAttribute('href');
                            text = target.textContent || target.innerText;
                            src= target.getAttribute("src");

                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'longPress', content: { text, href, src } }));
                        }

                        let lastScrollTop = 0;
                        function getScroll(e) {
                            let scrollDir = false;
                            let scrollTop = false;
                            let st = window.pageYOffset || document.documentElement.scrollTop;
                            if (st > lastScrollTop){
                                scrollDir = false;
                            } else {
                                scrollDir = true;
                            }
                            lastScrollTop = st <= 0 ? 0 : st;

                            if (document.documentElement.scrollTop === 0) {
                                scrollTop = true;
                            }

                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'scroll', content: scrollDir, scrollTop: scrollTop}));
                        }

                        getSiteName();
                        window.addEventListener('scroll', getScroll, false);
                        window.addEventListener('contextmenu', getLongPress, true);

                    })();                       

                    true;
                `}
                onMessage={({ nativeEvent: state }) => {
                    let data = JSON.parse(state.data);
                    if(data.type === 'site') {
                        if (data.content !== this.props.tabs[this.props.activeTab].url) {
                            this.props.userActions.updateActive(data.content);
                        }
                    } else if(data.type === 'siteName') {
                        this.props.userActions.updateSiteName(data.content);
                    } else if(data.type === 'longPress') {
                        if(data.content.href !== "" || data.content.src !== "") {
                            this.props.userActions.setContext(data.content);
                            this.handleFooterTab(8, data.content);
                        }
                    }
                    else if(data.type === 'scroll') {
                        if(data.content === false) {
                            Animated.timing(
                                this.state.fadeAnim,
                                {toValue: 0},
                            ).start();
                            this.setState({
                                offsetHeight:0
                            })
                           
                        } else {
                            Animated.timing(
                                this.state.fadeAnim,
                                {toValue: 1},
                            ).start();
                        }
                    }
                }}
                onLoadStart={this.loadStart}
                onLoad={this.loadProgress}
                onLoadEnd={this.loadEnd}
                ref={(webView) => { this.webView.ref = webView; }}
                style={{maxHeight:this.state.height - this.state.offsetHeight}}
            />
        )
    }

    render() {

        let container = {
            flex:1,
            backgroundColor:'#3B4F61'
        };

        let mainOffset = 50;
        let outputMin = -50;
        let topPadding = 50

        if(Platform.OS === 'ios') {
            if(DeviceInfo.hasNotch()) {
                mainOffset = 90;
                outputMin = -90;
                topPadding = 90;
            }
        }

        let mainView = {
            flex:1,
            paddingTop: topPadding,
            minHeight:this.state.height + mainOffset,
            transform: [{ 
                translateY: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [outputMin, 0]
                })
            }],
        }

        if(Platform.OS === 'ios') {
            if(!DeviceInfo.hasNotch()) {
                container.paddingTop = 20;
            }
        }
      
        return (
            <Container style={container} onLayout={this.onLayout}>
                <Progress />
                {this.renderHeader()}
                {this.renderDropMenu()}
                {this.renderHistorySearch()}
                {this.renderTopicsDialog()}
                {this.renderDashboardDialog()}
                {this.renderHelpDialog()}
                {this.renderFooter()}
                <Animated.View style={mainView}>
                    {this.renderWebView()}
                </Animated.View>
                {this.renderTagDialog()}
                {this.renderSignUpDialog()}
                {this.renderSignInDialog()}
                {this.renderTabDialog()}
                {this.renderContextDialog()}
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.reducer.user.user,
        tabs: state.reducer.user.tabs,
        activeTab: state.reducer.user.activeTab,
        footerTab: state.reducer.user.footerTab,
        search: state.reducer.user.search,
        progress: state.reducer.user.progress
    };
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
}

export default connect( mapStateToProps, mapDispatchToProps )(Home);