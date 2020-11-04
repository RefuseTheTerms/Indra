import { Toast } from 'native-base';

import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import axios from 'axios';

import {
    SIGN_IN,
    SIGN_UP,
    STORE_HISTORY,
    GET_SITETAGS,
    STORE_TAG,
    REMOVE_TAG,
    UPDATE_ACTIVE,
    UPDATE_SITENAME,
    HANDLE_FOOTERTAB,
    SHOW_TAG,
    SHOW_PROGRESS,
    SEARCH_HISTORY,
    SEARCH_TAGS,
    NEW_TAB,
    SWITCH_TAB,
    REMOVE_TAB,
    STORE_TABHISTORY,
    BACK_TABHISTORY,
    FORWARD_TABHISTORY,
    SET_CONTEXT
} from '../constants/userTypes';

const signUp = (user) => async(dispatch) => {
    if(user.name === "" || user.email === "" || user.password === "") {
        Toast.show({text: 'Please enter a Username, Email, and Password', duration: 3000});
    } else {
        dispatch(showProgress({show:true, data: 0.25 }));
        await auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                dispatch(showProgress({show:true, data: 0.40 }));
                axios({
                    method:'POST',
                    url:`https://us-central1-ghost-240221.cloudfunctions.net/signUp?token=${idToken}`,
                    data:JSON.stringify({
                        name: user.name
                    }),
                    headers:{ 'Content-Type': 'application/json' },
                    onUploadProgress: progressEvent => {
                        dispatch(showProgress({ show: true, data: 1 }));
                    }
                })
                .then(response => response.data)
                .then(json => {
                    dispatch(showProgress({show:false, data: 0 }));
                    Toast.show({text: json.success, duration: 3000 });
                    dispatch({ type: SIGN_UP, json });
                    dispatch(handleFooterTab(0));
                })
                .catch(error => {
                    Toast.show({text: error.error, duration: 3000 });
                    dispatch(showProgress({ show: false, data: 0 }))
                })
            })
        })
        .catch((error) => {
            Toast.show({text: error.message, duration: 3000 });
            dispatch(showProgress({ show: false, data: 0 }))
        })
    }
}

const signIn = (user) => async(dispatch) => {
    if(user.email === "" || user.password === "") {
        Toast.show({text: 'Please enter an Email, and Password', duration: 3000});
    } else {
        dispatch(showProgress({show:true, data: 0.25 }));
        await auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                dispatch(showProgress({show: true, data: 0.40 }));
                axios({
                    method:'POST',
                    url:`https://us-central1-ghost-240221.cloudfunctions.net/signIn?token=${idToken}`,
                    data:{},
                    headers:{ 'Content-Type': 'application/json' },
                    onUploadProgress: progressEvent => {
                        dispatch(showProgress({show: true, data: 1}));
                    }
                })
                .then(response => response.data)
                .then(json => {
                    dispatch({ type: SIGN_IN, json });
                    dispatch(showProgress({show: false, data:0}));
                    Toast.show({text: json.success, duration: 3000 });
                    dispatch(handleFooterTab(0));
                })
                .catch(error => {
                    Toast.show({text: error.error, duration: 3000 });
                    dispatch(showProgress({show: false, data:0}));
                })
            })
        })
        .catch((error) => {
            Toast.show({text: error.message, duration: 3000 });
            dispatch(showProgress({show: false, data:0}));
        })
    }
};

const signOut = () => async(dispatch) => {
    firebase.auth().signOut();
    dispatch({ type: SIGN_IN, json: {user: {}} });
}

const storeHistory = (site, siteName) => async(dispatch) => {
    dispatch({ type: STORE_HISTORY, site, siteName });

    await analytics().logEvent('siteVisit', {
        query: site,
    });
    await auth().currentUser.getIdToken(true).then(idToken => {
        axios({
            method:'POST',
            url:`https://us-central1-ghost-240221.cloudfunctions.net/storeHistory?token=${idToken}`,
            data: JSON.stringify({
                site: site,
                siteName: siteName
            }),
            headers:{ 'Content-Type': 'application/json' }
        })
        .then(response => response.data)
        .then(json => {})
    }).catch(function(error) {
        Toast.show({text: json.error, duration: 3000 })
    });
};

const getSiteTags = (url) => async(dispatch) => {
    dispatch({type: GET_SITETAGS, url});
}

const storeTag = (site, tag) => async(dispatch) => {
    if(tag !== "") { 
        dispatch({ type: STORE_TAG, site, tag });
    
        await analytics().logEvent('storeTag', {
            query: site,
            tag: tag
        });
        await auth().currentUser.getIdToken(true).then(idToken => {
            axios({
                method:'POST',
                url:`https://us-central1-ghost-240221.cloudfunctions.net/storeTag?token=${idToken}`,
                data:JSON.stringify({
                    site: site,
                    tag: tag
                }),
                headers:{ 'Content-Type': 'application/json' }
            })
            .then(response => response.data)
            .then(json => {})
            .catch(error => {
                Toast.show({text: error.error, duration: 3000 });
            })
        })
        .catch((error) => {
            Toast.show({text: error.message, duration: 3000 });
        })
    }
}

const removeTag = (site, tag) => async(dispatch) => {
    dispatch({ type: REMOVE_TAG, site, tag });

    await analytics().logEvent('removeTag', {
        query: site,
        tag: tag
    });

    await auth().currentUser.getIdToken(true).then(idToken => {
        axios({
            method:'POST',
            url:`https://us-central1-ghost-240221.cloudfunctions.net/removeTag?token=${idToken}`,
            data:JSON.stringify({
                site: site,
                tag: tag
            }),
            headers:{ 'Content-Type': 'application/json' }
        })
        .then(response => response.data)
        .then(json => {})
        .catch(error => {
            Toast.show({text: error.error, duration: 3000 });
         })
    })
    .catch((error) => {
        Toast.show({text: error.message, duration: 3000 });
    })
}

const updateActive = (url) => async(dispatch, getState) => {
    if(url) {
        //url = url.toLowerCase();
    
        if (/\s/.test(url) ) { 
            url = `https://duckduckgo.com/?q=${url.replace(/ /g, '+')}`
        } 
        else if(url.indexOf('.') === -1) {
            url = `https://duckduckgo.com/?q=${url.replace(/ /g, '+')}`
        } 
        else if(url.charAt(0) === '.' || url.substr(-1) === '.') {
            url = `https://duckduckgo.com/?q=${url.replace(/ /g, '+')}`
        }
        else {
            let pattern = /^((http|https|ftp):\/\/)/;
            if(!pattern.test(url)) {
                url = `https://${url}`;
            }
        }

        let user = getState().reducer.user.user;
        
        dispatch({ type: UPDATE_ACTIVE, url });
    }
}

const updateSiteName = (siteName) => async(dispatch) => {
    dispatch({type: UPDATE_SITENAME, siteName});
}

const handleFooterTab = (index, query = null) => async(dispatch, getState) => {
    let user = getState().reducer.user.user;
    let footerTab = getState().reducer.user.footerTab;
    let tabs = getState().reducer.user.tabs;
    let activeTab = getState().reducer.user.activeTab;
    let site = tabs[activeTab];
    //Topics
    if(index === 1) {
        if(footerTab !== 1) {
            await analytics().logEvent('screen_view', {
                screen_name: 'topics',
            });
            if(Object.entries(user).length === 0 && user.constructor === Object) {
                index = 3;
            } else {
                dispatch(storeHistory(site.url, site.siteName));
                dispatch(getSiteTags(site.url));
            }
        }
    //Dashboard
    } else if(index === 2) {
        if(footerTab !== 2) {
            await analytics().logEvent('screen_view', {
                screen_name: 'dashboard',
            });
            //dispatch(getFavorites());
            if(Object.entries(user).length === 0 && user.constructor === Object) {
                index = 3;
            }
        }
    //signUp
    } else if(index === 3) {
        if(footerTab !== 3) {
            await analytics().logEvent('screen_view', {
                screen_name: 'signUp',
            });
        }
    //signIn
    } else if(index === 4) {
        if(footerTab !== 4) {
            await analytics().logEvent('screen_view', {
                screen_name: 'signIn',
            });
        }
    //Tag Dialog
    } else if(index === 5) {
        if(footerTab !== 5) {
            await analytics().logEvent('screen_view', {
                screen_name: 'tag sites',
                query: query
            });
            dispatch(showTag(query));
        }
    //Help
    } else if(index === 6) {
        if(footerTab !== 6) {
            await analytics().logEvent('screen_view', {
                screen_name: 'help',
            });
        }
    } else if(index === 7) {
        if(footerTab !== 7) {
            
        }
    }

    return dispatch({ type: HANDLE_FOOTERTAB, index });
}

const showTag = (tag) => dispatch => {
    return dispatch({ type: SHOW_TAG, tag })
}

const showProgress = (data) => dispatch => {
    dispatch({ type: SHOW_PROGRESS, data })
}

const searchHistory = (query) => async(dispatch, getState) => {
    let user = getState().reducer.user.user;
    if(Object.entries(user).length !== 0 && user.constructor === Object) {
        dispatch({ type: SEARCH_HISTORY, query });
    }
}

const searchTags = (query) => async(dispatch) => {
    dispatch({ type: SEARCH_TAGS, query });
}

const newTab = (url = null) => async(dispatch) => {
    return dispatch({ type: NEW_TAB, url });
}

const switchTab = (index) => async(dispatch) => {
    return dispatch({ type: SWITCH_TAB, index });
}

const removeTab = (index) => async(dispatch) => {
    return dispatch({ type: REMOVE_TAB, index });
}

const storeTabHistory = (url) => async(dispatch) => {
    return dispatch({ type: STORE_TABHISTORY, url });
}

const backTabHistory = (index) => async(dispatch) => {
    return dispatch({ type: BACK_TABHISTORY, index });
}

const forwardTabHistory = (index) => async(dispatch) => {
    return dispatch({ type: FORWARD_TABHISTORY, index });
}

const setContext = (data) => async(dispatch) => {
    return dispatch({ type: SET_CONTEXT, data });
}

export {
    signUp,
    signIn,
    signOut,
    storeHistory,
    getSiteTags,
    storeTag,
    removeTag,
    updateActive,
    updateSiteName,
    handleFooterTab,
    showTag,
    showProgress,
    searchHistory,
    searchTags,
    newTab,
    switchTab,
    removeTab,
    storeTabHistory,
    backTabHistory,
    forwardTabHistory,
    setContext
}